const User = require('../models/user');
const Items = require('../models/items');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const findItem = require('../functions/findItem.js');
const findPartialItem = require('../functions/findPartialItem.js');
const giveWeaponID = require('../functions/giveWeaponID.js');
const makeEquipment = require('../functions/makeEquipment');
const titleCase = require('../functions/titleCase');
const findPrefix = require('../functions/findPrefix');

module.exports = {
    name: "open",
    description: "Open your chests or lootboxes with this command, quite possibly the second hardest command to code out.",
    syntax: "{box full name (with spaces)} {number}",
    aliases: ['chest', 'chests', 'pack', 'lootbox', 'lb'],
    cooldown: 5,
    category: "Fun",
    async execute(message, args) {
        // Lowercase all args
        args.map(item => item.toLowerCase());

        // Finds arguments no matter the position
        // Finds packAmt
        let packAmt = 1;
        let packAmtIndex = args.findIndex(arg => /^[1-9]\d*$/g.test(arg))
        if (packAmtIndex != -1) {
            // Extracts packAmt
            packAmt = args[packAmtIndex];
            packAmt = parseInt(packAmt)
            if (packAmt > 5) {
                packAmt = 5;
            }
            // Removes packAmt from args list
            args.splice(packAmtIndex, 1);
        }

        // Finds packType
        let packTypeIndex = args.findIndex(arg => /^[a-z]+$/ig.test(arg))
        if (packTypeIndex == -1) {
            message.channel.send('Please specify a chest or pack that you would like to open');
            return;
        }
        // Extracts packType
        let packType = args[packTypeIndex];
        // Removes packType from args list
        args.splice(packTypeIndex, 1);
        // Uppercase first letter
        packType = packType.charAt(0).toUpperCase() + packType.substring(1);
        console.log(packType)

        let boxType = titleCase(args.join(" "));

        if (!/^((treasure)? ?(chest)?|pack)$/ig.test(boxType)) {
            message.channel.send(`Unknown item. Please better specify item to open.`);
            return;
        }

        // Try to find similar item in db
        let item = await findPartialItem(`${packType}${boxType ? " " + boxType : ""}`);
        console.log(item)
        if (!item) {
            message.channel.send(`That item does not exist!`);
            return;
        }
        if (item.length == 1) {
            boxType = item[0].itemName.split(' ')
            boxType.shift()
            boxType = boxType.join(' ')
            if (boxType == "" || !/^((treasure)? ?(chest)?|pack)$/ig.test(boxType)) {
                message.channel.send(`Specify chest or pack to open.`);
                return;
            }
        }
        else {
            console.log('more than 1 item returned? need to be more specific')
            // maybe send message
            message.channel.send(`More than 1 item similar to ${packType}${boxType ? " " + boxType : ""}. Need to be more specific.`);
            return;
        }

        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                //Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }

            if (!user.inv[`${packType} ${boxType}`] || user.inv[`${packType} ${boxType}`].quantity < packAmt) {
                message.channel.send(`You do not own enough ${packType} ${boxType} to open yet.`)
                return;
            }

            let guest = user.player.name;
            let openEmbed = new Discord.MessageEmbed()
                .setTitle(`${boxType} opened!`)
                .setColor('#000001');
            switch (boxType) {
                case 'Pack':
                    switch (packType) {
                        case 'Fruits':
                            const spoils = {
                                "Apple": 1,
                                "Banana": 2,
                                "Orange": 3,
                                "Pear": 4,
                            }

                            names = Object.keys(spoils)
                            amts = Object.values(spoils)
                            for (let i = 0; i < names.length; i++) {
                                if (user.inv[names[i]]) {
                                    user.inv[names[i]].quantity += amts[i] * packAmt;
                                }
                                else {
                                    user.inv[names[i]] = await findItem(names[i])
                                    user.inv[names[i]].quantity = amts[i] * packAmt;
                                }
                                openEmbed.addField(`${guest} gained ${amts[i] * packAmt} ${names[i]}${(amts[i] * packAmt) > 1 ? "s" : ""}.`, '\u200b')
                            }
                            break;

                        case 'Gold':
                            function randomGoldgen(min, max) {
                                const r = (Math.random() * (max - min)) + min
                                return Math.floor(r)
                            }

                            let goldTotal = 0;
                            // unfair generation, low prob of high numbers, but officially get between 30 to 120 gold
                            for (i = 0; i < packAmt; i++) {
                                let prec = randomGoldgen(10, 100.01) / 100
                                let gachaGold = randomGoldgen(30, prec * 120)
                                goldTotal += gachaGold;
                            }
                            user.currency += goldTotal;
                            openEmbed.addField(`${guest} gained ${goldTotal} currency from Gold Pack <:cash_24:751784973488357457>​`, '\u200b');
                            break;
                        case 'Jericho':
                            let jericho = 0;
                            for (i = 0; i < packAmt; i++) {
                                let jroll = Math.floor(Math.random() * 6);
                                if (jroll == 0) {
                                    jericho += 1;
                                }
                                else {
                                    jericho += jroll;
                                }
                            }
                            if (user.inv['Jericho Jehammad']) {
                                user.inv['Jericho Jehammad'].quantity += jericho;
                            }
                            else {
                                user.inv['Jericho Jehammad'] = await findItem('Jericho Jehammad');
                                user.inv['Jericho Jehammad'].quantity = jericho;
                            }

                            openEmbed.addField(`${guest} gained ${jericho} Jericho Jehammad${jericho > 1 ? "s" : ""}.`, '\u200b');

                            break;
                        case 'Swords':
                        case 'Boots':
                            //but why
                            if (packAmt > 5) {
                                packAmt = 5;
                                message.channel.send(`You may only open up to 5 ${packType} packs at once!`);
                            }

                            let equipment;
                            // Chance table
                            if (packType == 'Swords') {
                                equipment = {
                                    'Long Sword': 20,
                                    'Heavy Sword': 20,
                                    'Staff': 20,
                                    'Axe': 20,
                                    'Bow': 20,
                                    'Ice Rapier': 5,
                                    'Cursed Cutlass': 5,
                                    'Dusk Blade': 1,
                                    'Eclipse Blade': 1
                                }
                            }
                            if (packType == 'Boots') {
                                equipment = {
                                    'Sneakers': 20,
                                    'Rubber Boots': 20,
                                    'Hiking Boots': 20,
                                    'Magic Shoes': 5,
                                    'Clown Shoes': 5,
                                    'Elven Boots': 5,
                                    'Spiked Cowboy Boots': 1,
                                    'Shadow Step Boots': 1
                                }
                            }

                            let totalChance = 0;
                            // no of equipment in chance table
                            let no_eq = Object.keys(equipment).length
                            for (i = 0; i < no_eq; i++) {
                                totalChance += Object.values(equipment)[i];
                                console.log(Object.values(equipment))
                            }

                            for (i = 0; i < packAmt; i++) {
                                // index of equipment in chance table
                                let randomeqid = -1
                                // while no item is picked
                                while (randomeqid == -1) {
                                    for (j = 0; j < no_eq; j++) {
                                        console.log(`Chance ${Object.values(equipment)[j] / totalChance}`)
                                        if (Math.random() < Object.values(equipment)[j] / totalChance) {
                                            randomeqid = j;
                                        }
                                    }
                                }

                                let eqprize = Object.keys(equipment)[randomeqid];
                                let eqPrizeName = await giveWeaponID(eqprize);
                                user.inv[eqPrizeName] = await makeEquipment(eqprize);
                                openEmbed.addField(`${guest} gained 1 ${eqprize} opening a ${packType} Pack.`, '\u200b')
                            }
                            break;
                        default:
                            message.channel.send(`This pack does not exist.`);
                            return;
                    }

                    user.inv[`${packType} Pack`].quantity -= packAmt;
                    if (user.inv[`${packType} Pack`].quantity == 0) {
                        delete user.inv[`${packType} Pack`];
                    }
                    openEmbed.addField(`${guest} has successfully opened ${packAmt} ${packType} pack${packAmt > 1 ? "s" : ""}.`, '\u200b')

                    break;

                case 'Treasure Chest' || 'Chest' || 'Treasure':
                    let chestEmote;

                    // Ratio based
                    let boxLootTable = {
                        "common": {
                            "Apple": { dropChance: 60, minQuantity: 1, maxQuantity: 1 },
                            "Banana": { dropChance: 39, minQuantity: 1, maxQuantity: 1 },
                            "Orange": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
                            "Wooden Sword": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
                            "Stone Sword": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
                            "Iron Sword": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
                            "Rag Boots": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
                            "Cloth Boots": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
                            "Leather Boots": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
                            "Rag Hood": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
                            "Cloth Hood": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
                            "Leather Hood": { dropChance: 1, minQuantity: 1, maxQuantity: 1 }
                        },
                        "uncommon": {
                            "Apple": { dropChance: 60, minQuantity: 1, maxQuantity: 5 },
                            "Banana": { dropChance: 34, minQuantity: 1, maxQuantity: 2 },
                            "Orange": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
                            "Iron Sword": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
                            "Long Sword": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
                            "Heavy Sword": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
                            "Axe": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
                            "Bow": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
                            "Staff": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
                            "Leather Boots": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
                            "Sneakers": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
                            "Rubber Boots": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
                            "Hiking Boots": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
                            "Leather Hood": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
                            "Jericho Jehammad": { dropChance: 1, minQuantity: 3, maxQuantity: 3 }
                        },
                        "rare": {
                            "Apple": { dropChance: 1, minQuantity: 5, maxQuantity: 20 },
                            "Banana": { dropChance: 3, minQuantity: 5, maxQuantity: 10 },
                            "Orange": { dropChance: 4, minQuantity: 2, maxQuantity: 5 },
                            "Basic Axe": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
                            "Basic Bow": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
                            "Basic Staff": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
                            "Ice Rapier": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
                            "Cursed Cutlass": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
                            "Hiking Boots": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
                            "Magic Shoes": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
                            "Clown Shoes": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
                            "Elven Boots": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
                            "Jericho Jehammad": { dropChance: 1, minQuantity: 5, maxQuantity: 5 }
                        },
                        "epic": {
                            "Watermelon": { dropChance: 10, minQuantity: 2, maxQuantity: 5 },
                            "Banana": { dropChance: 50, minQuantity: 10, maxQuantity: 30 },
                            "Orange": { dropChance: 39, minQuantity: 5, maxQuantity: 10 },
                            "Jericho Jehammad": { dropChance: 1, minQuantity: 50, maxQuantity: 50 },
                            "Dusk Blade": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
                            "Eclipse Blade": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
                            "Spiked Cowboy Boots": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
                            "Shadow Step Boots": { dropChance: 1, minQuantity: 1, maxQuantity: 1 }
                        },
                        "legendary": {
                            "Watermelon": { dropChance: 39, minQuantity: 5, maxQuantity: 10 },
                            "Falafel": { dropChance: 50, minQuantity: 1, maxQuantity: 1 },
                            "Spaghetti": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
                            "Jericho Jehammad": { dropChance: 1, minQuantity: 100, maxQuantity: 100 }
                            // "Quick Wolf Kunais": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
                            // "The Broccoli Blade": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
                            // "Inhumane Nightbringer": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
                            // "Blade Of Jericho": { dropChance: 1, minQuantity: 1, maxQuantity: 1 }
                        },
                        "mythic": {
                            "Watermelon": { dropChance: 1, minQuantity: 100, maxQuantity: 100 },
                            "Falafel": { dropChance: 29, minQuantity: 2, maxQuantity: 10 },
                            "Spaghetti": { dropChance: 70, minQuantity: 2, maxQuantity: 10 },
                            "Jericho Jehammad": { dropChance: 1, minQuantity: 100, maxQuantity: 1000 }
                        }
                    }

                    switch (packType.toLowerCase()) {
                        case "common":
                            chestEmote = "<:CommonChest:819856620572901387>"
                            break;
                        case "uncommon":
                            chestEmote = "<:UncommonChest:820272834348711976>"
                            break;
                        case "rare":
                            chestEmote = "<:RareChest:820273250629582858>"
                            break;
                        case "epic":
                            chestEmote = "<:EpicChest:820273750289023007>"
                            break;
                        case "legendary":
                            chestEmote = "<:LegendaryChest:820274118817611777>"
                            break;
                        case "mythic":
                            chestEmote = "<:MythicChest:820274344059994122>"
                            break;
                    }

                    //change 1 when quantityToOpen is implemented
                    if (user.inv[packType + " Treasure Chest"].quantity < packAmt) {
                        message.channel.send("You do not have a sufficient number of chests to open");
                        return;
                    }
                    if (!user.inv[packType + " Treasure Chest"]) {
                        message.channel.send(`You do not have a ${packType} Treasure Chest`);
                        return;
                    }
                    // Change embed title
                    openEmbed.setTitle(`${packAmt} ${packType} Treasure Chest ${chestEmote} opened!`)

                    //Contains drop rates for items in the boxes
                    totalDrops = [];
                    packType = packType.toLowerCase()

                    // Contains chance and quantity dropped
                    dropInfo = Object.values(boxLootTable[packType]);
                    dropNames = Object.keys(boxLootTable[packType]);

                    let totalChance = 0
                    for (i = 0; i < dropInfo.length; i++) {
                        totalChance += dropInfo[i].dropChance;
                    }
                    // Opens amount of chest user wants to open
                    for (j = 0; j < packAmt; j++) {
                        // Makes sure user gets at least 1 drop per chest
                        let drops = []
                        while (drops.length == 0) {
                            for (i = 0; i < dropNames.length; i++) {
                                rng = Math.random()
                                if (rng <= dropInfo[i].dropChance / totalChance) {
                                    quantityDropped = Math.floor(Math.random() * dropInfo[i].maxQuantity + dropInfo[i].minQuantity);
                                    drops.push([dropNames[i], quantityDropped])
                                    console.log(dropNames[i])
                                    console.log(quantityDropped)
                                    if (totalDrops.find(element => element[0] == dropNames[i])) {
                                        totalDrops.find(element => element[0] == dropNames[i])[1] += quantityDropped;
                                        console.log(totalDrops.find(element => element[0] == dropNames[i]))
                                    }
                                    else {
                                        totalDrops.push([dropNames[i], quantityDropped])
                                        console.log(totalDrops)
                                    }

                                }
                            }
                        }

                    }

                    // put into discord
                    let name = message.member.user.tag.toString();
                    // Removes tag from name
                    name = name.split("#", name.length - 4)[0];

                    for (i = 0; i < totalDrops.length; i++) {
                        let itemName = totalDrops[i][0];
                        let itemObject = await findItem(itemName)
                        // drops = [[dropName, dropQuantity]]
                        if (itemObject.type == 'equipment') {
                            let addItem = await makeEquipment(itemName);
                            // Adds multiple of the same equipment as different items due to unique id
                            for (let j = 0; j < totalDrops[i][1]; j++) {
                                fullItemName = await giveWeaponID(itemName);
                                user.inv[fullItemName] = addItem;
                                user.inv[fullItemName].quantity = 1;
                                openEmbed.addField(`${itemObject.emote + fullItemName}`, `1`);
                            }
                            continue;
                        }
                        else if (user.inv[itemName]) {
                            user.inv[itemName].quantity += totalDrops[i][1];
                        }
                        else {
                            // Add item in inventory
                            user.inv[itemName] = itemObject;
                            user.inv[itemName].quantity = totalDrops[i][1];
                        }

                        console.log(itemName)
                        openEmbed.addField(`${itemObject.emote + itemName}`, `${totalDrops[i][1]}`);
                    }
                    // Removes treasure chest from inventory
                    user.inv[packType.charAt(0).toUpperCase() + packType.slice(1) + " Treasure Chest"].quantity -= packAmt;
                    if (user.inv[packType.charAt(0).toUpperCase() + packType.slice(1) + " Treasure Chest"].quantity == 0) {
                        delete user.inv[packType.charAt(0).toUpperCase() + packType.slice(1) + " Treasure Chest"];
                    }
                    break;

                default:
                    message.channel.send(`This box type does not exist.`);
                    return;
            }

            message.channel.send({ embeds: [openEmbed] })
            user.markModified('inv');
            user.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));
        });
    }
}

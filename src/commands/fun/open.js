const User = require('../../models/user');
const Discord = require('discord.js');
const findItem = require('../../functions/findItem.js');
const findPartialItem = require('../../functions/findPartialItem.js');
const giveWeaponID = require('../../functions/giveWeaponID.js');
const makeEquipment = require('../../functions/makeEquipment');
const titleCase = require('../../functions/titleCase');

module.exports = {
    name: "open",
    description: "Open your chests or lootboxes with this command, quite possibly the second hardest command to code out.",
    syntax: "{box full name (with spaces)} {number}",
    aliases: ['chest', 'chests', 'pack', 'lootbox', 'lb'],
    cooldown: 5,
    category: "Fun",
    async execute({ message, args, prefix, client }) {
        // Lowercase all args
        args.map(item => item.toLowerCase());

        // Finds arguments no matter the position
        // Finds packAmt
        let packAmt = 1;
        const packAmtIndex = args.findIndex(arg => /^[1-9]\d*$/g.test(arg));
        if (packAmtIndex != -1) {
            // Extracts packAmt
            packAmt = args[packAmtIndex];
            packAmt = parseInt(packAmt);
            if (packAmt > 5) {
                packAmt = 5;
            }
            // Removes packAmt from args list
            args.splice(packAmtIndex, 1);
        }

        // Finds packType
        const packTypeIndex = args.findIndex(arg => /^[a-z]+$/ig.test(arg));
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

        let boxType = titleCase(args.join(" "));

        if (!/^((treasure)? ?(chest)?|pack)$/ig.test(boxType)) {
            message.channel.send(`Unknown item. Please better specify item to open.`);
            return;
        }

        // Try to find similar item in db
        const item = await findPartialItem(`${packType}${boxType ? " " + boxType : ""}`);
        if (!item) {
            message.channel.send(`That item does not exist!`);
            return;
        }
        if (item.length == 1) {
            boxType = item[0].itemName.split(' ');
            boxType.shift();
            boxType = boxType.join(' ');
            if (boxType == "" || !/^((treasure)? ?(chest)?|pack)$/ig.test(boxType)) {
                message.channel.send(`Specify chest or pack to open.`);
                return;
            }
        } else {
            // maybe send message
            message.channel.send(`More than 1 item similar to ${packType}${boxType ? " " + boxType : ""}. Need to be more specific.`);
            return;
        }

        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }
            if ((packType == 'Weapons' || packType == 'Swords') && boxType == 'Pack'){
                if (user.inv[`Swords Pack`]){
                    packType = 'Swords';
                }else{
                    packType = 'Weapons';
                }
            }

            if (!user.inv[`${packType} ${boxType}`] || user.inv[`${packType} ${boxType}`].quantity < packAmt) {
                message.channel.send(`You do not own enough ${packType} ${boxType} to open yet.`);
                return;
            }

            const guest = user.player.name;
            const openEmbed = new Discord.MessageEmbed()
                .setTitle(`${boxType} opened!`)
                .setDescription(`The following items have been added to your inventory:`)
                .setColor('#000001')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

            switch (boxType) {
                case 'Pack':
                    switch (packType) {
                        // Fruits pack
                        case 'Fruits': {
                            const names = Object.keys(spoils);
                            const amts = Object.values(spoils);
                            for (let i = 0; i < names.length; i++) {
                                if (user.inv[names[i]]) {
                                    user.inv[names[i]].quantity += amts[i] * packAmt;
                                } else {
                                    user.inv[names[i]] = await findItem(names[i]);
                                    user.inv[names[i]].quantity = amts[i] * packAmt;
                                }
                                openEmbed.addField(`${guest} gained ${amts[i] * packAmt} ${names[i]}${(amts[i] * packAmt) > 1 ? "s" : ""}.`, '\u200b');
                            }
                            break;
                        }
                        // Gold pack
                        case 'Gold': {
                            let goldTotal = 0;
                            // unfair generation, low prob of high numbers, but officially get between 30 to 120 gold
                            for (let i = 0; i < packAmt; i++) {
                                const prec = randomGoldgen(10, 100.01) / 100;
                                const gachaGold = randomGoldgen(30, prec * 120);
                                goldTotal += gachaGold;
                            }
                            user.currency += goldTotal;
                            openEmbed.addField(`${guest} gained ${goldTotal} currency from Gold Pack <:cash_24:751784973488357457>`, '\u200b');
                            break;
                        }
                        // Jericho pack
                        case 'Jericho': {
                            let jericho = 0;
                            for (let i = 0; i < packAmt; i++) {
                                const jroll = Math.floor(Math.random() * (50 - 20 + 1) + 20);
                                if (jroll == 0) {
                                    jericho += 1;
                                } else {
                                    jericho += jroll;
                                }
                            }
                            if (user.inv['Jericho Jehammad']) {
                                user.inv['Jericho Jehammad'].quantity += jericho;
                            } else {
                                user.inv['Jericho Jehammad'] = await findItem('Jericho Jehammad');
                                user.inv['Jericho Jehammad'].quantity = jericho;
                            }

                            openEmbed.addField(`${guest} gained ${jericho} Jericho Jehammad${jericho > 1 ? "s" : ""}.`, '\u200b');

                            break;
                        }
                        case 'Swords' || 'Weapons' || 'Boots': {
                            let equipment;
                            // but why
                            if (packAmt > 5) {
                                packAmt = 5;
                                message.channel.send(`You may only open up to 5 ${packType} packs at once!`);
                            }

                            // Chance table
                            if (packType == 'Swords' || packType == 'Weapons') {
                                equipment = weaponsLootTable;
                            } else if (packType == 'Boots') {
                                equipment = bootsLootTable;
                            }

                            let totalChance = 0;
                            // no of equipment in chance table
                            const no_eq = Object.keys(equipment).length;
                            for (let i = 0; i < no_eq; i++) {
                                totalChance += Object.values(equipment)[i];
                            }

                            for (let i = 0; i < packAmt; i++) {
                                // index of equipment in chance table
                                let randomeqid = -1;
                                // while no item is picked
                                while (randomeqid == -1) {
                                    for (let j = 0; j < no_eq; j++) {
                                        if (Math.random() < Object.values(equipment)[j] / totalChance) {
                                            randomeqid = j;
                                        }
                                    }
                                }

                                const eqprize = Object.keys(equipment)[randomeqid];
                                const eqPrizeName = await giveWeaponID(eqprize);
                                user.inv[eqPrizeName] = await makeEquipment(eqprize);
                                openEmbed.addField(`${guest} gained 1 ${eqprize} opening a ${packType} Pack.`, '\u200b');
                            }
                            break;
                        }
                        default:
                            message.channel.send(`This pack does not exist.`);
                            return;
                    }

                    user.inv[`${packType} Pack`].quantity -= packAmt;
                    if (user.inv[`${packType} Pack`].quantity == 0) {
                        delete user.inv[`${packType} Pack`];
                    }
                    openEmbed.addField(`${guest} has successfully opened ${packAmt} ${packType} pack${packAmt > 1 ? "s" : ""}.`, '\u200b');

                    break;

                case 'Treasure Chest' || 'Chest' || 'Treasure': {
                    // Contains drop rates for items in the boxes
                    const totalDrops = [];
                    let totalChance = 0;
                    const chestEmote = treasureChestEmotes[packType.toLowerCase()];

                    // change 1 when quantityToOpen is implemented
                    if (user.inv[packType + " Treasure Chest"].quantity < packAmt) {
                        message.channel.send("You do not have a sufficient number of chests to open");
                        return;
                    }
                    if (!user.inv[packType + " Treasure Chest"]) {
                        message.channel.send(`You do not have a ${packType} Treasure Chest`);
                        return;
                    }
                    // Change embed title
                    openEmbed.setTitle(`${packAmt} ${packType} Treasure Chest ${chestEmote} opened!`);

                    packType = packType.toLowerCase();
                    // Contains chance and quantity dropped
                    const dropInfo = Object.values(boxLootTable[packType]);
                    const dropNames = Object.keys(boxLootTable[packType]);

                    for (let i = 0; i < dropInfo.length; i++) {
                        totalChance += dropInfo[i].dropChance;
                    }
                    // Opens amount of chest user wants to open
                    for (let j = 0; j < packAmt; j++) {
                        // Makes sure user gets at least 1 drop per chest
                        const drops = [];
                        while (drops.length == 0) {
                            for (let i = 0; i < dropNames.length; i++) {
                                const rng = Math.random();
                                if (rng <= dropInfo[i].dropChance / totalChance) {
                                    const quantityDropped = Math.floor(Math.random() * dropInfo[i].maxQuantity + dropInfo[i].minQuantity);
                                    drops.push([dropNames[i], quantityDropped]);
                                    if (totalDrops.find(element => element[0] == dropNames[i])) {
                                        totalDrops.find(element => element[0] == dropNames[i])[1] += quantityDropped;
                                    } else {
                                        totalDrops.push([dropNames[i], quantityDropped]);
                                    }

                                }
                            }
                        }

                    }

                    for (let i = 0; i < totalDrops.length; i++) {
                        const itemName = totalDrops[i][0];
                        const itemObject = await findItem(itemName);
                        // drops = [[dropName, dropQuantity]]
                        if (itemObject.type == 'equipment') {
                            const addItem = await makeEquipment(itemName);
                            // Adds multiple of the same equipment as different items due to unique id
                            for (let j = 0; j < totalDrops[i][1]; j++) {
                                const fullItemName = await giveWeaponID(itemName);
                                user.inv[fullItemName] = addItem;
                                user.inv[fullItemName].quantity = 1;
                                openEmbed.addField(`${itemObject.emote + fullItemName}`, `1`);
                            }
                            continue;
                        } else if (user.inv[itemName]) {
                            user.inv[itemName].quantity += totalDrops[i][1];
                        } else {
                            // Add item in inventory
                            user.inv[itemName] = itemObject;
                            user.inv[itemName].quantity = totalDrops[i][1];
                        }
                        openEmbed.addField(`${itemObject.emote + itemName}`, `${totalDrops[i][1]}`);
                    }
                    // Removes treasure chest from inventory
                    user.inv[packType.charAt(0).toUpperCase() + packType.slice(1) + " Treasure Chest"].quantity -= packAmt;
                    if (user.inv[packType.charAt(0).toUpperCase() + packType.slice(1) + " Treasure Chest"].quantity == 0) {
                        delete user.inv[packType.charAt(0).toUpperCase() + packType.slice(1) + " Treasure Chest"];
                    }
                    break;
                }
                default:
                    message.channel.send(`This box type does not exist.`);
                    return;
            }

            message.channel.send({ embeds: [openEmbed] });
            user.markModified('inv');
            user.save()
                .then(() => console.log("open"))
                .catch(err => console.error(err));
        });
    },
};

function randomGoldgen(min, max) {
    const r = (Math.random() * (max - min)) + min;
    return Math.floor(r);
}
// Fruit pack drop rates
const spoils = {
    "Apple": 1,
    "Banana": 2,
    "Orange": 3,
    "Pear": 4,
};
// Loot box drop rates
const boxLootTable = {
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
        "Leather Hood": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Rags": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
        // "Shirt": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        // "Leather Chestplate": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Rag Shorts": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
        // "Cloth Pants": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        // "Leather Pants": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Jericho Jehammad": { dropChance: 40, minQuantity: 5, maxQuantity: 15 },
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
        // "Wooden Chestplate": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
        // "Stone Chestplate": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        // "Iron Chestplate": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Skirts": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
        // "Jeans": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        // "Hiking Pants": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Steel Bucket": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
        // "Iron Helmet": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        // "Top Hat": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Jericho Jehammad": { dropChance: 40, minQuantity: 10, maxQuantity: 30 },
    },
    "rare": {
        "Apple": { dropChance: 60, minQuantity: 5, maxQuantity: 20 },
        "Banana": { dropChance: 40, minQuantity: 5, maxQuantity: 10 },
        "Orange": { dropChance: 10, minQuantity: 2, maxQuantity: 5 },
        "Axe": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Bow": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Staff": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Ice Rapier": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Cursed Cutlass": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Hiking Boots": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Magic Shoes": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Clown Shoes": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Elven Boots": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Clown Top": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Clown Bottom": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Clown Wig": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Juggling Pins": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Magic Robe Hood": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Magic Robe": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Magic Braies": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Pirate Hat": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Pirate Vest": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Pirate Breeches": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Pirate Boots": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Elven Hat": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Elven Tunic": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Elven Breeches": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Elven Bow": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Jericho Jehammad": { dropChance: 40, minQuantity: 20, maxQuantity: 40 },
    },
    "epic": {
        "Watermelon": { dropChance: 10, minQuantity: 2, maxQuantity: 5 },
        "Banana": { dropChance: 60, minQuantity: 10, maxQuantity: 30 },
        "Orange": { dropChance: 40, minQuantity: 5, maxQuantity: 10 },
        "Dusk Blade": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Eclipse Blade": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Spiked Cowboy Boots": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Shadow Step Boots": { dropChance: 40, minQuantity: 25, maxQuantity: 50 },
        "Jericho Jehammad": { dropChance: 40, minQuantity: 40, maxQuantity: 80 },
    },
    "legendary": {
        "Watermelon": { dropChance: 39, minQuantity: 5, maxQuantity: 10 },
        "Falafel": { dropChance: 50, minQuantity: 5, maxQuantity: 15 },
        "Spaghetti": { dropChance: 10, minQuantity: 15, maxQuantity: 15 },
        "Jericho Jehammad": { dropChance: 40, minQuantity: 80, maxQuantity: 120 },
        // "Quick Wolf Kunais": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "The Broccoli Blade": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Inhumane Nightbringer": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Blade Of Jericho": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Hermes Boots": { dropChance: 1, minQuantity: 1, maxQuantity: 1 }
    },
    "mythic": {
        "Watermelon": { dropChance: 1, minQuantity: 100, maxQuantity: 100 },
        "Falafel": { dropChance: 29, minQuantity: 20, maxQuantity: 35 },
        "Spaghetti": { dropChance: 70, minQuantity: 20, maxQuantity: 35 },
        "Jericho Jehammad": { dropChance: 40, minQuantity: 100, maxQuantity: 200 },
    },
};
// Sword pack drop rates
const weaponsLootTable = {
    'Long Sword': 20,
    'Heavy Sword': 20,
    'Staff': 20,
    'Axe': 20,
    'Bow': 20,
    'Ice Rapier': 5,
    'Cursed Cutlass': 5,
    // 'Juggling Pins': 5,
    // 'Elven Bow': 5,
    'Dusk Blade': 1,
    'Eclipse Blade': 1,
};
// Boots pack drop rates
const bootsLootTable = {
    'Sneakers': 20,
    'Rubber Boots': 20,
    'Hiking Boots': 20,
    'Magic Shoes': 5,
    'Clown Shoes': 5,
    'Elven Boots': 5,
    // 'Pirate Boots': 5,
    'Spiked Cowboy Boots': 1,
    'Shadow Step Boots': 1,
};
// Treasure chest emotes
const treasureChestEmotes = {
    "common": "<:CommonChest:819856620572901387>",
    "uncommon": "<:UncommonChest:820272834348711976>",
    "rare": "<:RareChest:820273250629582858>",
    "epic": "<:EpicChest:820273750289023007>",
    "legendary": "<:LegendaryChest:820274118817611777>",
    "mythic": "<:MythicChest:820274344059994122>",
};

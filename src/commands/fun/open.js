const User = require('../../models/user');
const Discord = require('discord.js');
const findItem = require('../../functions/findItem.js');
const findPartialItem = require('../../functions/findPartialItem.js');
const giveWeaponID = require('../../functions/giveWeaponID.js');
const makeEquipment = require('../../functions/makeEquipment');
const titleCase = require('../../functions/titleCase');
const { regex } = require('../../constants/regex');

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
        const packAmtIndex = args.findIndex(arg => regex.anyInt.test(arg));
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
            if ((packType == 'Weapons' || packType == 'Swords') && boxType == 'Pack') {
                if (user.inv[`Swords Pack`]) {
                    packType = 'Swords';
                } else {
                    packType = 'Weapons';
                }
            }

            if (!user.inv[`${packType} ${boxType}`] || user.inv[`${packType} ${boxType}`].quantity < packAmt) {
                message.channel.send(`You do not own enough ${packType} ${boxType} to open yet.`);
                return;
            }

            const guest = user.player.name;
            const openEmbed = new Discord.MessageEmbed()
                .setTitle(`${packAmt} ${packType} ${boxType} opened!`)
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
                            let concatString = "";
                            for (let i = 0; i < names.length; i++) {
                                if (user.inv[names[i]]) {
                                    user.inv[names[i]].quantity += amts[i] * packAmt;
                                } else {
                                    user.inv[names[i]] = await findItem(names[i]);
                                    user.inv[names[i]].quantity = amts[i] * packAmt;
                                }
                                concatString += `x${amts[i] * packAmt} ${names[i]}\n`;

                            }
                            openEmbed.addField(`Contents`, concatString);
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

                            openEmbed.addField(`Contents`, `x${goldTotal} Gold <:cash_24:751784973488357457>`);
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

                            openEmbed.addField(`Contents`, `x${jericho} Jericho Jehammad${jericho > 1 ? "s" : ""}`);
                            break;
                        }
                        case 'Swords':
                        case 'Helmet':
                        case 'Chestplate':
                        case 'Leggings':
                        case 'Boots':
                        case 'Weapons': {
                            let equipment;
                            let concatString = "";
                            // but why
                            if (packAmt > 5) {
                                packAmt = 5;
                                message.channel.send(`You may only open up to 5 ${packType} packs at once!`);
                            }

                            // Chance table
                            if (packType == 'Swords' || packType == 'Weapons') {
                                equipment = weaponsLootTable;
                            } else if (packType == 'Helmet') {
                                equipment = helmetLootTable;
                            } else if (packType == 'Chestplate') {
                                equipment = chestplateLootTable;
                            } else if (packType == 'Leggings') {
                                equipment = leggingsLootTable;
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
                                concatString += `x1 ${eqPrizeName}\n`;
                            }
                            openEmbed.addField(`Contents`, concatString);
                            break;
                        }
                        default:
                            console.log(packType);
                            message.channel.send(`This pack does not exist.`);
                            return;
                    }

                    user.inv[`${packType} Pack`].quantity -= packAmt;
                    if (user.inv[`${packType} Pack`].quantity == 0) {
                        delete user.inv[`${packType} Pack`];
                    }
                    // openEmbed.addField(`${guest} has successfully opened ${packAmt} ${packType} pack${packAmt > 1 ? "s" : ""}.`, '\u200b');

                    break;

                case 'Treasure Chest': {
                    // Contains drop rates for items in the boxes
                    const totalDrops = [];
                    const chestEmote = treasureChestEmotes[packType.toLowerCase()];
                    let totalChance = 0;
                    let concatString = "";

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
                    openEmbed.setTitle(`${packAmt} ${chestEmote} ${packType} Treasure Chest  opened!`);

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
                        let itemName = totalDrops[i][0];
                        const itemObject = await findItem(itemName, true);
                        if (!itemObject) {
                            message.channel.send(`Invalid item name ${itemName}.`);
                            return;
                        }
                        // Corrects item name to the one in the db
                        itemName = itemObject.itemName;

                        // drops = [[dropName, dropQuantity]]
                        if (itemObject.type == 'equipment') {
                            const addItem = await makeEquipment(itemName);
                            // Adds multiple of the same equipment as different items due to unique id
                            for (let j = 0; j < totalDrops[i][1]; j++) {
                                const fullItemName = await giveWeaponID(itemName);
                                user.inv[fullItemName] = addItem;
                                user.inv[fullItemName].quantity = 1;
                                let emote = itemObject.emote;
                                if (emote == undefined) emote = '';
                                concatString += `x1 ${emote} ${fullItemName}\n`;
                                // openEmbed.addField(`${emote + fullItemName}`, `1`);
                            }
                            continue;
                        } else if (user.inv[itemName]) {
                            user.inv[itemName].quantity += totalDrops[i][1];
                        } else {
                            // Add item in inventory
                            user.inv[itemName] = itemObject;
                            user.inv[itemName].quantity = totalDrops[i][1];

                        }
                        let emote = itemObject.emote;
                        if (emote == undefined) emote = '';
                        concatString += ` x${totalDrops[i][1]} ${emote} ${itemName}\n`;
                    }
                    openEmbed.addField(`Contents`, concatString);
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
        "Apple": { dropChance: 40, minQuantity: 2, maxQuantity: 10 },
        "Banana": { dropChance: 40, minQuantity: 2, maxQuantity: 10 },
        "Orange": { dropChance: 30, minQuantity: 2, maxQuantity: 10 },
        "Jericho Jehammad": { dropChance: 50, minQuantity: 10, maxQuantity: 25 },
        "Wooden Sword": { dropChance: 12, minQuantity: 1, maxQuantity: 1 },
        "Stone Sword": { dropChance: 7, minQuantity: 1, maxQuantity: 1 },
        "Iron Sword": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Rag Boots": { dropChance: 12, minQuantity: 1, maxQuantity: 1 },
        "Cloth Boots": { dropChance: 7, minQuantity: 1, maxQuantity: 1 },
        "Leather Boots": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Rag Hood": { dropChance: 12, minQuantity: 1, maxQuantity: 1 },
        "Cloth Hood": { dropChance: 7, minQuantity: 1, maxQuantity: 1 },
        "Leather Hood": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Rags": { dropChance: 12, minQuantity: 1, maxQuantity: 1 },
        "Shirt": { dropChance: 7, minQuantity: 1, maxQuantity: 1 },
        "Leather Chestplate": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Rag Shorts": { dropChance: 12, minQuantity: 1, maxQuantity: 1 },
        "Cloth Pants": { dropChance: 7, minQuantity: 1, maxQuantity: 1 },
        "Leather Pants": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },

        // add some uncommon equipment here to make the drops longer
        "Long Sword": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Heavy Sword": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Steel Bucket": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Rubber Boots": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Wooden Chestplate": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Skirt": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },

    },
    "uncommon": {
        "Apple": { dropChance: 40, minQuantity: 5, maxQuantity: 15 },
        "Banana": { dropChance: 30, minQuantity: 5, maxQuantity: 15 },
        "Orange": { dropChance: 30, minQuantity: 5, maxQuantity: 10 },
        "Jericho Jehammad": { dropChance: 50, minQuantity: 15, maxQuantity: 30 },
        "Long Sword": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Heavy Sword": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Axe": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Bow": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Staff": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Sneakers": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Rubber Boots": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Hiking Boots": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Steel Bucket": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Iron Helmet": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Top Hat": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Wooden Chestplate": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Stone Chestplate": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Iron Chestplate": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Skirt": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Jeans": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Hiking Pants": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },

        // common equips to make ppl furious
        "Iron Sword": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
        "Leather Boots": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
        "Leather Hood": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
        "Leather Chestplate": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
        "Leather Pants": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },

    },
    "rare": {
        "Apple": { dropChance: 50, minQuantity: 10, maxQuantity: 25 },
        "Banana": { dropChance: 40, minQuantity: 10, maxQuantity: 25 },
        "Orange": { dropChance: 30, minQuantity: 10, maxQuantity: 20 },
        "Jericho Jehammad": { dropChance: 50, minQuantity: 20, maxQuantity: 40 },
        "Ice Rapier": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Magic Shoes": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Magic Robe Hood": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Magic Robe": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Magic Braies": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Cursed Cutlass": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Pirate Hat": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Pirate Vest": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Pirate Breeches": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Pirate Boots": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Clown Shoes": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Clown Top": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Clown Bottom": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Clown Wig": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Juggling Pins": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Elven Boots": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Elven Hat": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Elven Tunic": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Elven Breeches": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Elven Bow": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },

        // add some uncommon equipment to make people furious
        "Axe": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Bow": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Staff": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Hiking Boots": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Sneakers": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Iron Helmet": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Top Hat": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Stone Chestplate": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Iron Chestplate": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Jeans": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Hiking Pants": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },

    },
    "epic": {
        "Watermelon": { dropChance: 300, minQuantity: 10, maxQuantity: 20 },
        "Banana": { dropChance: 320, minQuantity: 15, maxQuantity: 30 },
        "Orange": { dropChance: 300, minQuantity: 15, maxQuantity: 30 },
        "Jericho Jehammad": { dropChance: 400, minQuantity: 40, maxQuantity: 80 },
        "Dusk Blade": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Dusk Headgear": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Dusk Cuirass": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Dusk Chausses": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Dusk Sabaton": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Eclipse Blade": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Eclipse Headgear": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Eclipse Cuirass": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Eclipse Chausses": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Eclipse Sabaton": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Spiked Cowboy Boots": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        "Shadow Step Boots": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // fatten pool with 2 rare sets
        // "Clown Shoes": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        // "Clown Top": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        // "Clown Bottom": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        // "Clown Wig": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        // "Juggling Pins": { dropChance: 5, minQuantity: 1, maxQuantity: 1 },
        "Ice Rapier": { dropChance: 20, minQuantity: 1, maxQuantity: 1 },
        "Magic Shoes": { dropChance: 20, minQuantity: 1, maxQuantity: 1 },
        "Magic Robe Hood": { dropChance: 20, minQuantity: 1, maxQuantity: 1 },
        "Magic Robe": { dropChance: 20, minQuantity: 1, maxQuantity: 1 },
        "Magic Braies": { dropChance: 20, minQuantity: 1, maxQuantity: 1 },

    },
    "legendary": {
        "Watermelon": { dropChance: 260, minQuantity: 15, maxQuantity: 25 },
        "Falafel": { dropChance: 260, minQuantity: 10, maxQuantity: 20 },
        "Spaghetti": { dropChance: 260, minQuantity: 10, maxQuantity: 20 },
        "Jericho Jehammad": { dropChance: 300, minQuantity: 80, maxQuantity: 120 },
        // "Hermes Shoes": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Hermes Top": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Hermes Bottom": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Caduceus": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Winged Hat": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },

        // fatten with rare and epic sets
        "Cursed Cutlass": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
        "Pirate Hat": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
        "Pirate Vest": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
        "Pirate Breeches": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
        "Pirate Boots": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
        // "Elven Boots": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
        // "Elven Hat": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
        // "Elven Tunic": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
        // "Elven Breeches": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
        // "Elven Bow": { dropChance: 10, minQuantity: 1, maxQuantity: 1 },
        "Dusk Blade": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Dusk Headgear": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Dusk Cuirass": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Dusk Chausses": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Dusk Sabaton": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Eclipse Blade": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Eclipse Headgear": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Eclipse Cuirass": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Eclipse Chausses": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Eclipse Sabaton": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Spiked Cowboy Boots": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Shadow Step Boots": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },

        // dev equipment
        // "Quick Wolf Kunais": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "The Broccoli Blade": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Inhumane Nightbringer": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Blade Of Jericho": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
    },
    "mythic": {
        "Watermelon": { dropChance: 160, minQuantity: 20, maxQuantity: 40 },
        "Falafel": { dropChance: 160, minQuantity: 20, maxQuantity: 40 },
        "Spaghetti": { dropChance: 160, minQuantity: 20, maxQuantity: 40 },
        "Jericho Jehammad": { dropChance: 250, minQuantity: 100, maxQuantity: 300 },
        // temporary items to fill the box for now
        "Eclipse Blade": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Eclipse Headgear": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Eclipse Cuirass": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Eclipse Chausses": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Eclipse Sabaton": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Dusk Blade": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Dusk Headgear": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Dusk Cuirass": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Dusk Chausses": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Dusk Sabaton": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Spiked Cowboy Boots": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        "Shadow Step Boots": { dropChance: 3, minQuantity: 1, maxQuantity: 1 },
        // "Hermes Shoes": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Hermes Top": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Hermes Bottom": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Caduceus": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
        // "Winged Hat": { dropChance: 1, minQuantity: 1, maxQuantity: 1 },
    },
};
// Sword pack drop rates
const weaponsLootTable = {
    'Long Sword': 35,
    'Heavy Sword': 35,
    'Staff': 35,
    'Axe': 35,
    'Bow': 35,
    'Ice Rapier': 10,
    'Cursed Cutlass': 10,
    // 'Juggling Pins': 10,
    // 'Elven Bow': 10,
    'Dusk Blade': 1,
    'Eclipse Blade': 1,
    // 'Caduceus': 0.3,
};
// Helmet pack drop rates
const helmetLootTable = {
    'Top Hat': 55,
    'Iron Helmet': 55,
    'Steel Bucket': 55,
    'Magic Robe Hood': 10,
    // 'Clown Wig': 10,
    // 'Elven Hat': 10,
    'Pirate Hat': 10,
    'Eclipse Headgear': 1,
    'Dusk Headgear': 1,
    // 'Winged Hat': 0.3,
};

// Chestplate pack drop rates
const chestplateLootTable = {
    'Wooden Chestplate': 55,
    'Iron Chestplate': 55,
    'Stone Chestplate': 55,
    'Magic Robe': 10,
    // 'Clown Top': 10,
    // 'Elven Tunic': 10,
    'Pirate Vest': 10,
    'Eclipse Cuirass': 1,
    'Dusk Cuirass': 1,
    // 'Hermes Top': 0.3,
};

// Leggings pack drop rates
const leggingsLootTable = {
    'Skirt': 55,
    'Jeans': 55,
    'Hiking Pants': 55,
    'Magic Braises': 10,
    // 'Clown Bottom': 10,
    // 'Elven Breeches': 10,
    'Pirate Breeches': 10,
    'Eclipse Chausses': 1,
    'Dusk Chausses': 1,
    // 'Hermes Bottom': 0.3,
};

// Boots pack drop rates
const bootsLootTable = {
    'Sneakers': 45,
    'Rubber Boots': 45,
    'Hiking Boots': 45,
    'Magic Shoes': 10,
    'Clown Shoes': 10,
    'Elven Boots': 10,
    'Pirate Boots': 10,
    'Spiked Cowboy Boots': 1,
    'Shadow Step Boots': 1,
    'Eclipse Sabaton': 1,
    'Dusk Sabaton': 1,
    // 'Hermes Boots': 0.3,
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

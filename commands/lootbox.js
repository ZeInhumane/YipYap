const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "lootbox",
    description: "Gamble :)",
    syntax: "{box}",
    aliases: ['lb'],
    cooldown: 5,
    category: "Fun",
    execute(message, args) {
        const lootboxType = args[0];
        let chestEmote =
        // const quantityToOpen = args[1];
        User.findOne({ userID: message.author.id }, (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
            }
            else {
                let boxLootTable = {
                    "common": { "Apple": 60, "Banana": 39, "Orange": "rest" },
                    "uncommon": { "Apple": 60, "Banana": 34, "Orange": 5, "Jericho Jehammad": "rest" },
                    "rare": { "Apple": 10, "Banana": 50, "Orange": 30, "Jericho Jehammad": "rest" },
                    "epic": { "Watermelon": 10, "Banana": 50, "Orange": 39, "Jericho Jehammad": "rest" },
                    "legendary": { "Watermelon": 39, "Falafel": 50, "Spaghetti": 10, "Jericho Jehammad": "rest" },
                    "mythic": { "Watermelon": 1, "Falafel": 29, "Spaghetti": 70, "Jericho Jehammad": "rest" },
                    
                };
                switch (lootboxType) {
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

                let rarities = Object.keys(boxLootTable).map(function (value) {
                    return value.toUpperCase();
                });
                //placeholder allow user to open multiple boxes
                if (typeof lootboxType === 'string'
                    ? rarities.indexOf(lootboxType.toUpperCase()) == -1
                    : true) {
                    return;
                };
                //change 1 when quantityToOpen is implemented
                if (user.inv[lootboxType.charAt(0).toUpperCase() + lootboxType.slice(1) + " Treasure Chest"].quantity < 1) {
                    message.channel.send("You do not have a sufficient number of chests to open");
                    return;
                }
                if (user.inv[lootboxType.charAt(0).toUpperCase() + lootboxType.slice(1) + " Treasure Chest"]) {
                    //Contains drop rates for items in the boxes
                    drops = [];
                    //Change below in the future
                    placeholderQuantity = 1;
                    //Change above in the future

                    if (boxLootTable[lootboxType.toLowerCase()] != undefined) {
                        totalChance = 0
                        for (i = 0; i < Object.values(boxLootTable[lootboxType]).length; i++) {
                            if (!isNaN(Object.values(boxLootTable[lootboxType])[i])) {
                                totalChance += Object.values(boxLootTable[lootboxType])[i];
                            }
                        }
                        while (drops.length == 0) {
                            for (i = 0; i < Object.keys(boxLootTable[lootboxType]).length; i++) {
                                rng = Math.floor((Math.random() * 101))
                                if (Object.values(boxLootTable[lootboxType])[i] == "rest") {
                                    if (rng <= 100 - totalChance) {
                                        drops.push([Object.keys(boxLootTable[lootboxType])[i], placeholderQuantity])
                                    }
                                }
                                else if (rng <= Object.values(boxLootTable[lootboxType])[i]) {
                                    drops.push([Object.keys(boxLootTable[lootboxType])[i], placeholderQuantity])
                                }
                            }
                        }
                        itemsObtainable = {
                            "Apple": { "quantity": 1, "emote": "🍎", "type": "fruit" },
                            "Banana": { "quantity": 1, "emote": "🍌", "type": "fruit" },
                            "Orange": { "quantity": 1, "emote": "🍊", "type": "fruit" },
                            "Watermelon": { "quantity": 1, "emote": "🍉", "type": "fruit" },
                            "Falafel": { "quantity": 1, "emote": "🧆", "type": "fruit" },
                            "Spaghetti": { "quantity": 1, "emote": "🍝", "type": "fruit" },
                            "Jericho Jehammad": { "quantity": 1, "emote": "<:Jericho:823551572029603840>", "type": "special" },
                        };
                        // put into discord
                        let name = message.member.user.tag.toString();
                        name = name.split("#", name.length - 4);
                        name = name[0];
                        const embed = new Discord.MessageEmbed()
                            .setTitle("You opened a " + lootboxType.charAt(0).toUpperCase() + lootboxType.slice(1) + `${chestEmote} and received:`)
                            .setColor('#000000')
                        for (i = 0; i < drops.length; i++) {
                            //add stuff here
                            if (user.inv[drops[i][0]]) {
                                user.inv[drops[i][0]].quantity += drops[i][1];
                            }
                            else {
                                user.inv[drops[i][0]] = itemsObtainable[drops[i][0]];
                            }
                            user.markModified('inv');
                            //embed.addField(`${drops[i][0]}: ${drops[i][1]}`)
                            embed.addField(itemsObtainable[drops[i][0]].emote + drops[i][0], drops[i][1])
                        }
                        // Change 1 to arg[1] in future
                        // Removes treasure chest from inventory
                        user.inv[lootboxType.charAt(0).toUpperCase() + lootboxType.slice(1) + " Treasure Chest"].quantity -= 1;
                        if (user.inv[lootboxType.charAt(0).toUpperCase() + lootboxType.slice(1) + " Treasure Chest"].quantity == 0) {
                            delete user.inv[lootboxType.charAt(0).toUpperCase() + lootboxType.slice(1) + " Treasure Chest"];
                        }
                        user.markModified('inv');
                        message.channel.send(embed);
                        user.save()
                            .then(result => console.log(result))
                            .catch(err => console.error(err));
                    }
                    else {
                        message.channel.send(`Wrong thing`);
                    }

                }
                else {
                    message.channel.send(`You do not have a ${lootboxType} lootbox`)
                }
            }
        });

    }
}

const Shop = require('../models/shopData');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const User = require('../models/user');
module.exports = {
    name: "equip",
    description: "Equips a weapon or armor on your character",
    syntax: "{equipment name}",
    cooldown: 1,
    aliases: ['e'],
    category: "Fun",
    execute(message, args) {
        let itemName = args.join(' ');
        let itemToEquip;
        function titleCase(str) {
            var splitStr = str.toLowerCase().split(' ');
            for (var i = 0; i < splitStr.length; i++) {
                // You do not need to check if i is larger than splitStr length, as your for does that for you
                // Assign it back to the array
                splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
            }
            // Directly return the joined string
            itemName = splitStr.join(' ');
        }
        titleCase(itemName);

        async function equipItemSetup(user) {
            itemToEquip = user.inv[itemName];
            itemToEquip = { [itemName]: itemToEquip };
            user.inv[itemName].quantity -= 1;
            if (user.inv[itemName].quantity == 0) {
                delete user.inv[itemName];
            }
        }

        async function setStatBuffs(user, item) {
            let stats = Object.values(item)[0].stats
            for (statName in stats) {
                for (let i = 0; i < stats[statName].length; i++) {
                    switch (stats[statName][i].substring(0, 1)) {
                        case "+":
                            user.player[statName] += parseInt(stats[statName][i].substring(1));
                            break;
                        case "x":
                            user.player[statName] *= eval(stats[statName][i].substring(1));
                            break;
                    }
                }

            }
        }

        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
                return;
            }
            else if (user.inv[itemName] == undefined) {
                message.channel.send(`You do not have that item!`);
                return;
            }
            else {
                if (user.inv[itemName].type == "equipment") {
                    let equipmentType = user.inv[itemName].equipmentType;
                    if (Object.keys(user.player[equipmentType])[0] != itemName) {
                        // Checks if player has an equipment in that equipment slot
                        if (Object.keys(user.player[equipmentType]).length != 0) {
                            
                            let currentEquippedItem = user.player[equipmentType];
                            let currentEquippedItemName = Object.keys(currentEquippedItem)[0];
                            let stats = Object.values(currentEquippedItem)[0].stats
                            for (statName in stats) {
                                for (let i = 0; i < stats[statName].length; i++) {
                                    switch (stats[statName][i].substring(0, 1)) {
                                        case "+":
                                            user.player[statName] -= parseInt(stats[statName][i].substring(1));
                                            break;
                                        case "x":
                                            user.player[statName] /= eval(stats[statName][i].substring(1));
                                            break;
                                    }
                                }

                            }
                            // Adds currently equiped item back into inventory
                            if (user.inv[currentEquippedItemName] != null) {
                                user.inv[currentEquippedItemName].quantity += 1;
                            }
                            else {
                                user.inv[currentEquippedItemName] = currentEquippedItem;
                                user.inv[currentEquippedItemName].quantity = 1;
                            }

                        }
                        await equipItemSetup(user);
                        await setStatBuffs(user, itemToEquip);
                        user.player[equipmentType] = itemToEquip;
                        user.markModified('inv');
                        user.markModified('player');
                        user.save()
                            .then(result => console.log(result))
                            .catch(err => console.error(err));
                        message.channel.send(`You've equiped: ${itemName}.`);
                        return;
                    }
                    else {
                        message.channel.send(`You already have that equipped.`);
                    }
                }
                else { message.channel.send(`That is not an equipment.`); }
            }
        });
    }
}

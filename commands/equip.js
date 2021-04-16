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
            user.inv[itemName].quantity - 1;
            if (user.inv[itemName].quantity == 0) {
                delete user.inv[itemName];
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
                    // Checks if player has an equipment in that equipment slot
                    if (user.player[user.inv[itemName].equipmentType] != "") {
                        let currentEquippedItem = user.player[user.inv[itemName].equipmentType];
                        let currentEquippedItemName = Object.keys(currentEquippedItem)[0];
                        // Adds currently equiped item back into inventory
                        if (user.inv[currentEquippedItemName] != null) {
                            user.inv[currentEquippedItemName].quantity += 1;
                        }
                        else {
                            user.inv[currentEquippedItemName] = currentEquippedItem;
                            user.inv[currentEquippedItemName].quantity = 1;
                        }

                    }
                    await equipItemSetup(user)
                    user.player[equipmentType] = itemToEquip;
                    user.markModified('inv');
                    user.markModified('player');
                    user.save()
                        .then(result => console.log(result))
                        .catch(err => console.error(err));
                    message.channel.send(`You've equiped: ${itemName}.`);
                    return;
                }
                message.channel.send(`That is not an equipment.`);
            }
        });
    }
}

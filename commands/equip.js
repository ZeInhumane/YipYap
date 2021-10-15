const mongoose = require('mongoose');
const Discord = require('discord.js');
const User = require('../models/user');
const findItem = require('../functions/findItem.js');
const findPrefix = require('../functions/findPrefix');
const titleCase = require('../functions/titleCase');
const getFinalStats = require('../functions/getFinalStats');
module.exports = {
    name: "equip",
    description: "Equips a weapon or armor on your character. Equip another item of the same type to unequip that weapon. Equipping a particular weapon means that you are unable to info/enhance/ascend that weapon.",
    syntax: "{equipment name}",
    cooldown: 1,
    aliases: ['e'],
    category: "Fun",
    execute(message, args) {
        let itemName = args.join(' ');
        itemName = titleCase(itemName);

        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                //Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }
            if (!user.inv[itemName]) {
                message.channel.send(`You do not have ${itemName} in your inventory!`)
                return;
            }
            if (user.inv[itemName].type != "equipment") {
                message.channel.send(`That is not an equipment.`);
                return;
            }

            // Gets equipment info from db
            let dbItemName = itemName.split("#")[0];
            let dbEquipment = await findItem(dbItemName, true);

            let equipmentType = dbEquipment.equipmentType;
            // Checks if player already has that specific equipment equipped
            if (user.inv[itemName].equipped == true) {
                message.channel.send(`You already have that equipped.`);
                return;
            }

            // Checks if player has an equipment in that equipment slot
            let userItemsArr = Object.keys(user.inv);
            var currentEquippedItem = userItemsArr.find(item => {
                return user.inv[item].equipmentType === equipmentType && user.inv[item].equipped === true;
            });

            if (currentEquippedItem) {
                let currentEquippedItemName = currentEquippedItem.split("#")[0]
                //Should be stats for current equipped item
                let stats = getFinalStats(user.inv[currentEquippedItem], await findItem(currentEquippedItemName, true));
                // Removes stats given by equipped item
                for (statName in stats) {
                    user.player.additionalStats[statName].flat -= stats[statName].flat;
                    user.player.additionalStats[statName].multi -= stats[statName].multi;
                }
                // Unequips item
                user.inv[currentEquippedItem].equipped = false;
            }

            // Equip item setup
            let itemToEquip = user.inv[itemName];

            // Setting stat buffs
            let stats = getFinalStats(itemToEquip, dbEquipment);
            for (statName in stats) {
                user.player.additionalStats[statName].flat += stats[statName].flat;
                user.player.additionalStats[statName].multi += stats[statName].multi;
                // To calulate stats
                // Math.round(user.player[statName] * (1 + stats[statName].multi / 100) + stats[statName].flat)
            }

            // Equips item
            itemToEquip.equipped = true;
            user.markModified('inv');
            user.markModified('player');
            user.save()
                .then(result => console.log("result"))
                .catch(err => console.error(err));
            message.channel.send(`You've equiped: ${itemName}.`);
        });
    }
}
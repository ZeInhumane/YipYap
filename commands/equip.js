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
            if(!user.inv[itemName]){
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
            if (Object.keys(user.player[equipmentType])[0] == itemName) {
                message.channel.send(`You already have that equipped.`);
                return;
            }


            // Checks if player has an equipment in that equipment slot
            if (Object.keys(user.player[equipmentType]).length != 0) {
                
                let currentEquippedItem = user.player[equipmentType];
                let currentEquippedItemName = Object.keys(currentEquippedItem)[0];
                //Should be stats for current equipped item
                let stats = getFinalStats(Object.values(currentEquippedItem)[0], await findItem(currentEquippedItemName.split("#")[0], true));
                // Removes stats given by equipped item
                for (statName in stats) {
                    user.player.additionalStats[statName].flat -= stats[statName].flat;
                    user.player.additionalStats[statName].multi -= stats[statName].multi;
                }
                // Adds currently equiped item back into inventory
                Object.assign(user.inv, currentEquippedItem);
                user.inv[currentEquippedItemName].quantity = 1;
            }

            // Equip item setup
            let itemToEquip = user.inv[itemName];
            itemToEquip = { [itemName]: itemToEquip };
            user.inv[itemName].quantity -= 1;
            if (user.inv[itemName].quantity == 0) {
                delete user.inv[itemName];
            }

            // Setting stat buffs
            let stats = getFinalStats(Object.values(itemToEquip)[0], dbEquipment);
            for (statName in stats) {
                user.player.additionalStats[statName].flat += stats[statName].flat;
                user.player.additionalStats[statName].multi += stats[statName].multi;
                // To calulate stats
                // Math.round(user.player[statName] * (1 + stats[statName].multi / 100) + stats[statName].flat)
            }

            // Equips item
            user.player[equipmentType] = itemToEquip;
            user.markModified('inv');
            user.markModified('player');
            user.save()
                .then(result => console.log("result"))
                .catch(err => console.error(err));
            message.channel.send(`You've equiped: ${itemName}.`);
        });
    }
}
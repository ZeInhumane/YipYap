const User = require('../../models/user');
const findItem = require('../../functions/findItem.js');
const findPrefix = require('../../functions/findPrefix');
const titleCase = require('../../functions/titleCase');
const getFinalStats = require('../../functions/getFinalStats');
module.exports = {
    name: "equip",
    description: "Equips a weapon or armor on your character. Equip another item of the same type to unequip that weapon. Equipping a particular weapon means that you are unable to info/enhance/ascend that weapon.",
    syntax: "{equipment name}",
    cooldown: 1,
    aliases: ['e'],
    category: "Fun",
    execute({ message, args }) {
        let itemName = args.join(' ');
        itemName = titleCase(itemName);

        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                // Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }
            if (!user.inv[itemName]) {
                message.channel.send(`You do not have ${itemName} in your inventory!`);
                return;
            }
            if (user.inv[itemName].type != "equipment") {
                message.channel.send(`That is not an equipment.`);
                return;
            }

            // Gets equipment info from db
            const dbItemName = itemName.split("#")[0];
            const dbEquipment = await findItem(dbItemName, true);

            const equipmentType = dbEquipment.equipmentType;
            // Checks if player already has that specific equipment equipped
            if (user.inv[itemName].equipped == true) {
                message.channel.send(`You already have that equipped.`);
                return;
            }

            if (user.inv[itemName].listed > 0) {
                message.channel.send(`You cannot equip a listed item.`);
                return;
            }

            // Checks if player has an equipment in that equipment slot
            const userItemsArr = Object.keys(user.inv);
            var currentEquippedItem = userItemsArr.find(item => {
                return user.inv[item].equipmentType === equipmentType && user.inv[item].equipped === true;
            });

            if (currentEquippedItem) {
                const currentEquippedItemName = currentEquippedItem.split("#")[0];
                // Should be stats for current equipped item
                const stats = getFinalStats(user.inv[currentEquippedItem], await findItem(currentEquippedItemName, true));
                // Removes stats given by equipped item
                for (const statName in stats) {
                    user.player.additionalStats[statName].flat -= stats[statName].flat;
                    user.player.additionalStats[statName].multi -= stats[statName].multi;
                }
                // Unequips item
                user.inv[currentEquippedItem].equipped = false;
            }

            // Equip item setup
            const itemToEquip = user.inv[itemName];

            // Setting stat buffs
            const stats = getFinalStats(itemToEquip, dbEquipment);
            for (const statName in stats) {
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
                .then(result => console.log(`${result._doc.userID} equipped ${itemName}`))
                .catch(err => console.error(err));
            message.channel.send(`You've equipped: ${itemName}.`);
        });
    },
};
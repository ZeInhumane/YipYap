const User = require('../../models/user');
const findItem = require('../../functions/findItem.js');
const findPrefix = require('../../functions/findPrefix');
const titleCase = require('../../functions/titleCase');
const getFinalStats = require('../../functions/getFinalStats');

module.exports = {
    name: "unequip",
    description: "Unequips a weapon or armor on your character.",
    syntax: "{equipment name}",
    cooldown: 1,
    aliases: ['ue'],
    category: "Fun",
    execute({ message, args }) {
        let itemName = args.join(' ');
        itemName = titleCase(itemName);

        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                // Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not a set up player yet! Do ${prefix}start to start.`);
                return;
            }
            // Check if user does not have item equipped
            if (user.inv[itemName].equipped == false) {
                message.channel.send(`You do not have ${itemName} equipped!`);
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

                user.markModified('inv');
                user.markModified('player');
                user.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
                message.channel.send(`You've unequipped: ${itemName}.`);
            }
        });
    },
};
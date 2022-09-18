const User = require('../../models/user');
const findItem = require('../../functions/findItem.js');
const findPrefix = require('../../functions/findPrefix');
const titleCase = require('../../functions/titleCase');

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
            // Gets equipment info from db
            const dbItemName = itemName.split("#")[0];
            const values = await findItem(dbItemName, true);
            if (!values){
                message.channel.send(`Invalid item name ${dbItemName}.`);
                return;
            }
            const dbEquipment = values[0];
            const newName = values[1];
            if (dbItemName != newName){
                itemName = newName + '#' + itemName.split('#')[1];
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

            const equipmentType = dbEquipment.equipmentType;

            // Checks if player has an equipment in that equipment slot
            const userItemsArr = Object.keys(user.inv);
            var currentEquippedItem = userItemsArr.find(item => {
                return user.inv[item].equipmentType === equipmentType && user.inv[item].equipped === true;
            });

            if (currentEquippedItem) {
                // Unequips item
                user.inv[currentEquippedItem].equipped = false;

                user.markModified('inv');
                user.markModified('player');
                user.save()
                    .then(result => console.log(`${result._doc.userID} unequipped ${currentEquippedItem}`))
                    .catch(err => console.error(err));
                message.channel.send(`You've unequipped: ${itemName}.`);
            }
        });
    },
};
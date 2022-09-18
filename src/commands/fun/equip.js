const User = require('../../models/user');
const findItem = require('../../functions/findItem.js');
const findPrefix = require('../../functions/findPrefix');
const titleCase = require('../../functions/titleCase');
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
        console.log(itemName);

        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                // Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
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

            if (!user.inv[itemName]) {
                message.channel.send(`You do not have ${itemName} in your inventory!`);
                return;
            }
            if (user.inv[itemName].type != "equipment") {
                message.channel.send(`That is not an equipment.`);
                return;
            }

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
                // Unequips item
                user.inv[currentEquippedItem].equipped = false;
            }

            // Equip item setup
            const itemToEquip = user.inv[itemName];
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
const Shop = require('../../models/shopData');
const User = require('../../models/user');
const Equipment = require('../../models/equipment');
const findItem = require('../../functions/findItem.js');
const titleCase = require('../../functions/titleCase');
const findPrefix = require('../../functions/findPrefix');
const { regex } = require('../../constants/regex');

module.exports = {
    name: "sell",
    description: "Sells something that can be sold for half the price. Can also be used to get Jericho Jehammad with excess weapons :)",
    cooldown: 10,
    aliases: ['s'],
    syntax: '',
    category: "Economy",
    execute({ message, args }) {
        let itemQuantity = 1;
        // Finds arguments no matter the position
        const itemQuantityIndex = args.findIndex(arg => regex.anyInt.test(arg) || arg.toLowerCase() == 'all');
        if (itemQuantityIndex != -1) {
            itemQuantity = args[itemQuantityIndex];
            if (itemQuantity != 'all') {
                itemQuantity = parseInt(itemQuantity);
            }
            args.splice(itemQuantityIndex, 1);
        }

        // ensures that at least one item is bought
        let itemName = args.join(" ");
        if (itemName == "") return message.channel.send("SELECT SOMETHING TO SELL");

        itemName = titleCase(itemName);
        Shop.findOne({ itemName: itemName }, async (err, item) => {
            // Getting the prefix from db
            const prefix = await findPrefix(message.guild.id);

            // Checks if item is in the shop
            if (!item) {
                // Go find if item user is trying to sell is an equipment
                const args2 = args.map(element => element.charAt(0).toUpperCase() + element.substring(1));
                // gets equipment name
                const eqName = args2.join(' ').split('#')[0];
                const fullName = args2.join(' ');
                Equipment.findOne({ itemName: eqName }, (err, equipment) => {
                    if (!equipment) {
                        message.channel.send(`That item doesn't exist, or cannot be sold.`);
                        return;
                    }
                    User.findOne({ userID: message.author.id }, async (err, user) => {
                        if (user == null) {
                            message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                            return;
                        }
                        if (itemQuantity < 1) {
                            message.channel.send(`Please enter a positive number to sell an item, you are not allowed to sell negative shitz ur gay`);
                            return;
                        }

                        if (!user.inv[fullName]) {
                            message.channel.send(`You do not have ${fullName}.`);
                            return;
                        }
                        const eqClass = {
                            'Common': 20,
                            'Uncommon': 40,
                            'Rare': 60,
                            'Epic': 120,
                            'Legendary': 300,
                            'Mythic': 600,
                        };
                        let totalJericho = eqClass[user.inv[fullName].rarity];
                        if (user.inv[fullName].level != 1) {
                            totalJericho += (user.inv[fullName].level - 1);
                        }

                        if (user.inv['Jericho Jehammad']) {
                            user.inv['Jericho Jehammad'].quantity += totalJericho;
                        } else {
                            user.inv['Jericho Jehammad'] = await findItem('Jericho Jehammad');
                            user.inv['Jericho Jehammad'].quantity = totalJericho;
                        }

                        message.channel.send(`You have sold ${fullName} and gained ${totalJericho} Jericho Jehammads.`);
                        message.channel.send(`Your currently have ${user.inv['Jericho Jehammad'].quantity} Jericho Jehammads.`);
                        // Removes equipment from inv
                        delete user.inv[fullName];

                        user.markModified('inv');
                        user.markModified('player');
                        user.save()
                            .then(result => console.log("sell", result))
                            .catch(err => console.error(err));
                    });
                });
            } else {
                // Item able to sell
                User.findOne({ userID: message.author.id }, async (err, user) => {
                    if (user == null) {
                        message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                        return;
                    }
                    if (itemQuantity < 1) {
                        message.channel.send(`Please enter a positive number to sell an item, you are not allowed to sell negative shitz ur gay`);
                        return;
                    }
                    if (!user.inv[itemName]) {
                        message.channel.send(`You do not have ${itemQuantity} ${itemName}${itemQuantity == 1 ? '' : 's'}.`);
                        return;
                    }
                    if (user.inv[itemName].quantity < itemQuantity) {
                        message.channel.send(`You currently have ${user.inv[itemName].quantity} ${item.itemName}${user.inv[itemName].quantity == 1 ? '' : 's'}, so you cannot sell ${itemQuantity} amount of ${itemName}${itemQuantity == 1 ? '' : 's'} `);
                        return;
                    }

                    user.inv[itemName].quantity -= itemQuantity;
                    if (user.inv[itemName].quantity == 0) {
                        delete user.inv[itemName];
                    }
                    user.currency += item.itemCost * 0.5 * itemQuantity;
                    user.markModified('inv');
                    user.save()
                        .then(result => console.log("sell", result))
                        .catch(err => console.error(err));
                    message.channel.send(`You've sold: ${itemQuantity} ${itemName}${itemName == 1 ? '' : 's'}.`);
                    message.channel.send(`You earned ${item.itemCost * 0.5 * itemQuantity}<:cash_24:751784973488357457>\nYour current balance is ${user.currency}<:cash_24:751784973488357457>`);
                });
            }
        });
    },
};

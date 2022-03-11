const Shop = require('../../models/shopData');
const User = require('../../models/user');
const findPrefix = require('../../functions/findPrefix');
const findItem = require('../../functions/findItem');
const titleCase = require('../../functions/titleCase');

module.exports = {
    name: "buy",
    description: "Quite self explanatory, buy something from the shop, get something",
    syntax: "{item from the shop} {quantity}",
    aliases: ['purchase'],
    category: "Economy",
    cooldown: 5,
    execute({ message, args }) {
        let itemQuantity = 1;
        // Finds arguments no matter the position
        const itemQuantityIndex = args.findIndex(arg => /^[1-9]\d*$/g.test(arg) || arg.toLowerCase() == 'all');
        if (itemQuantityIndex != -1) {
            itemQuantity = args[itemQuantityIndex];
            if (itemQuantity != 'all') {
                itemQuantity = parseInt(itemQuantity);
            }
            args.splice(itemQuantityIndex, 1);
        }

        // ensures that at least one item is bought
        let itemName = args.join(" ");
        if (itemName == "") return message.channel.send("SELECT SOMETHING TO BUY. YOU CANNOT BUY NOTHING.. REMEMBER TO SELECT SOMETHING TO BUY!! NOTHING IS NOT SOMETHING TO BUY BUT SOMETHING IS NOT NOTHING THAT YOU BUY");

        itemName = titleCase(itemName);

        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                // Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }

            Shop.findOne({ itemName: itemName }, async (err, item) => {
                if (item == null) {
                    message.channel.send(`That item is not being sold in the shop.`);
                    return;
                }
                if (itemQuantity < 1) {
                    message.channel.send('Please enter a quantity of 1 or larger');
                    return;
                }

                if (itemQuantity * item.itemCost > user.currency) {
                    message.channel.send(`You currently have ${user.currency}<:cash_24:751784973488357457> but ${itemQuantity} ${item.itemName}(s) costs ${itemQuantity * item.itemCost}<:cash_24:751784973488357457>!`);
                    return;
                }
                // Uses all of user's currency to buy the item
                if (itemQuantity == 'all') {
                    itemQuantity = Math.floor(user.currency / item.itemCost);
                }

                if (user.inv[itemName]) {
                    user.inv[itemName].quantity += itemQuantity;
                } else {
                    user.inv[itemName] = await findItem(itemName);
                    user.inv[itemName].quantity = itemQuantity;
                }
                user.currency -= item.itemCost * itemQuantity;
                user.markModified('inv');
                user.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
                message.channel.send(`You've bought: ${itemQuantity} ${itemName} for ${item.itemCost * itemQuantity} <:cash_24:751784973488357457>.`);
            });
        });

    },
};

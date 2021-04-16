const Shop = require('../models/shopData');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const User = require('../models/user');
module.exports = {
    name: "sell",
    description: "Sells something from the shop",
    cooldown: 10,
    aliases: ['s'],
    category: "Economy",
    execute(message, args) {
        const itemQuantity = parseInt(args.pop());
        const itemName = args.join(" ");
        Shop.findOne({ itemName: itemName }, (err, item) => {
            if (item == null) {
                message.channel.send(`That item doesn't exist.`);
                return;
            }
            else {
                User.findOne({ userID: message.author.id }, (err, user) => {
                    if (user == null) {
                        message.channel.send("You have not set up a player yet! Do =start to start.");
                        return;
                    }
                    else if (itemQuantity < 1) {
                        message.channel.send(`Please enter a positive number to sell an item, you are not allowed to sell negative shitz ur gay`);
                        return;
                    }
                    else {
                        if (user.inv[itemName]) {
                            if (user.inv[itemName].quantity < itemQuantity) {
                                message.channel.send(`You currently have ${user.inv[itemName].quantity} ${item.itemName}(s), so you cannot sell ${itemQuantity} amount of ${itemName}(s) `);
                                return;
                            }
                            user.inv[itemName].quantity -= itemQuantity;
                            if(user.inv[itemName].quantity == 0){
                                delete user.inv[itemName];
                            }
                        }
                        else {
                            message.channel.send(`You do not have ${itemQuantity} ${itemName}.`);
                            return;
                        }
                        user.currency += item.itemCost * itemQuantity;
                        user.markModified('inv');
                        user.save()
                            .then(result => console.log(result))
                            .catch(err => console.error(err));
                        message.channel.send(`You've sold: ${itemQuantity} ${itemName}.`);
                    }
                })
            }
        })
    }
}

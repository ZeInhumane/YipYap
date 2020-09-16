const Shop = require('../models/shopData');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const User = require('../models/user');
module.exports = {
    name: "buy",
    description: "Buys something from the shop",
    cooldown: 10,
    aliases: ['purchase'],
    execute(message, args) {
        const itemName = args[0];
        const itemQuantity = parseInt(args[1]);
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
                    else if (itemQuantity * item.itemCost > user.currency) {
                            message.channel.send(`You currently have ${user.currency}<:cash_24:751784973488357457>​, but ${itemQuantity} ${item.itemName}(s) costs ${itemQuantity * item.itemCost}<:cash_24:751784973488357457>​!`);
                            return;
                        }
                        else {
                            var indexOfItemInInv = user.inv.findIndex((item) => {
                                if (item.itemName == itemName) {
                                    return true;
                                }
                            });
                            if (indexOfItemInInv > -1) {
                                user.inv[indexOfItemInInv].itemQuantity += itemQuantity;
                            }
                            else {
                                user.inv.push({ itemName: itemName, itemQuantity: itemQuantity });
                            }
                            user.currency -= item.itemCost * itemQuantity;
                            user.markModified('inv');
                            user.save()
                                .then(result => console.log(result))
                                .catch(err => console.error(err));
                            message.channel.send(`You've bought: ${itemQuantity} ${itemName}.`);
                        }
                })
            }
        })
    }
}

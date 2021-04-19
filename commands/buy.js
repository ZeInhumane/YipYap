const Shop = require('../models/shopData');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const User = require('../models/user');
module.exports = {
    name: "buy",
    description: "Buys something from the shop",
    cooldown: 5,
    aliases: ['purchase'],
    category: "Economy",
    execute(message, args) {
        let itemQuantity;
        // help fix this
        if (isNaN(parseInt(args[args.length - 1]))) {
            itemQuantity = 1;
            console.log("here")
        } else {
            itemQuantity = args.pop();
            console.log("there")
        }
        //ensures that at least one item is bought
        let itemName = args.join(" ");
        if(itemName == "") return message.channel.send("SELECT SOMETHING TO BUY. YOU CANNOT BUY NOTHING.. REMEMBER TO SELECT SOMETHING TO BUY!!");
        function titleCase(str) {
            var splitStr = str.toLowerCase().split(' ');
            for (var i = 0; i < splitStr.length; i++) {
                // You do not need to check if i is larger than splitStr length, as your for does that for you
                // Assign it back to the array
                splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
            }
            // Directly return the joined string
            itemName = splitStr.join(' ');
        }
        titleCase(itemName);
        Shop.findOne({ itemName: itemName }, (err, item) => {
            if (item == null) {
                message.channel.send(`That item doesn't exist.`);
                return;
            }
            else if (!(itemQuantity > 0)) {
                message.channel.send('Please enter a quantity of 1 or larger');
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
                        if (user.inv[itemName]) {
                            user.inv[itemName].quantity += itemQuantity;
                        }
                        else {
                            user.inv[itemName] = { "quantity": itemQuantity, "emote": item.emote, "type": item.type };
                        }
                        user.currency -= item.itemCost * itemQuantity;
                        user.markModified('inv');
                        user.save()
                            .then(result => console.log(result))
                            .catch(err => console.error(err));
                        message.channel.send(`You've bought: ${itemQuantity} ${itemName} for ${item.itemCost * itemQuantity} <:cash_24:751784973488357457>.`);
                    }
                })
            }
        })
    }
}


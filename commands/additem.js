const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "additem",
    description: "Give someone more of an item from the void",
    syntax: '{Player giving item to} {Name of item (must exist in inv)} {Amount of item}',
    cooldown: 5,
    aliases: [''],
    category: "Admin",
    execute(message, args) {
        const transferAmount = parseInt(args.find(arg => /^[+]?\d+([.]\d+)?$/g.test(arg)));
        args.shift();
        args.pop();
        let itemName = args.join(" ");
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

        const transferTarget = message.mentions.users.first();
        if (message.author.id == "752724534028795955" || message.author.id == "344431410360090625" || message.author.id == "272202473827991557") {
        User.findOne({ userID: message.author.id }, (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
            }
            else {
                if (!transferAmount || isNaN(transferAmount)) {
                    message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
                    return;
                }
                if (transferAmount <= 0) {
                    message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);
                    return;
                }
            }
            if(transferTarget == undefined){
                message.channel.send("invalid id");
                return;
            }
            User.findOne({ userID: transferTarget.id }, (err, target) => {
                if (target == null) {
                    message.channel.send("The person you are trying to give money to has not set up a player yet! Do =start to start.");
                }
                else {
                    if(target.inv[itemName]){
                        target.inv[itemName].quantity += transferAmount;  
                    }
                    else{
                        message.channel.send(`The person you are trying to give ${itemName} to does not own ${itemName}! Person must own item to give him more!`);
                    }
                    target.markModified('inv');
                    target.save()
                        .then(result => console.log(result))
                        .catch(err => console.error(err));
                    message.channel.send(`Successfully added ${transferAmount} ${itemName} to ${transferTarget.tag}. Their current quantity of ${itemName} is ${target.inv[itemName].quantity}`);
                }
            });
        })
    }else{
        message.channel.send("You have to be a bot developer to use this command")
    }
}
}
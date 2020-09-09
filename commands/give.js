const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "give",
    description: "Give someone your money",
    cooldown: 5,
    aliases: ['transfer'],
    execute(message, args) {
        const transferAmount = parseInt(args.find(arg => !/<@!?\d+>/g.test(arg)));
        const transferTarget = message.mentions.users.first();

        User.findOne({ userID: message.author.id }, (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
            }
            else {
                const currentAmount = user.currency;
                if (!transferAmount || isNaN(transferAmount)) {
                    message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
                    return;
                }
                if (transferAmount > currentAmount) {
                    message.channel.send(`Sorry ${message.author}, you only have ${currentAmount}.`);
                    return;
                }
                if (transferAmount <= 0) {
                    message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);
                    return;
                }
            }

            User.findOne({ userID: transferTarget.id }, (err, target) => {
                if (target == null) {
                    message.channel.send("The person you are trying to give money to has not set up a player yet! Do =start to start.");
                }
                else {
                    user.currency -= transferAmount;
                    target.currency += transferAmount;
                    user.save()
                        .then(result => console.log(result))
                        .catch(err => console.error(err));
                    target.save()
                        .then(result => console.log(result))
                        .catch(err => console.error(err));
                    message.channel.send(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${user.currency}💰`);
                }
            });
        })
    }
}

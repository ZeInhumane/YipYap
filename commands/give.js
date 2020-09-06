const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "give",
    description: "Claims a daily",
    cooldown: 5,
    aliases: ['transfer'],
    execute(message, args) {
        const currentAmount = User.findOne({ userID: message.author.id }, (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
            }
            else {
                user.currency;
            }

            const transferAmount = commandArgs.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));

            const transferTarget = User.findOne({ userID: message.mentions.users.first().id }, (err, user) => {
                if (user == null) {
                    message.channel.send("You have not set up a player yet! Do =start to start.");
                }
                else {
                    user.currency;
                }

                if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
                if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author}, you only have ${currentAmount}.`);
                if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);

                const currentAmount = User.findOne({ userID: message.author.id }, (err, user) => {
                    if (user == null) {
                        message.channel.send("You have not set up a player yet! Do =start to start.");
                    }
                    else {
                        user.currency -= transferAmount;
                    }

                    const transferTarget = User.findOne({ userID: message.mentions.users.first().id }, (err, user) => {
                        if (user == null) {
                            message.channel.send("You have not set up a player yet! Do =start to start.");
                        }
                        else {
                            user.currency += transferAmount;
                        }

                        return message.channel.send(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${user.currency}💰`);
                    }
        });

            })
        })
    }
}
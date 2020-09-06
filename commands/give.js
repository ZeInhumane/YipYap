const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "give",
    description: "Claims a daily",
    cooldown: 86400,
    aliases: ['transfer'],
    execute(message, args) {
                const currentAmount = user.currency(message.author.id);
                const transferAmount = commandArgs.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));
                const transferTarget = message.mentions.users.first();

                if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
                if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author}, you only have ${currentAmount}.`);
                if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);

                currency.add(message.author.id, -transferAmount);
                currency.add(transferTarget.id, transferAmount);

                return message.channel.send(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${user.currency(message.author.id)}💰`);
            }
        });
    }
}
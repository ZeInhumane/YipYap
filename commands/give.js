const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const findPrefix = require('../functions/findPrefix');

module.exports = {
    name: "give",
    description: "Want to transfer money to someone? This is the command to use. If you alt, I will spank you - matthew",
    syntax: "{Player giving money to} {Amount of money}",
    cooldown: 5,
    aliases: ['transfer'],
    category: "Economy",
    async execute(message, args) {
        let transferAmount = 1;
        const transferAmountIndex = args.findIndex(arg => /^[1-9]\d*$/g.test(arg));
        const transferTarget = message.mentions.users.first();
        //Getting the prefix from db
        const prefix = await findPrefix(message.guild.id);

        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }

            // Check if user entered a vaild transfer amount (else use default)
            if (transferAmountIndex != -1) {
                transferAmount = parseInt(args[transferAmountIndex]);
            }
            const currentAmount = user.currency;

            // Check if user can transfer that amount
            if (transferAmount > currentAmount) {
                message.channel.send(`Sorry ${message.author}, you only have ${currentAmount}.`);
                return;
            }

            if (transferTarget == undefined) {
                message.channel.send("invalid id");
                return;
            }

            User.findOne({ userID: transferTarget.id }, async (err, target) => {
                if (target == null) {
                    message.channel.send(`The person you are trying to give money to has not set up a player yet! They need to do ${prefix}start to start.`);
                    return;
                }

                user.currency -= transferAmount;
                target.currency += transferAmount;
                user.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
                target.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
                message.channel.send(`Successfully transferred ${transferAmount}<:cash_24:751784973488357457> to ${transferTarget.tag}. Your current balance is ${user.currency}<:cash_24:751784973488357457>`);
            });
        })
    }
}

const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const findPrefix = require('../functions/findPrefix');

module.exports = {
    name: "removegold",
    description: "Give someone your money",
    syntax: "{Player giving money to} {Amount of money}",
    cooldown: 5,
    aliases: [''],
    category: "Admin",
    execute(message, args) {
        const transferAmount = parseInt(args.find(arg => !/<@!?\d+>/g.test(arg)));
        const transferTarget = message.mentions.users.first();
        if (message.author.id == "752724534028795955" || message.author.id == "344431410360090625" || message.author.id == "272202473827991557") {
        User.findOne({ userID: message.author.id }, (err, user) => {
            if (user == null) {
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
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
                    target.currency -= transferAmount;
                    user.save()
                        .then(result => console.log(result))
                        .catch(err => console.error(err));
                    target.save()
                        .then(result => console.log(result))
                        .catch(err => console.error(err));
                    message.channel.send(`Successfully removed ${transferAmount}<:cash_24:751784973488357457> to ${transferTarget.tag}. Their current balance is ${target.currency}<:cash_24:751784973488357457>`);
                }
            });
        })
    }else{
        message.channel.send("You have to be a bot developer to use this command")
    }
}
}

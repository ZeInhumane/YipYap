const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "currency",
    description: "Shows the amount of currency a player has",
    aliases:['cash', 'balance', 'fat'],
    execute(message, args) {
        User.findOne({ userID: message.author.id }, (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
            }
            else {
                let embed = new Discord.MessageEmbed()
                    .setTitle('Currency')
                    .setColor('#000000')
                embed.addField(user.currency + "<:cash_24:751784973488357457>​");
                message.channel.send(embed);
            }
        });
    }
}
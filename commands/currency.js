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
                var name = message.member.user.tag.toString();
                name = name.split("#", name.length - 4);
                name = name[0];
                const embed = new Discord.MessageEmbed()
                    .setTitle(name + `'s Balance`)
                    .setColor('#000000')
                    .addField(user.currency + "<:cash_24:751784973488357457>​", "​");
                console.log(embed);
                message.channel.send(embed);
            }
        });
    }
}
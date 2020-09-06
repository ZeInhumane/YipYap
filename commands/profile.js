const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "profile",
    description: "Shows the amount of currency a player has",
    aliases:['me', 'meme', 'stats'],
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
                    .setTitle(name + `s profile`)
                    .setColor('#000000')
                    .setThumbnail(message.author.id)
                    .addField(user.currency + "<:cash_24:751784973488357457>​", true)
                    .addField(user.player.hp + "hp", true)
                    .addField(user.player.attack + "hp", true)
                    .addField(user.player.defense + "defense", true)
                    .addField(user.player.speed + "speed​", true)
                console.log(embed);
                message.channel.send(embed);
            }
        });
    }
}
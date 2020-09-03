const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "start",
    description: "Sets up a new player",
    execute(message, args, user) {
        User.findOne({ userID: message.author.id }, (err) => {
            if (err) {
                console.log("You have not set up a player yet! Do =start to start.")
            }
            else {
                let embed = new Discord.MessageEmbed()
                    .setTitle('Currency')
                    .setColor('#000000')
                embed.addField(user.currency, "​");
                return message.channel.send(embed);
            }
        });
    }
}
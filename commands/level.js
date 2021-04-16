const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "level",
    description: "Allows you to check the current exp, exp till next level and current level of character",
    syntax: "",
    cooldown: 3,
    category: "Fun",
    execute(message, args) {
        User.findOne({ userID: message.author.id }, (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
            }
            else { 
                // exp needed for each level
                var next_lvl = Math.floor(user.level * (user.level/10 * 15));
                var to_upgrade = next_lvl - user.exp;

                // put into discord
                var name = message.member.user.tag.toString();
                name = name.split("#", name.length - 4);
                name = name[0];
                const embed = new Discord.MessageEmbed()
                    .setTitle(name + "'s level information")
                    .setColor('#000000')
                    .addField('level: ' + user.level, "​")
                    .addField('current exp: ' + user.exp, "​")
                    .addField('exp to next level: ' + to_upgrade, "​")
                    .addField('total sp: ' + user.sp, "​")
                message.channel.send(embed);
            }
        });
    }
}
    
    
const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "inventory",
    description: "Shows player inventory",
    aliases: ['inv', 'i', 'icbm'],
    execute(message, args) {
        User.findOne({ userID: message.author.id }, (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
            }
            else {
                var name = message.member.user.tag.toString();
                name = name.split("#", name.length - 4);
                name = name[0];
                var embed = new Discord.MessageEmbed()
                    .setTitle(name + `'s Inventory`)
                    .setColor('#000000');
                user.inv.forEach((item) => {
                    embed.addField(item.itemName.charAt(0).toUpperCase() + item.itemName.slice(1), item.itemQuantity);
                })

                console.log(embed);
                message.channel.send(embed);
            }
        });
    }
}
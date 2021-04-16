const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "inventory",
    description: "Shows player inventory",
    aliases: ['inv', 'i', 'icbm'],
    category: "Fun",
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
                    .setTitle(`${name}'s Inventory`)
                    .setColor('#000001');
                ;
                
                let items = Object.entries(user.inv)
                for(i = 0; i < Object.entries(user.inv).length; i++){
                    let name = items[i][0];
                    let itemProperty = items[i][1];
                    embed.addField(`${itemProperty.emote} ${name.charAt(0).toUpperCase() + name.slice(1)}`,  itemProperty.quantity);
                }
                message.channel.send(embed);
            }
        });
    }
}
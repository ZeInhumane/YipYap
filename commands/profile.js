const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "profile",
    description: "Displays user profile, stats and weapons",
    syntax: "",
    aliases:['me', 'meme', 'stats'],
    category: "Fun",
    execute(message, args) {
        User.findOne({ userID: message.author.id }, (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
            }
            else {
                let name = message.member.user.tag.toString();
                name = name.split("#", name.length - 4);
                name = name[0];
                const embed = new Discord.MessageEmbed()
                //can be formatted better
                    .setTitle(name + `'s profile`)
                    .setColor('#000000')
                    .addField("<:cash_24:751784973488357457>  ​" + user.currency, "\u200b",true)
                    .addField(":level_slider:  " + user.level,"\u200b",true)
                    .addField(":hearts:  " + user.player.hp,"\u200b",true)
                    .addField(":crossed_swords:  " + user.player.attack,"\u200b",true)
                    .addField(":shield:  " + user.player.defense,"\u200b",true)
                    .addField(":speedboat:  " + user.player.speed,"\u200b",true)
                if(Object.values(user.player.weapon) != ""){
                    embed.addField("⚔️Equipped Equipment⚔️"  ,  Object.values(user.player.weapon)[0].emote + " " +  Object.keys(user.player.weapon) + " " +  Object.values(user.player.weapon)[0].stats.attack + "attack",true)
                }
                message.channel.send(embed);
            }
        });
    }
}
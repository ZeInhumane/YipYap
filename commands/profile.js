const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const botLevel = require('../models/botLevel');
module.exports = {
    name: "profile",
    description: "Displays user profile, stats and weapons",
    syntax: "",
    aliases:['me', 'meme', 'stats'],
    category: "Fun",
    execute(message, args) {
        User.findOne({ userID: message.author.id },async (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
            }
            else {
                let locationInfo = await botLevel.findOne({ 'Level.Location': user.location });
                // exp needed for each level
                let next_lvl = Math.floor(user.level * (user.level/10 * 15));
                let to_upgrade = next_lvl - user.exp;
                
                let name = message.member.user.tag.toString();
                name = name.split("#", name.length - 4);
                name = name[0];
                const embed = new Discord.MessageEmbed()
                //can be formatted better
                    .setTitle(name + `'s profile`)
                    .setColor('#000000')
                    .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                    .addField("<:cash_24:751784973488357457>    " + user.currency, "\u200b",true)
                    .addField(":level_slider:  " + user.level,"\u200b",true)
                    .addField(":hearts:  " + user.player.hp,"\u200b",true)
                    .addField(":crossed_swords:  " + user.player.attack,"\u200b",true)
                    .addField(":shield:  " + user.player.defense,"\u200b",true)
                    .addField(":speedboat:  " + user.player.speed,"\u200b",true)
                    .addField('Level: ' , user.level,true)
                    .addField('Current Experience: '  , `${user.exp}/${to_upgrade}`,true)
                    .addField('Experience to next level: ', to_upgrade,true)
                    .addField('Total sp: ' , user.sp,true)
                    .addField(`Location Name: \n${locationInfo.Level.LocationName}`, "\u200b", true)
                    .setImage(locationInfo.Level.LocationImage)
                if(Object.values(user.player.weapon) != ""){
                    embed.addField("⚔️Equipped Equipment⚔️"  ,  Object.values(user.player.weapon)[0].emote + " " +  Object.keys(user.player.weapon) + " " +  Object.values(user.player.weapon)[0].stats.attack + "attack",true)
                }
                message.channel.send(embed);
            }
        });
    }
}
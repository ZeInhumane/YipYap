const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const botLevel = require('../models/botLevel');
const findPrefix = require('../functions/findPrefix');

module.exports = {
    name: "floor",
    description: "Move to a new location to receive different prizes :)",
    syntax: "{Floor to access}",
    cooldown: 10,
    aliases: ['fl'],
    category: "Economy",
    execute(message, args) {
        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                //Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }

            let floorToAccess = parseInt(args[0]);
            let embedColor = "#0099ff"
            //checks if argument is keyed in properly
            if(isNaN(floorToAccess)) floorToAccess = parseInt(user.location)
            let locationInfo = await botLevel.findOne({ 'Location': floorToAccess }).exec();
            if (!locationInfo) {
                message.channel.send("It looks like this isn't a valid location")
                return;
            }
            locationInfo = locationInfo._doc;
            
            userInfo = await User.findOne({ userID: message.author.id }, (err, user) => {
                if (locationInfo.Requirement > user.level) {
                    message.channel.send(`It looks like you do not meet the requirements to access this floor, come back when you are level ${locationInfo.Requirement}`);
                    return;
                }
                user.location = floorToAccess;
                user.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));

                const floorEmbed = new Discord.MessageEmbed()
                    .setColor(embedColor)
                    .setTitle(`You have successfully entered location ${floorToAccess} `)
                    .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                    .addField(`**${locationInfo.LocationName}**`, `\u200b`)
                    .addField(`${locationInfo.LocationName} applied enemy buffs`, `**Health** Multiplier: ${locationInfo.Buff.hp}  **Attack** Multiplier: ${locationInfo.Buff.attack}\n **Defense** Multiplier: ${locationInfo.Buff.defense}  **Speed** Multiplier: ${locationInfo.Buff.speed}`)
                    .addField(`Additional rewards due to current location`, `**Experience** Multiplier:${locationInfo.Rewards.ExpMultiplier}  **Gold** Multiplier: ${locationInfo.Rewards.GoldMultiplier}`)
                    .setImage(locationInfo.LocationImage)
                message.channel.send({ embeds: [floorEmbed] });
            });
        });
    }
}
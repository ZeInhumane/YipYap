const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const botLevel = require('../models/botLevel');

module.exports = {
    name: "floor",
    description: "Moves to a new location",
    syntax: "{Floor to access}",
    cooldown: 10,
    aliases: ['fl'],
    category: "Economy",
    execute(message, args) {
        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
            }
            else {
                const floorToAccess = parseInt(args[0]);
                let embedColor = "#0099ff"
                let locationInfo = await botLevel.findOne({ 'Level.Location': floorToAccess });
                if (locationInfo == null) {
                    message.channel.send("It looks like this isn't a valid location")
                    return;
                }
                userInfo = await User.findOne({ userID: message.author.id }, (err, user) => {
                    if (locationInfo.Level.Requirement <= user.level) {
                        user.location = floorToAccess;
                        user.save()
                            .then(result => console.log(result))
                            .catch(err => console.error(err));
                        
                            const floorEmbed = new Discord.MessageEmbed()
                            .setColor(embedColor)
                            .setTitle(`You have successfully entered location ${floorToAccess} `)
                            .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                            .addField(`Location Name: \n${locationInfo.Level.LocationName}`, `Applied Modifiers for current location \n${locationInfo.Level.Description} \n${locationInfo.Level.RewardDescription}`, true)
                            .setImage(locationInfo.Level.LocationImage)
                        message.channel.send(floorEmbed)
                    } else {
                        message.channel.send(`It looks like you do not meet the requirements to access this floor, come back when you are level ${locationInfo.Level.Requirement}`)
                    }
                });

            }
        });
    }
}
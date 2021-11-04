const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const botLevel = require('../models/botLevel');
const findItem = require('../functions/findItem.js');
const getFinalStats = require('../functions/getFinalStats');
const findPrefix = require('../functions/findPrefix')
const equip = require('./equip');
module.exports = {
    name: "profile",
    description: "Displays user profile, stats and weapons of the user.",
    syntax: "",
    aliases: ['me', 'meme', 'stats'],
    category: "Fun",
    execute(message, args) {
        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                //Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
            }
            else {
                function calulateFinalStat(statName) {
                    return Math.round(user.player.baseStats[statName] * (1 + user.player.additionalStats[statName].multi / 100) + user.player.additionalStats[statName].flat);
                }

                let locationInfo = await botLevel.findOne({ 'Location': user.location });
                // exp needed for each level
                let next_lvl = Math.floor(user.level * (user.level / 10 * 15));
                let to_upgrade = next_lvl - user.exp;

                let name = message.member.user.tag.toString();
                name = name.split("#", name.length - 4);
                name = name[0];
                const embed = new Discord.MessageEmbed()
                    //can be formatted better
                    .setTitle(name + `'s profile`)
                    .setColor('#000000')
                    .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                    .addField("<:cash_24:751784973488357457> Currency  " + user.currency, " \u200b", true)
                    .addField(":level_slider: Level:  " + user.level, " \u200b", true)
                    .addField(":hearts: Health Point: " + calulateFinalStat("hp"), " \u200b", true)
                    .addField(":crossed_swords: Attack: " + calulateFinalStat("attack"), " \u200b", true)
                    .addField(":shield: Defense: " + calulateFinalStat("defense"), " \u200b", true)
                    .addField("💨 Speed: " + calulateFinalStat("speed"), " \u200b", true)
                    .addField('Level: ', ` ${user.level}`, true)
                    .addField('Current Experience: ', `${user.exp}/${next_lvl}`, true)
                    .addField('Experience to next level: ', ` ${to_upgrade}`, true)
                    .addField('Total Available Special Points: ', ` ${user.sp}`, true)
                    .addField(`Location Name: \n${locationInfo._doc.LocationName}`, " \u200b", true)
                    .setImage(locationInfo._doc.LocationImage)

                // Finds all equipped items
                let userItemsArr = Object.keys(user.inv);
                var equipment = userItemsArr.filter(item => {
                    return user.inv[item].equipped === true;
                });
                embed.addField("⚔️Equipped Equipment⚔️", ` \u200b`)
                for (let i = 0; i < equipment.length; i++) {
                    //gets the weapons stats from db
                    //itemName gets the item name.. a bit messy but its required
                    let itemName = equipment[i].split("#")[0];
                    let dbEquipmentStats = await findItem(itemName, true);
                    let stats = getFinalStats(user.inv[equipment[i]], dbEquipmentStats);
                    let statsmsg = ''
                    for (let j = 0; j < Object.keys(stats).length; j++) {
                        let statname = Object.keys(stats)[j]
                        statname = statname.replace("attack", " Attack ⚔️ \n");
                        statname = statname.replace("defense", " Defense 🛡️ \n");
                        statname = statname.replace("speed", " Speed 💨 \n");
                        statname = statname.replace("hp", " Health Point :hearts: \n");
                        //wth does this do?
                        statsmsg += `${(Object.values(stats)[0].flat != 0) ? '+' + Object.values(stats)[0].flat + statname : ''} ${(Object.values(stats)[0].multi != 0) ? '+' + Object.values(stats)[0].multi + '%' + statname : ''} `
                    }
                    embed.addField(`${dbEquipmentStats.emote} ${equipment[i]} `, ` ${statsmsg}`, true)
                }
                message.channel.send({ embeds: [embed] });
            }
        });
    }
}
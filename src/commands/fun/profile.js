const User = require('../../models/user');
const Discord = require('discord.js');
const findItem = require('../../functions/findItem.js');
const getFinalStats = require('../../functions/getFinalStats');
const findPrefix = require('../../functions/findPrefix');
const areaUtil = require('../areas/utils/areaUtil');

module.exports = {
    name: "profile",
    description: "Displays user profile, stats and weapons of the user.",
    syntax: "",
    aliases: ['me', 'meme', 'stats', 'p'],
    category: "Fun",
    execute({ message }) {
        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                // Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
            } else {
                // exp needed for each level
                const next_lvl = Math.floor(user.level * (user.level / 10 * 15));
                const to_upgrade = next_lvl - user.exp;

                let name = message.member.user.tag.toString();
                name = name.split("#", name.length - 4);
                name = name[0];

                const Area = areaUtil.getArea(user.location.area);

                const embed = new Discord.MessageEmbed()
                    // can be formatted better
                    .setTitle(name + `'s profile`)
                    .setColor('#000000')
                    .setAuthor({ name: message.member.user.tag, iconURL: message.author.displayAvatarURL(), url: 'https://discord.gg/h4enMADuCN' })
                    .addField("<:cash_24:751784973488357457> Currency  " + user.currency, " \u200b", true)
                    .addField(":level_slider: Level:  " + user.level, " \u200b", true)
                    .addField(":hearts: Health Point: " + calculatedStats.hp, " \u200b", true)
                    .addField(":crossed_swords: Attack: " + calculatedStats.attack, " \u200b", true)
                    .addField(":shield: Defense: " + calculatedStats.defense, " \u200b", true)
                    .addField("💨 Speed: " + calculatedStats.speed, " \u200b", true)
                    .addField('Level: ', ` ${user.level}`, true)
                    .addField('Current Experience: ', `${user.exp}/${next_lvl}`, true)
                    .addField('Experience to next level: ', ` ${to_upgrade}`, true)
                    .addField('Total Available Special Points: ', ` ${user.sp}`, true)
                    .addField(`Location Name: \n${Area.getName} | ${user.location.area} - ${user.location.floor}`, " \u200b", true)
                    .setImage(Area.getImageURL);

                // Finds all equipped items
                const userItemsArr = Object.keys(user.inv);
                const equipment = userItemsArr.filter(item => {
                    return user.inv[item].equipped === true;
                });
                embed.addField("⚔️Equipped Equipment⚔️", ` \u200b`);
                for (let i = 0; i < equipment.length; i++) {
                    // gets item name, then gets said item name stats
                    const itemName = equipment[i].split("#")[0];
                    const dbEquipmentStats = await findItem(itemName, true);
                    const stats = getFinalStats(user.inv[equipment[i]], dbEquipmentStats);
                    let statsmsg = '';
                    for (let j = 0; j < Object.keys(stats).length; j++) {
                        let statname = Object.keys(stats)[j];
                        statname = statname.replace("attack", " Attack ⚔️ \n").replace("defense", " Defense 🛡️ \n").replace("speed", " Speed 💨 \n").replace("hp", " Health Point :hearts: \n");
                        statsmsg += `${(Object.values(stats)[j].flat != 0) ? '+' + Object.values(stats)[j].flat + statname : ''} ${(Object.values(stats)[j].multi != 0) ? '+' + Object.values(stats)[j].multi + '%' + statname : ''} `;
                    }
                    embed.addField(`${dbEquipmentStats.emote} ${equipment[i]} `, ` ${statsmsg}`, true);
                }
                message.channel.send({ embeds: [embed] });
            }
        });

    },
};

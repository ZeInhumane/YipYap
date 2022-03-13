const User = require('../../models/user');
const Discord = require('discord.js');
const findItem = require('../../functions/findItem.js');
const getFinalStats = require('../../functions/getFinalStats');
const findPrefix = require('../../functions/findPrefix');
const areaUtil = require('../areas/utils/areaUtil');
const calculateUserStats = require('../../functions/calculateUserStats');
const clanUtil = require('./utils/clanUtil');
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
                let clanName;
                let name = message.member.user.tag.toString();
                name = name.split("#", name.length - 4);
                name = name[0];
                // Get clan name
                const clanData = await clanUtil(user.clanID);
                if (clanData) {
                    clanName = clanData.clanName;
                } else {
                    clanName = "None";
                }
                const Area = areaUtil.getArea(user.location.area);
                const calculatedStats = await calculateUserStats(user, false);
                const embed = new Discord.MessageEmbed()
                    // can be formatted better
                    .setTitle(name + `'s profile`)
                    .setColor('#000000')
                    .setAuthor({ name: message.member.user.tag, iconURL: message.author.displayAvatarURL(), url: 'https://discord.gg/h4enMADuCN' })
                    .addField("Currency  ", `${user.currency} <:cash_24:751784973488357457>`, true)
                    .addField("Level", `${user.level} :level_slider:`, true)
                    .addField('EXP', `${user.exp} / ${next_lvl}`, true)
                    .addField('Available SP', ` ${user.sp}`, true)
                    .addField(`Location`, `${Area.getName} | ${user.location.area || 1} - ${user.location.floor || 1}`, true)
                    .addField('Clan', ` ${clanName}`, true)
                    .setImage(Area.getImageURL);
                // Finds all equipped items
                const userItemsArr = Object.keys(user.inv);
                const equipment = userItemsArr.filter(item => {
                    return user.inv[item].equipped === true;
                });
                let insertLine = '';
                for (let i = 0; i < equipment.length; i++) {
                    // gets item name, then gets said item name stats
                    const itemName = equipment[i].split("#")[0];
                    const dbEquipmentStats = await findItem(itemName, true);
                    const stats = getFinalStats(user.inv[equipment[i]], dbEquipmentStats);
                    let statsmsg = '';
                    for (let j = 0; j < Object.keys(stats).length; j++) {
                        let statname = Object.keys(stats)[j];
                        statname = statname.replace("attack", " ATK  \n").replace("defense", " 🛡️ DEF  \n").replace("speed", " 💨 SPD  \n").replace("hp", ":hearts: HP  \n");
                        statsmsg += `${(Object.values(stats)[j].flat != 0) ? '\u2009 \u2009 \u2009 +' + `__${Object.values(stats)[j].flat}__` + statname : ''} ${(Object.values(stats)[j].multi != 0) ? '\u2009 \u2009 \u2009 +' + `__${Object.values(stats)[j].multi}__` + '%' + statname : ''} `;
                    }
                    // Remove # from item name
                    insertLine += `**${equipment[i].split("#")[0]}** \n ${statsmsg}`;
                }
                if (insertLine === '') {
                    insertLine = 'None';
                }
                embed.addField(`**STATS**`, ` :hearts: **HP**: ${calculatedStats.hp} \n⚔️ **ATK**: ${calculatedStats.attack} \n 🛡️ **DEF**:  ${calculatedStats.speed} \n 💨 **SPD**:  ${calculatedStats.speed}`, true);
                embed.addField("**EQUIPMENT**", ` ${insertLine}`, true);
                message.channel.send({ embeds: [embed] });
            }
        });

    },
};

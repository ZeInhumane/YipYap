const User = require('../../models/user');
const Discord = require('discord.js');
const findItem = require('../../functions/findItem.js');
const getFinalStats = require('../../functions/getFinalStats');
const findPrefix = require('../../functions/findPrefix');
const areaUtil = require('../areas/utils/areaUtil');
const calculateUserStats = require('../../functions/calculateUserStats');
const clanUtil = require('./utils/clanUtil');
const { createCanvas, Image, loadImage } = require('@napi-rs/canvas');
const { Client, GatewayIntentBits, AttachmentBuilder, MessageAttachment } = require('discord.js');
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
                const canvas = createCanvas(4096, 4096);
                const context = canvas.getContext('2d');

                const userItemsArr1 = Object.keys(user.inv);
                const currentEquippedItem = [];
                // Gets all equipped item from user
                userItemsArr1.find(item => {
                    if (user.inv[item].equipped === true) {
                        currentEquippedItem.push(user.inv[item]);
                    }
                });
                await Promise.all(currentEquippedItem.map(async (itemData) => {
                    const imageSize = 1024;
                    if (itemData.image) {
                        const equipmentImage = await loadImage(itemData.image);
                        if (weaponType[itemData.equipmentType].name == "weapon") {
                            context.drawImage(equipmentImage, 200 + imageSize, 50 + (weaponType[itemData.equipmentType].autoIncrement * imageSize), imageSize, imageSize);
                        } else {
                            context.drawImage(equipmentImage, 200, 50 + (weaponType[itemData.equipmentType].autoIncrement * imageSize), imageSize, imageSize);
                        }
                    }
                }));

                const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');
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
                    .setImage('attachment://profile-image.png'); 

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
                        statname = statname.replace("attack", " ⚔ ️ATK  ").replace("defense", " 🛡️ DEF  ").replace("speed", " 💨 SPD  ").replace("hp", ":hearts: HP  ");
                        statsmsg += `${(Object.values(stats)[j].flat != 0) ? '+' + `__${Object.values(stats)[j].flat}__` : ''} ${(Object.values(stats)[j].multi != 0) ? ', ' + `__${Object.values(stats)[j].multi}__` + '%' : ''} ${statname} \n `;
                    }
                    // Remove # from item name
                    insertLine += `**${equipment[i].split("#")[0]}:**  ${statsmsg}\n`;
                }

                if (insertLine === '') {
                    insertLine = 'None';
                }


                embed.addField(`**STATS**`, ` :hearts: **HP**: ${calculatedStats.hp} \n⚔️ **ATK**: ${calculatedStats.attack} \n 🛡️ **DEF**:  ${calculatedStats.defense} \n 💨 **SPD**:  ${calculatedStats.speed}`, true);
                embed.addField("**EQUIPMENT**", ` ${insertLine}`, true);
                message.channel.send({ embeds: [embed], files: [attachment] });
            }
        });

    },
};

const weaponType = {
    helmet: { name: "helmet", autoIncrement: 0 },
    chestplate: { name: "chestplate", autoIncrement: 1 },
    weapon: { name: "weapon", autoIncrement: 1.1 },
    leggings: { name: "leggings", autoIncrement: 2 },
    boots: { name: "boots", autoIncrement: 3 },
};
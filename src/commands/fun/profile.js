const User = require('../../models/user');
const Discord = require('discord.js');
const findItem = require('../../functions/findItem.js');
const getFinalStats = require('../../functions/getFinalStats');
const findPrefix = require('../../functions/findPrefix');
const areaUtil = require('../areas/utils/areaUtil');
const calculateUserStats = require('../../functions/calculateUserStats');
const clanUtil = require('./utils/clanUtil');
const { createCanvas, Image, loadImage } = require('@napi-rs/canvas');
const { readFile } = require('fs/promises');
const { MessageAttachment } = require('discord.js');
module.exports = {
    name: "profile",
    description: "Displays user profile, stats and weapons of the user.",
    syntax: "",
    aliases: ['me', 'meme', 'stats', 'p'],
    category: "Fun",
    execute({ message, client }) {
        User.findOne({ userID: message.author.id }, async (err, user) => {
            // exp needed for each level
            const next_lvl = Math.floor(user.level * (user.level / 10 * 15));
            let clanName;
            let name = message.member.user.tag.toString();
            name = name.split("#", name.length - 4);
            name = name[0];

            // Get clan name
            const clanData = await clanUtil(user.clanID);
            clanData ? clanName = clanData.name : clanName = "None";

            const canvas = createCanvas(2048, 2048);
            const context = canvas.getContext('2d');
            const imageSize = 370;

            const Area = areaUtil.getArea(user.location.area);
            const background = await readFile('./src/constants/image/profile_transparent.png');
            const backgroundImage = new Image();
            backgroundImage.src = background;
            context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

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

            await Promise.all(equipment.map(async (itemData, i) => {
                let itemName = equipment[i].split("#")[0];
                const values = await findItem(itemName, true);
                if (!values){
                    message.channel.send(`Invalid item name ${itemName}.`);
                    return;
                }
                const dbEquipmentStats = values[0];
                const newName = values[1];
                if (itemName != newName){
                    itemName = newName + '#' + itemName.split('#')[1];
                }
                const stats = getFinalStats(user.inv[equipment[i]], dbEquipmentStats);

                let fontSize = 50;
                const fontSpace = 20;
                const imageGapText = 130;

                context.font = `${fontSize}px OCR A Extended`;
                context.fillStyle = client.config.colors.primary;
                if (dbEquipmentStats.image) {
                    try {
                        console.log(dbEquipmentStats.image);
                        const equipmentImage = await loadImage(dbEquipmentStats.image);
                        if (equipmentImage) {
                            if (weaponType[dbEquipmentStats.equipmentType].name == "weapon") {
                                context.drawImage(equipmentImage, 750 + imageSize, 50 + (weaponType[dbEquipmentStats.equipmentType].autoIncrement * (imageSize + 120)), imageSize, imageSize);
                                context.fillText(`${itemName}`, 1250 + imageSize, 320 + (weaponType[dbEquipmentStats.equipmentType].autoIncrement * (imageSize)));
                                fontSize = 50;
                                context.font = `${fontSize}px OCR A Extended`;
                                context.fillStyle = '#bcabff';
                                for (let j = 0; j < Object.keys(stats).length; j++) {
                                    context.fillText(`${returnFormattedStats(stats, j)}`, 1250 + imageSize, 400 + (weaponType[dbEquipmentStats.equipmentType].autoIncrement * (imageSize)) + ((fontSize + fontSpace) * j));
                                }
                            } else {
                                context.drawImage(equipmentImage, 600, 50 + (weaponType[dbEquipmentStats.equipmentType].autoIncrement * (imageSize + 150)), imageSize, imageSize);
                                context.fillText(`${itemName}`, 50, 220 + (weaponType[dbEquipmentStats.equipmentType].autoIncrement * (imageSize + imageGapText)));
                                fontSize = 50;
                                context.font = `${fontSize}px OCR A Extended`;
                                context.fillStyle = '#bcabff';
                                for (let j = 0; j < Object.keys(stats).length; j++) {
                                    context.fillText(`${returnFormattedStats(stats, j)}`, 50, 300 + (weaponType[dbEquipmentStats.equipmentType].autoIncrement * (imageSize + imageGapText)) + ((fontSize + fontSpace) * j));
                                }
                            }
                            fontSize = 50;
                            context.fillStyle = '#629dc9';
                        }
                    } catch {
                        console.error(new ReferenceError("Image not found", dbEquipmentStats.image));
                    }
                }
            }));
            const calculatedStats = await calculateUserStats(user, false);
            embed.addField(`**STATS**`, ` :hearts: **HP**: ${calculatedStats.hp} \n⚔️ **ATK**: ${calculatedStats.attack} \n 🛡️ **DEF**:  ${calculatedStats.defense} \n 💨 **SPD**:  ${calculatedStats.speed}`, true);
            // embed.addField("**EQUIPMENT**", ` ${insertLine}`, true);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');
            await message.channel.send({ embeds: [embed], files: [attachment] });

        });

    },
};
const returnFormattedStats = (stats, index) => {
    let formattedStats = Object.keys(stats)[index];
    formattedStats = formattedStats.replace("attack", "⚔️ ATK ").replace("defense", "🛡️ DEF ").replace("speed", "💨 SPD ").replace("hp", "❤️ HP ");
    formattedStats += `${(Object.values(stats)[index].flat != 0) ? '+' + `${Object.values(stats)[index].flat}` : ''} ${(Object.values(stats)[index].multi != 0) ? ', ' + `${Object.values(stats)[index].multi}` + '%' : ''} `;
    return formattedStats;
};

const weaponType = {
    helmet: { name: "helmet", autoIncrement: 0 },
    chestplate: { name: "chestplate", autoIncrement: 1 },
    weapon: { name: "weapon", autoIncrement: 1.1 },
    leggings: { name: "leggings", autoIncrement: 2 },
    boots: { name: "boots", autoIncrement: 3 },
};
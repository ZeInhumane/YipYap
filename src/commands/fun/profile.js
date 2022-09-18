const Discord = require('discord.js');
const findItem = require('../../functions/findItem.js');
const getFinalStats = require('../../functions/getFinalStats');
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
    async execute({ message, client, user }) {
        // exp needed for each level
        const expToNextLevel = Math.floor(user.level * (user.level / 10 * 15));
        let clanName;
        let name = message.member.user.tag.toString();
        name = name.split("#", name.length - 4);
        name = name[0];

        // Get clan name
        const clanData = await clanUtil(user.clanID);
        clanData ? clanName = clanData.clanName : clanName = "None";

        const canvas = createCanvas(2048, 2048);
        const context = canvas.getContext('2d');
        const imageSize = 370;

        const Area = areaUtil.getArea(user.location.area);
        const background = await readFile('./src/constants/image/profile_transparent.png');
        const backgroundImage = new Image();
        backgroundImage.src = background;
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        const embed = new Discord.MessageEmbed()
            .setTitle(name + `'s profile`)
            .setColor('#000000')
            .setAuthor({ name: message.member.user.tag, iconURL: message.author.displayAvatarURL(), url: 'https://discord.gg/h4enMADuCN' })
            .addField("Currency  ", `${user.currency} <:cash_24:751784973488357457>`, true)
            .addField("Level", `${user.level} :level_slider:`, true)
            .addField('EXP', `${user.exp} / ${expToNextLevel}`, true)
            .addField('Available SP', ` ${user.sp}`, true)
            .addField(`Location`, `${Area.getName} | ${user.location.area || 1} - ${user.location.floor || 1}`, true)
            .addField('Clan', ` ${clanName}`, true)
            .setImage('attachment://profile-image.png');

        // Finds all equipped items
        const userItemsArr = Object.keys(user.inv);
        const equipment = userItemsArr.filter(item => {
            return user.inv[item].equipped === true;
        });

        // Alignment
        let fontSize = 60;
        const paddingTopFont = 20;
        const paddingTopImage = 130;
        const paddingTop = 50;
        const paddingTopTextHeader = 120;
        const paddingTopTextIDHeader = 200;
        const paddingTopText = 300;
        const paddingLeftImage = 600;
        const paddingLeftImageWeapon = 750;
        const paddingLeftText = 10;
        const paddingLeftWeapon = 1200;
        const paddingImages = 150;

        await Promise.all(equipment.map(async (itemData, i) => {
            const itemName = equipment[i].split("#")[0];
            const itemID = "#" + equipment[i].split("#")[1];
            let dbEquipmentStats = await findItem(itemName, true);
            dbEquipmentStats = dbEquipmentStats[0];

            const stats = getFinalStats(user.inv[equipment[i]], dbEquipmentStats);

            // Font and Fontstyle
            context.font = `bold ${fontSize}px Uni Sans`;
            context.fillStyle = client.config.colors.primary;

            try {
                let equipmentImage;
                try {
                    equipmentImage = await loadImage(dbEquipmentStats.image);
                } catch {
                    console.error(new ReferenceError("Image not found", dbEquipmentStats.image));
                    const notFound = await readFile('./src/constants/image/not_found2.jpg');
                    equipmentImage = new Image();
                    equipmentImage.src = notFound;
                }

                if (weaponType[dbEquipmentStats.equipmentType].name == "weapon") {
                    context.drawImage(equipmentImage, paddingLeftImageWeapon + imageSize, paddingTop + (weaponType[dbEquipmentStats.equipmentType].autoIncrement * (imageSize + paddingImages)), imageSize, imageSize);
                    context.fillText(`${itemName}`, paddingLeftWeapon + imageSize, paddingTopTextHeader + (weaponType[dbEquipmentStats.equipmentType].autoIncrement * (imageSize + paddingTopImage)));
                    context.fillText(`${itemID}`, paddingLeftWeapon + imageSize, paddingTopTextIDHeader + (weaponType[dbEquipmentStats.equipmentType].autoIncrement * (imageSize + paddingTopImage)));
                    fontSize = 50;
                    context.font = `${fontSize}px Uni Sans`;
                    context.fillStyle = '#bcabff';
                    for (let j = 0; j < Object.keys(stats).length; j++) {
                        context.fillText(`${returnFormattedStats(stats, j)}`, paddingLeftWeapon + imageSize, paddingTopText + (weaponType[dbEquipmentStats.equipmentType].autoIncrement * (imageSize + paddingTopImage)) + ((fontSize + paddingTopFont) * j));
                    }
                } else {
                    context.drawImage(equipmentImage, paddingLeftImage, paddingTop + (weaponType[dbEquipmentStats.equipmentType].autoIncrement * (imageSize + paddingImages)), imageSize, imageSize);
                    context.fillText(`${itemName}`, paddingLeftText, paddingTopTextHeader + (weaponType[dbEquipmentStats.equipmentType].autoIncrement * (imageSize + paddingTopImage)));
                    context.fillText(`${itemID}`, paddingLeftText, paddingTopTextIDHeader + (weaponType[dbEquipmentStats.equipmentType].autoIncrement * (imageSize + paddingTopImage)));
                    fontSize = 50;
                    context.font = `${fontSize}px Uni Sans`;
                    context.fillStyle = '#bcabff';
                    for (let j = 0; j < Object.keys(stats).length; j++) {
                        context.fillText(`${returnFormattedStats(stats, j)}`, paddingLeftText, paddingTopText + (weaponType[dbEquipmentStats.equipmentType].autoIncrement * (imageSize + paddingTopImage)) + ((fontSize + paddingTopFont) * j));
                    }
                }
                fontSize = 60;
                context.font = `bold ${fontSize}px Uni Sans`;
                context.fillStyle = '#629dc9';
            } catch (error) {
                console.error(new Error("Exception", error));
            }
        }));
        fontSize = 100;
        context.font = `bold ${fontSize}px Uni Sans`;
        context.fillStyle = '#629dc9';
        const calculatedStats = await calculateUserStats(user, false);
        console.log(calculatedStats);
        context.fillText(`Total Stats:`, paddingLeftWeapon, paddingTopTextHeader + (2 * (imageSize + paddingTopImage)));
        fontSize = 90;
        context.font = `${fontSize}px Uni Sans`;
        context.fillStyle = '#bcabff';

        let iterable = 1;
        for (const [key, value] of Object.entries(calculatedStats)) {
            context.fillText(formatStatName(key) + value, paddingLeftWeapon, paddingTopTextHeader + (2 * (imageSize + paddingTopImage)) + ((fontSize + paddingTopFont) * iterable));
            iterable++;
        }

        // embed.addField(`**STATS**`, ` :hearts: **HP**: ${calculatedStats.hp} \n⚔️ **ATK**: ${calculatedStats.attack} \n 🛡️ **DEF**:  ${calculatedStats.defense} \n 💨 **SPD**:  ${calculatedStats.speed}`, true);

        const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');
        await message.channel.send({ embeds: [embed], files: [attachment] });
    },
};
const formatStatName = (statName) => {
    const formattedStatName = statName.replace("attack", "⚔️ ATK ").replace("defense", "🛡️ DEF ").replace("speed", "💨 SPD ").replace("hp", "❤️ HP ");
    return formattedStatName;
};
const returnFormattedStats = (stats, index) => {
    let formattedStats = Object.keys(stats)[index];
    formattedStats = formatStatName(formattedStats);
    formattedStats += `${(Object.values(stats)[index].flat != 0) ? '+' + `${Object.values(stats)[index].flat}` : ''} ${(Object.values(stats)[index].multi != 0) ? ', ' + `${Object.values(stats)[index].multi}` + '%' : ''} `;
    return formattedStats;
};

const weaponType = {
    helmet: { name: "helmet", autoIncrement: 0 },
    chestplate: { name: "chestplate", autoIncrement: 1 },
    weapon: { name: "weapon", autoIncrement: 1 },
    leggings: { name: "leggings", autoIncrement: 2 },
    boots: { name: "boots", autoIncrement: 3 },
};
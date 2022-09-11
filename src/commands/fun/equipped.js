const { Client, GatewayIntentBits, AttachmentBuilder, MessageAttachment } = require('discord.js');
const { createCanvas, Image, loadImage } = require('@napi-rs/canvas');
const { readFile } = require('fs/promises');
const { request } = require('undici');

module.exports = {
    name: "equipped",
    description:
        "Check equipped weapons",
    aliases: ["inv", "itemCount", "icbm"],
    cooldown: 5,
    category: "Fun",
    async execute({ client, message, user }) {
        const canvas = createCanvas(2500, 4096);
        const context = canvas.getContext('2d');

        const userItemsArr = Object.keys(user.inv);
        const currentEquippedItem = [];
        // Gets all equipped item from user
        userItemsArr.find(item => {
            if (user.inv[item].equipped === true) {
                console.log(item);
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


        // context.font = applyText(canvas, `${message.author.username}!`);
        // context.fillStyle = '#ffffff';
        // context.fillText(`${message.author.username}!`, canvas.width / 2.5, canvas.height / 1.8);

        // context.beginPath();
        // context.arc(125, 125, 100, 0, Math.PI * 2, true);
        // context.closePath();
        // context.clip();

        // const { body } = await request(client.user.displayAvatarURL({ format: 'png' }));
        // const avatar = new Image();
        // avatar.src = Buffer.from(await body.arrayBuffer());
        // context.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');

        message.reply({ files: [attachment] });

    },

};
const applyText = (canvas, text) => {
    const context = canvas.getContext('2d');
    let fontSize = 70;

    do {
        context.font = `${fontSize -= 10}px sans-serif`;
    } while (context.measureText(text).width > canvas.width - 300);

    return context.font;
};
const weaponType = {
    helmet: { name: "helmet", autoIncrement: 0 },
    chestplate: { name: "chestplate", autoIncrement: 1 },
    weapon: { name: "weapon", autoIncrement: 1.1 },
    leggings: { name: "leggings", autoIncrement: 2 },
    boots: { name: "boots", autoIncrement: 3 },
};
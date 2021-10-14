const { set } = require('mongoose');
const Discord = require('discord.js');
const Shop = require('../models/shopData');
const User = require('../models/user');
const findItem = require('../functions/findItem.js');

module.exports = {
    name: "shop",
    description: "Shopee pee pee pee. No its just the shop.",
    syntax: "",
    cooldown: 5,
    category: "Fun",
    async execute(message, args) {
        let onPage = 0;
        let currentColor = '#0099ff';
        // Sets how many items are displayed on a single shop page
        let maxOnPage = 3;
        // Shows max number of page, example if the there are 20 items, there would be 7 pages(Determined by maxOnPage and number of items)
        let totalItems = await Shop.countDocuments({}).exec();
        // Lets shop know what the max page to be displayed is
        let maxPage = Math.floor(totalItems / maxOnPage);
        // Edited shop function
        async function page(user, botEmbedMessage) {
            async function createUpdatedMessage() {
                let itemNamea;
                let i = 0;
                let counter = 0;
                if (onPage < 0) {
                    onPage = maxPage;
                }
                if (onPage > maxPage) {
                    onPage = 0;
                }
                //i = item i am on
                i = onPage * maxOnPage;
                //removing execute apparently fixes await function
                items = await Shop.find({}).sort("-" + itemNamea)
                let updatedShopEmbed = new Discord.MessageEmbed()
                    .setColor(currentColor)
                    .setTitle(user.player.name + '\'s currency: ' + user.currency)
                    .setURL('https://discord.gg/CTMTtQV')
                    .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                    .setDescription('This is ze shop')
                    .setFooter(`Current page is ${onPage + 1}/${maxPage + 1}`)
                while (i < totalItems && counter < maxOnPage) {
                    itemInfo = await findItem(items[i].itemName);
                    updatedShopEmbed.addField(`Item name: ${itemInfo.emote}${items[i].itemName}`, "Item cost: " + items[i].itemCost + "<:cash_24:751784973488357457>");
                    i++;
                    counter++;
                }
                return updatedShopEmbed;
            }
            let isExpired = false;
            while (true) {
                // awaits Player interaction
                await botEmbedMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                    .then(async i => {
                        currentColor = '#0099ff';
                        playerAction = i.customId;
                        switch (playerAction) {
                            case "forward":
                                onPage++;
                                break;
                            case "back":
                                onPage--;
                                break;
                            case "delete":
                                isExpired = true;
                                return;
                        }
                        botEmbedMessage.edit({ embeds: [await createUpdatedMessage()], components: [row] });
                    })
                    .catch(async err => {
                        currentColor = '#FF0000';
                        isExpired = true;
                    });

                // Check if interaction expired
                if (isExpired) {
                    botEmbedMessage.delete();
                    return;
                }
            }
        }

        let playerAction = "nothing";
        // is edited version of the one at the bottom of battle.js
        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                //Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }
            else {
                filter = i => {
                    console.log(`isMessageOwner: ${i.user.id === message.author.id}`)
                    console.log(`user id: ${i.user.id}`)
                    console.log(`user name: ${i.user.username}`)
                    console.log(`message owner: ${message.author.id}\n`)
                    i.deferUpdate();
                    return i.user.id === message.author.id;
                };
                let itemName;
                let i = 0;
                let counter = 0;
                Shop.find({})
                    .sort("-" + itemName)
                    .exec(async function (err, items) {

                        if (onPage < 0) {
                            onPage = maxPage;
                        }
                        if (onPage > maxPage) {
                            onPage = 0;
                        }
                        i = onPage * maxOnPage;
                        const shopEmbed = new Discord.MessageEmbed()
                            .setColor(currentColor)
                            .setTitle(user.player.name + '\'s currency: ' + user.currency)
                            .setURL('https://discord.gg/CTMTtQV')
                            .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                            .setDescription('This is ze shop')
                            .setFooter(`Current page is ${onPage + 1}/${maxPage + 1}`)

                        while (i < totalItems && counter < maxOnPage) {
                            itemInfo = await findItem(items[i].itemName);
                            shopEmbed.addField(`Item name: ${itemInfo.emote}${items[i].itemName}`, "Item cost: " + items[i].itemCost + "<:cash_24:751784973488357457>");
                            i++;
                            counter++;
                        }
                        row = new Discord.MessageActionRow()
                            .addComponents(
                                new Discord.MessageButton()
                                    .setCustomId('back')
                                    .setLabel('◀️')
                                    .setStyle('PRIMARY'),
                                new Discord.MessageButton()
                                    .setCustomId('forward')
                                    .setLabel('▶️')
                                    .setStyle('PRIMARY'),
                                new Discord.MessageButton()
                                    .setCustomId('delete')
                                    .setLabel('🗑️')
                                    .setStyle('DANGER'),
                            );

                        message.channel.send({ embeds: [shopEmbed], components: [row] })
                            .then(botMessage => {
                                page(user, botMessage);
                            });
                    });
            }
        });
    }
}
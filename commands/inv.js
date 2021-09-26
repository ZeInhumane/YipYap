const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const findItem = require('../functions/findItem.js');
const findPrefix = require('../functions/findPrefix');

module.exports = {
    name: "inventory",
    description: "Wanna check what you have in your inventory? Scroll between the pages!",
    aliases: ['inv', 'itemCount', 'icbm'],
    cooldown: 5,
    category: "Fun",
    async execute(message, args) {
        User.findOne({ userID: message.author.id })
            .sort({ "inv": 1 })
            .exec(async function (err, user) {
                if (user == null) {
                    //Getting the prefix from db
                    const prefix = await findPrefix(message.guild.id);
                    message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                    return;
                }

                let name = message.member.user.tag.toString();
                // Removes tag from name
                name = name.split("#", name.length - 4)[0];

                let currentColor = '#0099ff';

                // Edited shop function
                async function page(user) {
                    async function createUpdatedMessage() {
                        let itemsOnCurrentPage = 0;
                        if (onPage < 0) {
                            onPage = maxPage;
                        }
                        if (onPage > maxPage) {
                            onPage = 0;
                        }
                        //itemCount = item itemCount am on
                        let itemCount = onPage * maxOnPage;
                        //removing execute apparently fixes await function

                        let updatedShopEmbed = new Discord.MessageEmbed()
                            .setColor(currentColor)
                            .setTitle(`${name}'s Inventory`)
                            .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                            .setDescription('This is your inventory')
                            .setFooter(`Current page is ${onPage + 1}/${maxPage + 1}`)

                        // Adds items to embed till user does not have any more items to show or it hits max page limit
                        while (itemCount < totalItems && itemsOnCurrentPage < maxOnPage) {
                            let itemName = items[itemCount][0]
                            //Checks item in db
                            itemInfo = await findItem(items[itemCount][0].split("#")[0]);
                            let itemProperty = items[itemCount][1];

                            updatedShopEmbed.addField(`Item Name: ${itemInfo.emote}${itemName}`, "Item Quantity:" + itemProperty.quantity);
                            itemCount++;
                            itemsOnCurrentPage++;
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

                let playerAction;

                // Filter so only user can interact with the buttons
                filter = i => {
                    i.deferUpdate();
                    return i.user.id === message.author.id;
                };
                let onPage = 0;
                let itemsOnCurrentPage = 0;
                // Sets how many items are displayed on a single shop page
                let maxOnPage = 10;
                // Shows max number of page, example if the there are 20 items, there would be 7 pages(Determined by maxOnPage and number of items)

                //Gets total items in inventory
                let totalItems = Object.entries(user.inv).length;
                let items = Object.entries(user.inv);
                let maxPage = Math.floor(totalItems / maxOnPage);

                let itemCount = onPage * maxOnPage;
                const shopEmbed = new Discord.MessageEmbed()
                    .setColor(currentColor)
                    .setTitle(`${name}'s Inventory`)
                    .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                    .setDescription('This is your inventory')
                    .setFooter(`Current page is ${onPage + 1}/${maxPage + 1}`)

                while (itemCount < totalItems && itemsOnCurrentPage < maxOnPage) {
                    let itemName = items[itemCount][0]
                    //Checks item in db
                    itemInfo = await findItem(items[itemCount][0].split("#")[0]);
                    let itemProperty = items[itemCount][1];

                    shopEmbed.addField(`Item Name: ${itemInfo.emote}${itemName}`, "Item Quantity:" + itemProperty.quantity);

                    itemCount++;
                    itemsOnCurrentPage++;
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
                        botEmbedMessage = botMessage;
                        page(user);
                    });
            });
    }
}
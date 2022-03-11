const Discord = require('discord.js');
const Shop = require('../../models/shopData');
const User = require('../../models/user');
const findItem = require('../../functions/findItem.js');
const findPrefix = require('../../functions/findPrefix');

module.exports = {
    name: "shop",
    description: "Shopee pee pee pee. No its just the shop.",
    syntax: "",
    cooldown: 5,
    category: "Fun",
    async execute({ message }) {
        let onPage = 0;
        let currentColor = '#0099ff';
        // Sets how many items are displayed on a single shop page
        const maxOnPage = 3;

        // Shows max number of page, example if the there are 20 items, there would be 7 pages(Determined by maxOnPage and number of items)
        const totalItems = await Shop.countDocuments({}).exec();

        // Lets shop know what the max page to be displayed is
        const maxPage = Math.floor(totalItems / maxOnPage);

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
                // i = item i am on
                i = onPage * maxOnPage;
                // removing execute apparently fixes await function
                const items = await Shop.find({}).sort("-" + itemNamea);
                const updatedShopEmbed = new Discord.MessageEmbed()
                    .setColor(currentColor)
                    .setTitle(user.player.name + '\'s currency: ' + user.currency)
                    .setURL('https://discord.gg/CTMTtQV')
                    .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                    .setDescription('This is ze shop')
                    .setFooter(`Current page is ${onPage + 1}/${maxPage + 1}`);
                while (i < totalItems && counter < maxOnPage) {
                    const itemInfo = await findItem(items[i].itemName);
                    updatedShopEmbed.addField(`Item name: ${itemInfo.emote}${items[i].itemName}`, "Item cost: " + items[i].itemCost + "<:cash_24:751784973488357457>");
                    i++;
                    counter++;
                }
                return updatedShopEmbed;
            }
            let isExpired = false;
            const filter = i => {
                i.deferUpdate();
                return i.user.id === message.author.id;
            };

            while (!isExpired) {
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
                                currentColor = '#FF0000';
                                isExpired = true;
                                return;
                        }
                        botEmbedMessage.edit({ embeds: [await createUpdatedMessage()], components: [row] });
                    })
                    .catch(async err => {
                        console.log(err);
                        currentColor = '#FF0000';
                        isExpired = true;
                    });
            }
            // Check if interaction expired
            if (isExpired) {
                botEmbedMessage.edit({ embeds: [await createUpdatedMessage()], components: [] });
                return;
            }
        }

        const row = new Discord.MessageActionRow()
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
        let playerAction = "nothing";
        // is edited version of the one at the bottom of battle.js
        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                // Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            } else {
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
                            .setFooter(`Current page is ${onPage + 1}/${maxPage + 1}`);

                        while (i < totalItems && counter < maxOnPage) {
                            const itemInfo = await findItem(items[i].itemName);
                            shopEmbed.addField(`Item name: ${itemInfo.emote}${items[i].itemName}`, "Item cost: " + items[i].itemCost + "<:cash_24:751784973488357457>");
                            i++;
                            counter++;
                        }

                        message.channel.send({ embeds: [shopEmbed], components: [row] })
                            .then(botMessage => {
                                page(user, botMessage);
                            });
                    });
            }
        });
    },
};
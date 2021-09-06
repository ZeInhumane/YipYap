const { set } = require('mongoose');

module.exports = {
    name: "shop",
    description: "It is ze shop",
    syntax: "",
    category: "Fun",
    async execute(message, args) {
        const Discord = require('discord.js');
        const Shop = require('../models/shopData');
        const User = require('../models/user');
        const findItem = require('../functions/findItem.js');
        let onPage = 0;
        let currentColor = '#0099ff';
        // Sets how many items are displayed on a single shop page
        let maxOnPage = 3;
        // Shows max number of page, example if the there are 20 items, there would be 7 pages(Determined by maxOnPage and number of items)
        let totalItems = await Shop.countDocuments({}).exec();
        // Lets shop know what the max page to be displayed is
        let maxPage = Math.floor(totalItems / maxOnPage);
        // Edited shop function
        async function page(user) {
            function playerTurn(action) {
                switch (action) {
                    case "▶️":
                        onPage++;
                        break;
                    case "◀️":
                        onPage--;
                        break;
                    default:
                        break;
                }
            }

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

            let loop = true;
            while (loop) {
                // awaits Player reaction
                await new Promise((resolve, reject) => {
                    const collector = botEmbedMessage.createReactionCollector(filter, { time: 60000 });
                    collector.on('collect', r => {
                        collector.resetTimer();
                        console.log(r.emoji.name);
                        playerAction = r.emoji.name;
                        resolve();
                    });

                    collector.on('end', async () => {
                        currentColor = '#FF0000';
                        botEmbedMessage.edit(await createUpdatedMessage());
                        loop = false;
                    });
                });
                console.log(playerAction);
                playerTurn(playerAction);
                botEmbedMessage.edit(await createUpdatedMessage());
            }
        }

        let playerAction = "nothing";
        // is edited version of the one at the bottom of battle.js
        User.findOne({ userID: message.author.id }, (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
            }
            else {
                filter = (reaction, user) => {
                    ("Check " + reaction.emoji.name);
                    if ((reaction.emoji.name === '▶️' || reaction.emoji.name === '◀️') && user == message.author.id) {
                        console.log(reaction.emoji.name + " passed");
                        return reaction;
                    }
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
                        message.channel.send(shopEmbed)
                            .then(botMessage => {
                                botEmbedMessage = botMessage;
                                botMessage.react("◀️");
                                botMessage.react("▶️");
                                page(user);
                            });
                    });
            }
        });
    }
}
const { set } = require('mongoose');

module.exports = {
    name: "shop",
    description: "It is ze shop",
    syntax: "",
    category: "Fun",
    execute(message, args) {
        const Discord = require('discord.js');
        const Shop = require('../models/shopData');
        const User = require('../models/user');
        let onPage = 0;
        let currentColor = '#0099ff';
        // Sets how many items are displayed on a single shop page
        let maxOnPage = 3;
        // Shows max number of page, example if the there are 20 items, there would be 7 pages(Determined by maxOnPage and number of items)
        let maxPage = 0;
        let totalItems = 0;
        Shop.countDocuments({}, function (err, count) {
            if (err) {
                (err);
            }
            else {
                totalItems = count;
            }
        });
        // Edited shop function
        async function page(user) {
            function currentPage(pager) {
                if (pager == 'next') {
                    onPage++;
                }
                else if (pager == 'previous') {
                    onPage--;
                }
                else {
                    messageDisplayed = "Exited shop";
                }
            }

            function playerTurn(action) {
                switch (action) {
                    case "▶️":
                        currentPage('next');
                        break;
                    case "◀️":
                        currentPage('previous');
                        break;
                    default:
                        messageDisplayed = "Exited shop";
                }
            }
            async function createUpdatedMessage() {
                let itemNamea;
                let i = 0;
                let counter = 0;
                //removing execute apparently fixes await function
                items = await Shop.find({}).sort("-" + itemNamea)
                let updatedShopEmbed = new Discord.MessageEmbed()
                    .setColor(currentColor)
                    .setTitle(user.player.name + '\'s currency: ' + user.currency)
                    .setURL('https://discord.gg/CTMTtQV')
                    .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                    .setDescription('This is ze shop')
                maxPage = Math.ceil(totalItems / maxOnPage);
                if (onPage < 0) {
                    onPage = maxPage;
                }
                if (onPage >= maxPage) {
                    onPage = 0;
                }
                //i = item i am on
                i = onPage * maxOnPage;
                while (i < totalItems && counter < maxOnPage) {
                    updatedShopEmbed.addField(`Item name: ${items[i].emote}${items[i].itemName}`, "Item cost: " + items[i].itemCost + "<:cash_24:751784973488357457>");
                    i++;
                    counter++;
                }
                return updatedShopEmbed;
            }

            while (playerAction != "❎") {
                let messageDisplayed, collectorExpireTime;
                // awaits Player reaction
                await new Promise((resolve, reject) => {
                    let timea;
                    const collector = botEmbedMessage.createReactionCollector(filter, { max: 1, time: 60000 });
                    collector.on('collect', r => {
                        collector.time = 60000;
                        timea = collector.time;
                        // Cheap fix to display battle run out time(may change)
                        clearInterval(collectorExpireTime);
                        collectorExpireTime = setInterval(function () {
                            timea -= 1000;
                        }, 1000);
                        (r.emoji.name);
                        playerAction = r.emoji.name;
                        resolve();
                    });
                    // Continued cheap fix
                    collector.on('end', () => {
                        
                        botEmbedMessage.edit(createUpdatedMessage());
                        if (timea <= 1000) {
                            currentColor = '#FF0000';
                            botEmbedMessage.edit(createUpdatedMessage());
                            message.channel.send('Upgrade expired. Your fatass took too long');
                            clearInterval(collectorExpireTime);
                        }
                    });
                });
                (playerAction);
                playerTurn(playerAction);
                botEmbedMessage.edit(await createUpdatedMessage());
                ("UPDATE MESSAGE")
            }
            messageDisplayed = "Stopped upgrading";
            currentColor = '#FF0000';
            botEmbedMessage.edit(createUpdatedMessage());
            clearInterval(collectorExpireTime);
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
                    if ((reaction.emoji.name === '▶️' || reaction.emoji.name === '◀️' || reaction.emoji.name === '❎') && user == message.author.id) {
                        (reaction.emoji.name + " passed");
                        return reaction;
                    }
                };
                const shopEmbed = new Discord.MessageEmbed()
                    .setColor(currentColor)
                    .setTitle(user.player.name + '\'s currency: ' + user.currency)
                    .setURL('https://discord.gg/CTMTtQV')
                    .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                    .setDescription('This is ze shop')
                let itemName;
                let i = 0;
                let counter = 0;
                Shop.find({})
                    .sort("-" + itemName)
                    .exec(function (err, item) {
                        ("it is entering the before the for loop 2");
                        maxPage = Math.ceil(totalItems / maxOnPage);
                        if (onPage < 0) {
                            onPage = maxPage;
                        }
                        if (onPage >= maxPage) {
                            onPage = 0;
                        }
                        i = onPage * maxOnPage;
                        while (i < totalItems && counter < maxOnPage) {
                            shopEmbed.addField(`Item name: ${item[i].emote}${item[i].itemName}`, "Item cost: " + item[i].itemCost + "<:cash_24:751784973488357457>");
                            i++;
                            counter++;
                        }
                        message.channel.send(shopEmbed)
                            .then(botMessage => {
                                botEmbedMessage = botMessage;
                                botMessage.react("◀️");
                                botMessage.react("▶️");
                                botMessage.react("❎");
                                page(user);
                            });
                    });

            }
        });

    }
}
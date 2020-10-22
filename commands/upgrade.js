module.exports = {
    name: "upgrade",
    description: "Upgrade you stats using sp (sp can be earned from battle)",
    syntax: "",
    category: "Fun",
    execute(message, args) {
        const Discord = require('discord.js');
        const User = require('../models/user');

        // Edited battle function
        async function stat(user) {
            function upgrade(stat_str) {
                user.sp--;
                user.player[stat_str]++;
                messageDisplayed = `Your ${stat_str} stat has been upgraded by 1!`;
                user.markModified('player');
                user.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
            }

            function playerTurn(action) {
                switch(action){
                    case "♥️":
                        upgrade('hp');
                        break;
                    case "⚔️":
                        upgrade('attack');
                        break;
                    case "🛡️":
                        upgrade('defense');
                        break;
                    case "🚤":
                        upgrade('speed');
                        break;
                    default:
                        messageDisplayed = "Stopped upgrading";
                }
            }

            // Updates battle embed to display ongoing input
            function createUpdatedMessage() {
                var updatedBattleEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(user.player.name + '\'s sp: ' + user.sp)
                    .setURL('https://discord.gg/CTMTtQV')
                    .setAuthor('Inhumane', 'https://vignette.wikia.nocookie.net/hunter-x-hunter-fanon/images/a/a9/BABC6A23-98EF-498E-9D0E-3EBFC7ED8626.jpeg/revision/latest?cb=20170930221652', 'https://discord.js.org')
                    .setDescription('Upgrade you character using sp earned every level up! (upgrader will be cancelled if left untouched for a few minutes)')
                    .addFields(
                        { name: ':level_slider:  ', value: user.level },
                        { name: ':hearts:  ', value: user.player.hp },
                        { name: ':crossed_swords:  ', value: user.player.attack },
                        { name: ':shield:  ', value: user.player.defense },
                        { name: ':speedboat:  ', value: user.player.speed },
                        { name: 'sp:  ', value: user.sp }

                    )
                    .addField('Update: upgrade completed', messageDisplayed)


                return updatedBattleEmbed;
            }
            while (user.sp > 0 && playerAction != "❎") {
                var messageDisplayed, collectorExpireTime;
                // awaits Player reaction
                await new Promise((resolve, reject) => {
                    var timea;
                    const collector = botEmbedMessage.createReactionCollector(filter, { max: 1, time: 60000 });
                    collector.on('collect', r => {
                        collector.time = 60000;
                        timea = collector.time;
                        // Cheap fix to display battle run out time(may change)
                        clearInterval(collectorExpireTime);
                        collectorExpireTime = setInterval(function () {
                            timea -= 1000;
                            console.log(timea);
                        }, 1000);
                        console.log(r.emoji.name);
                        playerAction = r.emoji.name;
                        resolve();
                    });
                    // Continued cheap fix
                    collector.on('end', () => {
                        console.log("Collecter Ended: " + timea);
                        if (timea <= 1000) {
                            message.channel.send('Upgrade expired. Your fatass took too long');
                            clearInterval(collectorExpireTime);
                        }
                    });
                });
                console.log("START STAT CHANGE");
                console.log(playerAction);
                playerTurn(playerAction);

                botEmbedMessage.edit(createUpdatedMessage());
            }
            messageDisplayed = "Stopped upgrading";
            botEmbedMessage.edit(createUpdatedMessage());
            clearInterval(collectorExpireTime);
        }

        var playerAction = "nothing";
        // is edited version of the one at the bottom of battle.js
        User.findOne({ userID: message.author.id }, (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
            }
            else {
                console.log(message.author.id);
                console.log(user.player.name);
                filter = (reaction, user) => {
                    console.log("Check " + reaction.emoji.name);
                    if ((reaction.emoji.name === '♥️' || reaction.emoji.name === '⚔️' || reaction.emoji.name === '🛡️' || reaction.emoji.name === '❎' || reaction.emoji.name === '🚤') && user == message.author.id) {
                        console.log(reaction.emoji.name + " passed");
                        return reaction;
                    }
                };

                //For users who were created before sp was created
                if (user.sp == null) {
                    user.sp = (user.level - 1) * 5;
                }

                // Makes battle embed probably need to add more things like speed
                const spEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(user.player.name + '\'s sp: ' + user.sp)
                    .setURL('https://discord.gg/CTMTtQV')
                    .setAuthor('Inhumane', 'https://vignette.wikia.nocookie.net/hunter-x-hunter-fanon/images/a/a9/BABC6A23-98EF-498E-9D0E-3EBFC7ED8626.jpeg/revision/latest?cb=20170930221652', 'https://discord.js.org')
                    .setDescription('Upgrade you character using sp earned every level up!')
                    .addField(":level_slider:  " + user.level, "​")
                    .addField(":hearts:  " + user.player.hp, "​")
                    .addField(":crossed_swords:  " + user.player.attack, "​")
                    .addField(":shield:  " + user.player.defense, "​")
                    .addField(":speedboat:  " + user.player.speed, "​")
                    .addField('sp: ' + user.sp, "​")

                message.channel.send(spEmbed)
                    .then(botMessage => {
                        botEmbedMessage = botMessage;
                        botMessage.react("♥️");
                        botMessage.react("⚔️");
                        botMessage.react("🛡️");
                        botMessage.react("🚤");
                        botMessage.react("❎");
                        stat(user);
                    });
            }
        });

    }
}
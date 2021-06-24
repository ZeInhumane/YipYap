module.exports = {
    name: "upgrade",
    description: "Upgrade you stats using sp (sp can be earned from battle)",
    syntax: "",
    category: "Fun",
    execute(message, args) {
        const Discord = require('discord.js');
        const User = require('../models/user');
        let currentColor = "#0099ff";
        // Edited upgrade function
        async function stat(user) {

            function multiplier(playeraction){
                switch(playeraction){
                    case 'up':
                        if(multi < 5){
                            multi += 1
                            messageDisplayed = 'Multiplier increased by 1'
                        }
                        else{
                            messageDisplayed = 'Multiplier cannot exceed 5'
                        }
                        break;
                    case 'down':
                        if(multi > 1){
                            multi -= 1
                            messageDisplayed = 'Multiplier decreased by 1'
                        }
                        else{
                            messageDisplayed = 'Multiplier cannot go below 1'
                        }
                }

            }

            function upgrade(stat_str) {
                if(user.sp >= multi){
                    user.sp-= multi;
                if (stat_str == 'hp'){
                    user.player[stat_str] += 5*multi;
                    messageDisplayed = `Your ${stat_str} stat has been upgraded by ${5*multi}!`;
                }else{
                    user.player[stat_str]+= multi;
                    messageDisplayed = `Your ${stat_str} stat has been upgraded by ${multi}!`;
                }
                user.markModified('player');
                user.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
                }
                else{
                    messageDisplayed = 'Not enough sp to upgrade.'
                }
            }

            function playerTurn(action) {
                switch(action){
                    case "⬆️":
                        multiplier('up');
                        break;
                    case "⬇️":
                        multiplier('down');
                        break;
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
                // theres a difference here check later for something
                let updatedBattleEmbed = new Discord.MessageEmbed()
                    .setColor(currentColor)
                    .setTitle(user.player.name + '\'s sp: ' + user.sp)
                    .setURL('https://discord.gg/CTMTtQV')
                    .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                    .setDescription('Upgrade you character using sp earned every level up! (upgrader will be cancelled if left untouched for a few minutes)')
                    .addFields(
                        { name: `:level_slider: ${user.level}`, value: "\u200b"},
                        { name: `:hearts: ${user.player.hp}`, value: `(+${5*multi})` , inline: true},
                        { name: `:crossed_swords: ${user.player.attack}`, value: `(+${multi})` , inline: true},
                        { name: `:shield: ${user.player.defense}`, value: `(+${multi})` , inline: true},
                        { name: `:dash: ${user.player.speed}`, value: `(+${multi})` , inline: true},
                        { name: `sp: ${user.sp}`, value: `${multi} used per upgrade`}
                    )
                    .addField('Update: ', messageDisplayed)


                return updatedBattleEmbed;
            }
            while (user.sp > 0 && playerAction != "❎") {
                let collectorExpireTime;
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
                        playerAction = r.emoji.name;
                        resolve();
                    });
                    // Continued cheap fix
                    collector.on('end', () => {
                        if (timea <= 1000) {
                            message.channel.send('Upgrade expired. Your fatass took too long');
                            clearInterval(collectorExpireTime);
                        }
                    });
                });
                playerTurn(playerAction);

                botEmbedMessage.edit(createUpdatedMessage());
            }
            messageDisplayed = "Stopped upgrading";
            currentColor = '#FF0000';
            botEmbedMessage.edit(createUpdatedMessage());
            clearInterval(collectorExpireTime);
        }

        let playerAction = "nothing";
        let multi = 1;
        let messageDisplayed;
        // is edited version of the one at the bottom of battle.js
        User.findOne({ userID: message.author.id }, (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
            }
            else {
                filter = (reaction, user) => {
                    if ((reaction.emoji.name === '⬆️' || reaction.emoji.name === '⬇️' || reaction.emoji.name === '♥️' || reaction.emoji.name === '⚔️' || reaction.emoji.name === '🛡️' || reaction.emoji.name === '❎' || reaction.emoji.name === '🚤') && user == message.author.id) {
                        return reaction;
                    }
                };

                //For users who were created before sp was created
                if (user.sp == null) {
                    user.sp = (user.level - 1) * 5;
                }
                

                // Makes battle embed probably need to add more things like speed
                const spEmbed = new Discord.MessageEmbed()
                    .setColor(currentColor)
                    .setTitle(user.player.name + '\'s sp: ' + user.sp)
                    .setURL('https://discord.gg/CTMTtQV')
                    .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                    .setDescription('Upgrade you character using sp earned every level up!')
                    .addFields(
                        { name: `:level_slider: ${user.level}`, value: "\u200b"},
                        { name: `:hearts: ${user.player.hp}`, value: "(+5)" , inline: true},
                        { name: `:crossed_swords: ${user.player.attack}`, value: "(+1)" , inline: true},
                        { name: `:shield: ${user.player.defense}`, value: "(+1)" , inline: true},
                        { name: `:dash: ${user.player.speed}`, value: "(+1)" , inline: true},
                        { name: `sp: ${user.sp}`, value: `${multi} used per upgrade`}
                    )

                message.channel.send(spEmbed)
                    .then(botMessage => {
                        botEmbedMessage = botMessage;
                        botMessage.react("⬆️");
                        botMessage.react("⬇️");
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
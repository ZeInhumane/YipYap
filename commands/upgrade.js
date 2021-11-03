const Discord = require('discord.js');
const User = require('../models/user');
const findPrefix = require('../functions/findPrefix');

module.exports = {
    name: "upgrade",
    description: "Upgrade your stats using special points. Special Points are earned through leveling.",
    syntax: "",
    category: "Fun",
    execute(message, args) {
        let currentColor = "#0099ff";
        const row1 = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('hp')
                    .setLabel('❤️')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('attack')
                    .setLabel('⚔️')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('defense')
                    .setLabel('🛡️')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('speed')
                    .setLabel('💨')
                    .setStyle('PRIMARY'),
            );

        const row2 = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('up')
                    .setLabel('⬆️')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('down')
                    .setLabel('⬇️')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('stop')
                    .setLabel('✖️')
                    .setStyle('DANGER'),
            );
        // Edited upgrade function
        async function stat(user, botEmbedMessage) {
            function multiplier(playeraction) {
                switch (playeraction) {
                    case 'up':
                        if (multi < 5) {
                            multi += 1
                            messageDisplayed = 'Multiplier increased by 1'
                        }
                        else {
                            messageDisplayed = 'Multiplier cannot exceed 5'
                        }
                        break;
                    case 'down':
                        if (multi > 1) {
                            multi -= 1
                            messageDisplayed = 'Multiplier decreased by 1'
                        }
                        else {
                            messageDisplayed = 'Multiplier cannot go below 1'
                        }
                }
            }

            function upgrade(stat_str) {
                if (user.sp >= multi) {
                    user.sp -= multi;
                    if (stat_str == 'hp') {
                        user.player.baseStats[stat_str] += 5 * multi;
                        messageDisplayed = `Your ${stat_str} stat has been upgraded by ${5 * multi}!`;
                    } else {
                        user.player.baseStats[stat_str] += multi;
                        messageDisplayed = `Your ${stat_str} stat has been upgraded by ${multi}!`;
                    }
                    user.markModified('player');
                    user.save()
                        .then(result => console.log("upgrade"))
                        .catch(err => console.error(err));
                }
                else {
                    messageDisplayed = 'Not enough sp to upgrade.'
                }
            }

            function playerTurn(action) {
                switch (action) {
                    case "up":
                        multiplier('up');
                        break;
                    case "down":
                        multiplier('down');
                        break;
                    case "hp":
                        upgrade('hp');
                        break;
                    case "attack":
                        upgrade('attack');
                        break;
                    case "defense":
                        upgrade('defense');
                        break;
                    case "speed":
                        upgrade('speed');
                        break;
                    default:
                        messageDisplayed = "Stopped upgrading";
                }
            }

            // Updates battle embed to display ongoing input
            async function createUpdatedMessage() {
                // theres a difference here check later for something
                let updatedBattleEmbed = new Discord.MessageEmbed()
                    .setColor(currentColor)
                    .setTitle(user.player.name + '\'s sp: ' + user.sp)
                    .setURL('https://discord.gg/CTMTtQV')
                    .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                    .setDescription('Upgrade your character using sp earned every level up!')
                    .addFields(
                        { name: `:level_slider: ${user.level}`, value: "\u200b" },
                        { name: `Base stats`, value: "\u200b" },
                        { name: `:hearts: ${user.player.baseStats.hp}`, value: `(+${5 * multi})`, inline: true },
                        { name: `:crossed_swords: ${user.player.baseStats.attack}`, value: `(+${1 * multi})`, inline: true },
                        { name: `:shield: ${user.player.baseStats.defense}`, value: `(+${1 * multi})`, inline: true },
                        { name: `:dash: ${user.player.baseStats.speed}`, value: `(+${1 * multi})`, inline: true },
                        { name: `sp: ${user.sp}`, value: `${multi} used per upgrade` }
                    )
                    .addField('Update: ', messageDisplayed)


                return updatedBattleEmbed;
            }
            // Filter so only user can interact with the buttons
            const filter = i => {
                i.deferUpdate();
                return i.user.id === message.author.id;
            };
            while (user.sp > 0 && playerAction != "stop") {
                // awaits Player reaction
                await botEmbedMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                    .then(async i => {
                        currentColor = '#0099ff';
                        playerAction = i.customId;
                        playerTurn(playerAction);
                        botEmbedMessage.edit({ embeds: [await createUpdatedMessage()], components: [row1, row2] });
                    })
                    .catch(async err => {
                        currentColor = '#FF0000';
                        messageDisplayed = "Upgrade expired";
                        botEmbedMessage.edit({ embeds: [await createUpdatedMessage()], components: [] });
                        isExpired = true;
                    });
            }
            messageDisplayed = "Stopped upgrading";
            currentColor = '#FF0000';
            botEmbedMessage.edit({ embeds: [await createUpdatedMessage()], components: [] });
        }

        let multi = 1;
        let messageDisplayed, filter, playerAction;
        // is edited version of the one at the bottom of battle.js
        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                //Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }


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
                .setDescription('Upgrade your character using sp earned every level up!')
                .addFields(
                    { name: `:level_slider: ${user.level}`, value: "\u200b" },
                    { name: `Base stats`, value: "\u200b" },
                    { name: `:hearts: ${user.player.baseStats.hp}`, value: "(+5)", inline: true },
                    { name: `:crossed_swords: ${user.player.baseStats.attack}`, value: "(+1)", inline: true },
                    { name: `:shield: ${user.player.baseStats.defense}`, value: "(+1)", inline: true },
                    { name: `:dash: ${user.player.baseStats.speed}`, value: "(+1)", inline: true },
                    { name: `sp: ${user.sp}`, value: `${multi} used per upgrade` }
                )

            message.channel.send({ embeds: [spEmbed], components: [row1, row2] })
                .then(botMessage => {
                    stat(user, botMessage);
                });
        });
    }
}
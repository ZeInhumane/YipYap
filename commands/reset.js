const Discord = require('discord.js');
const User = require('../models/user');
const findPrefix = require('../functions/findPrefix');

module.exports = {
    name: "reset",
    description: "Resets your stats. Special Points will be credited.",
    syntax: "",
    aliases: ['r', 'resetsp'],
    category: "Fun",
    execute(message) {
        let currentColor = "#0099ff";
        const row1 = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('confirm')
                    .setLabel('Confirm')
                    .setEmoji('✔️')
                    .setStyle('SUCCESS'),
                new Discord.MessageButton()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setEmoji('❌')
                    .setStyle('DANGER'),
            );

        // Filter so only user can interact with the buttons
        const filter = (btnInt) => {
            btnInt.deferUpdate();
            return btnInt.user.id === message.author.id;
        };

        let userSelection, messageDisplayed;
        // Reset prompt
        async function reset(user, botEmbedMessage, sp) {
            while (userSelection != "cancel") {
                // awaits button interaction
                await botEmbedMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                    .then(async btnInt => {
                        currentColor = '#0099ff';
                        userSelection = btnInt.customId;
                        // parse button pressed
                        parse(userSelection);
                    })
                    .catch(async () => {
                        currentColor = '#FF0000';
                        botEmbedMessage.edit({ embeds: [await createUpdatedMessage(botEmbedMessage)], components: [] });
                    });
            }

            async function parse(action) {
                switch (action) {
                    case "confirm":
                        // Deactivates buttons and displays confirmation message
                        messageDisplayed = 'Awaiting confirmation...';
                        botEmbedMessage.edit({ embeds: [await createUpdatedMessage(botEmbedMessage)], components: [] });
                        await confirm(user, botEmbedMessage, sp);
                        break;
                    case "cancel":
                        messageDisplayed = "Stats were not reset";
                        currentColor = '#FF0000';
                        botEmbedMessage.edit({ embeds: [await createUpdatedMessage(botEmbedMessage)], components: [] });
                        break;
                }
            }
        }

        // Updates embed message
        async function createUpdatedMessage(embedMessage) {
            const receivedEmbed = embedMessage.embeds[0];
            const updatedBattleEmbed = new Discord.MessageEmbed(receivedEmbed)
                .setColor(currentColor)
                .addField('Update: ', messageDisplayed);
            return updatedBattleEmbed;
        }

        async function confirm(user, botEmbedMessage, sp) {
            // Creates confirmation message
            const confirmationEmbed = new Discord.MessageEmbed()
                .setColor(currentColor)
                .setTitle('Are you sure you would like to proceed?')
                .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                .setDescription('This will reset your stats and give you special points.')
                .setFooter('Note: This action is irreversible.');

            const confirmation = await botEmbedMessage.reply({ embeds: [confirmationEmbed], components: [row1], ephemeral: true });

            await confirmation.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                .then(async btnInt => {
                    currentColor = '#0099ff';
                    userSelection = btnInt.customId;
                    if (userSelection == 'confirm') {
                        user.player.baseStats.hp = 50;
                        user.player.baseStats.attack = 5;
                        user.player.baseStats.defense = 5;
                        user.player.baseStats.speed = 5;
                        user.sp += sp;
                        user.markModified('player');
                        user.save()
                            .then(() => console.log("reset"))
                            .catch(err => console.error(err));
                        messageDisplayed = "Stats were reset";
                        const successEmbed = new Discord.MessageEmbed(botEmbedMessage.embeds[0])
                            .setColor('#77DD66')
                            .setTitle('Stats were reset!')
                            .setDescription(`Your stats have been reset and you have been credited with ${sp} special points.`)
                            .setFooter('Spend your special points with the upgrade command!');
                        successEmbed.fields = [];
                        await confirmation.delete();
                        await botEmbedMessage.edit({ embeds: [successEmbed], components: [] });
                    }
                    else {
                        await confirmation.delete();
                        const retryEmbed = await createUpdatedMessage(botEmbedMessage);
                        retryEmbed.fields.pop();
                        await botEmbedMessage.edit({ embeds: [retryEmbed], components: [row1] });
                    }
                })
                .catch(async () => {
                    currentColor = '#FF0000';
                    messageDisplayed = "Confirmation expired";
                    confirmationEmbed.color = currentColor;
                    await confirmation.edit({ embeds: [confirmationEmbed], components: [] });
                });
        }

        // is edited version of the one at the bottom of battle.js
        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                // Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }

            // For users who were created before sp was created
            if (user.sp == null) {
                user.sp = (user.level - 1) * 5;
            }

            // SP to be gained from reset
            const hpSp = (user.player.baseStats.hp - 50) / 5;
            const attackSp = user.player.baseStats.attack - 5;
            const defenseSp = user.player.baseStats.defense - 5;
            const speedSp = user.player.baseStats.speed - 5;
            const spGain = hpSp + attackSp + defenseSp + speedSp;

            if (spGain == 0) {
                message.channel.send(`You do not have any sp to reset!`);
                return;
            }

            // Make reset sp embed
            const spEmbed = new Discord.MessageEmbed()
                .setColor(currentColor)
                .setTitle('Reset your stats?')
                .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                .setDescription('Current stats')
                .addFields(
                    { name: `:level_slider: ${user.level}`, value: "\u200b" },
                    { name: `Current stats`, value: "\u200b" },
                    { name: `:hearts: ${user.player.baseStats.hp}`, value: `${hpSp}`, inline: true },
                    { name: `:crossed_swords: ${user.player.baseStats.attack}`, value: `${attackSp}`, inline: true },
                    { name: `:shield: ${user.player.baseStats.defense}`, value: `${defenseSp}`, inline: true },
                    { name: `:dash: ${user.player.baseStats.speed}`, value: `${speedSp}`, inline: true },
                )
                .setFooter(`SP to be gained: ${spGain}`);

            message.channel.send({ embeds: [spEmbed], components: [row1] })
                .then(botMessage => {
                    reset(user, botMessage, spGain);
                });
        });
    },
};
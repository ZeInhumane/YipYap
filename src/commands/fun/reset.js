const Discord = require('discord.js');
const User = require('../../models/user');
const findPrefix = require('../../functions/findPrefix');

module.exports = {
    name: "reset",
    description: "Resets your stats. Special Points will be credited.",
    syntax: "",
    aliases: ['r', 'resetsp'],
    category: "Fun",
    execute({ message }) {
        let currentColor = "#0099ff";
        // Buttons
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
                // Awaits interaction
                await botEmbedMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                    .then(async btnInt => {
                        currentColor = '#0099ff';
                        userSelection = btnInt.customId;
                        // Parse button pressed
                        parse(userSelection);
                        botEmbedMessage.edit({ embeds: [await createUpdatedMessage(botEmbedMessage)], components: [] });
                    })
                    .catch(async (error) => {
                        currentColor = '#FF0000';
                        // If message was deleted, ignore
                        if (error.code == 'INTERACTION_COLLECTOR_ERROR') {
                            userSelection = "cancel";
                            return;
                        }
                        botEmbedMessage.edit({ embeds: [await createUpdatedMessage(botEmbedMessage)], components: [] });
                    });
            }

            // Parse button pressed
            async function parse(action) {
                switch (action) {
                    case "confirm":
                        // Deactivates buttons and displays confirmation message
                        messageDisplayed = 'Awaiting confirmation...';
                        await confirm(user, botEmbedMessage, sp);
                        break;
                    case "cancel":
                        // Cancel message
                        messageDisplayed = "Stats were not reset";
                        currentColor = '#FF0000';
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

        // Confirm reset
        async function confirm(user, botEmbedMessage, sp) {
            // Creates confirmation message
            const confirmationEmbed = new Discord.MessageEmbed()
                .setColor(currentColor)
                .setTitle('Are you sure you would like to proceed?')
                .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                .setDescription('This will reset your stats and give you special points.')
                .setFooter('Note: This action is irreversible.');

            const confirmation = await botEmbedMessage.reply({ embeds: [confirmationEmbed], components: [row1], ephemeral: true });

            // Confirmation interaction collector
            await confirmation.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                .then(async btnInt => {
                    currentColor = '#0099ff';
                    userSelection = btnInt.customId;
                    // If user selected confirm, reset stats, give sp
                    if (userSelection == 'confirm') {
                        // Reset stats
                        user.player.baseStats = { hp: 50, attack: 5, defense: 5, speed: 5 };
                        // Add sp
                        user.sp += sp;
                        // Log
                        user.markModified('player');
                        user.save()
                            .then(() => console.log("reset"))
                            .catch(err => console.error(err));
                        // Send success embed
                        const successEmbed = new Discord.MessageEmbed(botEmbedMessage.embeds[0])
                            .setColor('#77DD66')
                            .setTitle('Stats were reset!')
                            .setDescription(`Your stats have been reset and you have been credited with ${sp} special points.`)
                            .setFooter('Spend your special points with the upgrade command!');
                        successEmbed.fields = [];
                        try {
                            // Delete confirmation message to prevent multiple inputs
                            await confirmation.delete();
                            // Edit original message and remove buttons
                            await botEmbedMessage.edit({ embeds: [successEmbed], components: [] });
                        } catch (error) {
                            // If either message was deleted, send success embed anyway since stats have been reset
                            if (error.code == Discord.Constants.APIErrors.UNKNOWN_MESSAGE) {
                                await message.channel.send({ embeds: [successEmbed], components: [] });
                            }
                        }
                        // If user selected cancel, send error embed
                    } else {
                        try {
                            // Delete confirmation message
                            await confirmation.delete();
                            // Remove awaiting confirmation field from original message
                            const retryEmbed = await createUpdatedMessage(botEmbedMessage);
                            retryEmbed.fields.pop();
                            // Re-add buttons to original message
                            await botEmbedMessage.edit({ embeds: [retryEmbed], components: [row1] });
                        } catch (error) {
                            // If original message was deleted
                            if (error.code == Discord.Constants.APIErrors.UNKNOWN_MESSAGE) {
                                const failureEmbed = new Discord.MessageEmbed(botEmbedMessage.embeds[0])
                                    .setColor('#FF0000')
                                    .setTitle('Stats were not reset!')
                                    .setDescription(`Your stats have not been reset.`)
                                    .setFooter('Reset your special points with the reset command!');
                                failureEmbed.fields = [];
                                await message.channel.send({ embeds: [failureEmbed], components: [] });
                            }
                        }
                    }
                })
                .catch(async (error) => {
                    // If confirmation message was deleted without any inputs, add buttons back to original message
                    if (error.code == 'INTERACTION_COLLECTOR_ERROR') {
                        try {
                            // Create retry embed
                            const retryEmbed = await createUpdatedMessage(botEmbedMessage);
                            retryEmbed.fields.pop();
                            // Send message along with buttons
                            await botEmbedMessage.edit({ embeds: [retryEmbed], components: [row1] });
                        } catch (err) {
                            // If original message was deleted too, return
                            if (error.code == Discord.Constants.APIErrors.UNKNOWN_MESSAGE) {
                                return;
                            }
                        }
                        return;
                    }
                    // If message timed out
                    currentColor = '#FF0000';
                    messageDisplayed = "Confirmation expired";
                    confirmationEmbed.color = currentColor;
                    await confirmation.edit({ embeds: [confirmationEmbed], components: [] });
                });
        }

        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                // Get the prefix from db
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
            // SP to be gained from reset (loops through remainder values, yes I am aware this was a complete was of time future matthew)
            const spGain = Object.values(user.player.baseStats).slice(1).reduce((total, n) => total + n - 5, 0) + hpSp;

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
                    { name: `Current Level :level_slider: ${user.level}`, value: "\u200b" },
                    { name: `Current Statistics for player`, value: "\u200b" },
                    { name: `Current Health (:hearts:): ${user.player.baseStats.hp}`, value: `Assigned SP: ${hpSp}`, inline: true },
                    { name: `Current Attack (:crossed_swords:): ${user.player.baseStats.attack}`, value: `Assigned SP: ${user.player.baseStats.attack - 5}`, inline: true },
                    { name: `Current Defense (:shield:): ${user.player.baseStats.defense}`, value: `Assigned SP: ${user.player.baseStats.defense - 5}`, inline: true },
                    { name: `Current Speed (:dash:): ${user.player.baseStats.speed}`, value: `Assigned SP: ${user.player.baseStats.speed - 5}`, inline: true },
                )
                .setFooter(`SP to be gained: ${spGain}`);

            message.channel.send({ embeds: [spEmbed], components: [row1] })
                .then(botMessage => {
                    reset(user, botMessage, spGain);
                });
        });
    },
};
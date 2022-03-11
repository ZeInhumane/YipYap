const Discord = require('discord.js');
const User = require('../../models/user');
const findPrefix = require('../../functions/findPrefix');

module.exports = {
    name: "upgrade",
    description: "Upgrade your stats using special points. Special Points are earned through leveling.",
    syntax: "",
    aliases: ['u'],
    category: "Fun",
    execute({ message }) {
        let currentColor = "#0099ff";
        let multi = 1;
        let spSpent = 0;
        // Buttons
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
        const row3 = new Discord.MessageActionRow()
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
        const filter = i => {
            i.deferUpdate();
            return i.user.id === message.author.id;
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
                        botEmbedMessage.edit({ embeds: [await createUpdatedMessage(user)], components: [row1, row2] });
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
                    case "confirm":
                        // Deactivates buttons and displays confirmation message
                        messageDisplayed = 'Awaiting confirmation...';
                        await confirm(user, botEmbedMessage, sp);
                        break;
                    case "cancel":
                        // Cancel message
                        messageDisplayed = "Upgrade did not pass validation. Cancelling...";
                        currentColor = '#FF0000';
                        break;
                }
            }
            async function multiplier(playeraction) {
                switch (playeraction) {
                    case 'up':
                        if (multi < 5) {
                            multi += 1;
                            messageDisplayed = 'Multiplier increased by 1';
                        } else {
                            messageDisplayed = 'Multiplier cannot exceed 5';
                        }
                        break;
                    case 'down':
                        if (multi > 1) {
                            multi -= 1;
                            messageDisplayed = 'Multiplier decreased by 1';
                        } else {
                            messageDisplayed = 'Multiplier cannot go below 1';
                        }
                }
            }

            async function upgrade(stat_str) {
                if (user.sp >= multi) {
                    user.sp -= multi;
                    spSpent += multi;
                    if (stat_str == 'hp') {
                        user.player.baseStats[stat_str] += 5 * multi;
                        messageDisplayed = `Your ${stat_str} stat has been upgraded by ${5 * multi}!`;
                    } else {
                        user.player.baseStats[stat_str] += multi;
                        messageDisplayed = `Your ${stat_str} stat has been upgraded by ${multi}!`;
                    }
                } else {
                    messageDisplayed = 'Not enough sp to upgrade.';
                }
            }

        }
        async function createUpdatedMessage(user) {
            // theres a difference here check later for something
            const updatedBattleEmbed = new Discord.MessageEmbed()
                .setColor(currentColor)
                .setTitle(user.player.name + '\'s sp: ' + user.sp)
                .setURL('https://discord.gg/CTMTtQV')
                .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                .setDescription('Upgrade your character using sp earned every level up!')
                .addFields(
                    { name: `:level_slider: ${user.level}`, value: "\u200b" },
                    { name: `Current Statistics for player`, value: "\u200b" },
                    { name: `Current Health (:hearts:): ${user.player.baseStats.hp}`, value: `(+${5 * multi})`, inline: true },
                    { name: `Current Attack (:crossed_swords:): ${user.player.baseStats.attack}`, value: `(+${1 * multi})`, inline: true },
                    { name: `Current Defense (:shield:): ${user.player.baseStats.defense}`, value: `(+${1 * multi})`, inline: true },
                    { name: `Current Speed (:dash:): ${user.player.baseStats.speed}`, value: `(+${1 * multi})`, inline: true },
                    { name: `sp: ${user.sp}`, value: `${multi} used per upgrade` },
                )
                .addField('Update: ', messageDisplayed)
                .setFooter(`Spent SP : ${spSpent}`);

            return updatedBattleEmbed;
        }

        // Confirm reset
        async function confirm(user, botEmbedMessage) {
            // Creates confirmation message
            const confirmationEmbed = new Discord.MessageEmbed()
                .setColor(currentColor)
                .setTitle('Are you sure you would like to proceed?')
                .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                .setDescription('This will use up your sp.')
                .setFooter('Note: This action is irreversible (actually it is but :D).');

            const confirmation = await botEmbedMessage.reply({ embeds: [confirmationEmbed], components: [row3], ephemeral: true });

            // Confirmation interaction collector
            await confirmation.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                .then(async btnInt => {
                    currentColor = '#0099ff';
                    userSelection = btnInt.customId;
                    // If user selected confirm, reset stats, give sp
                    if (userSelection == 'confirm') {
                        user.markModified('player');
                        user.save()
                            .then(() => console.log("reset"))
                            .catch(err => console.error(err));
                        // Send success embed
                        const successEmbed = new Discord.MessageEmbed(botEmbedMessage.embeds[0])
                            .setColor('#77DD66')
                            .setTitle('Successfully upgraded!')
                            .setDescription(`You have successfully assigned your Special Points`)
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
                            await botEmbedMessage.edit({ embeds: [retryEmbed], components: [row1, row2] });
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
                            await botEmbedMessage.edit({ embeds: [retryEmbed], components: [row1, row2] });
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

            // SP to be gained from reset
            const hpSp = (user.player.baseStats.hp - 50) / 5;
            const attackSp = user.player.baseStats.attack - 5;
            const defenseSp = user.player.baseStats.defense - 5;
            const speedSp = user.player.baseStats.speed - 5;
            const spGain = hpSp + attackSp + defenseSp + speedSp;

            // Make reset sp embed
            const spEmbed = new Discord.MessageEmbed()
                .setColor(currentColor)
                .setTitle('Upgrade your stats!')
                .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                .setDescription('Upgrade your character using sp earned every level up!')
                .addFields(
                    { name: `Current Level :level_slider: ${user.level}`, value: "\u200b" },
                    { name: `Current Statistics for player`, value: "\u200b" },
                    { name: `Current Health (:hearts:): ${user.player.baseStats.hp}`, value: `Assigned SP: ${hpSp}`, inline: true },
                    { name: `Current Attack (:crossed_swords:): ${user.player.baseStats.attack}`, value: `Assigned SP: ${attackSp}`, inline: true },
                    { name: `Current Defense (:shield:): ${user.player.baseStats.defense}`, value: `Assigned SP: ${defenseSp}`, inline: true },
                    { name: `Current Speed (:dash:): ${user.player.baseStats.speed}`, value: `Assigned SP: ${speedSp}`, inline: true },
                )
                .setFooter(`Spent SP : ${spSpent}`);

            message.channel.send({ embeds: [spEmbed], components: [row1, row2] })
                .then(botMessage => {
                    reset(user, botMessage, spGain);
                });
        });
    },
};
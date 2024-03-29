// Import clan util
const clanUtil = require('./utils/clanUtil.js');
const Clan = require('../../models/clan');
const User = require('../../models/user');
const Discord = require('discord.js');
const giveClanID = require('../../functions/giveClanID');
const clan = require('../../models/clan');
module.exports = {
    name: 'clan',
    aliases: [''],
    category: "fun",
    description: "Anything related to clans",
    syntax: "help __for additonal help__",
    async execute({ client, prefix, args, message, user }) {
        const costToCreateClan = 10000;
        const levelToCreateClan = 10;
        const clanName = args[1];
        let originalSP = 0;
        let multi = 1;
        let spSpent = 0;
        let currentColor = "#ffccff";
        let updatedClanData;
        // Buttons
        const row1 = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('hp')
                    .setLabel('❤️ Hp')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('attack')
                    .setLabel('⚔️ Att')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('defense')
                    .setLabel('🛡️ Def')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('speed')
                    .setLabel('💨 Spd')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('gold')
                    .setLabel('Gold')
                    .setEmoji('<:x2Gold_Ticket1hr:898287203246047252>')
                    .setStyle('PRIMARY'),
            );

        const row2 = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('exp')
                    .setLabel('Exp')
                    .setEmoji('<:x2ExpTicket1hr:898287128159592488>')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('up')
                    .setLabel('⬆️ Up')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('down')
                    .setLabel('⬇️ Down')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('confirm')
                    .setLabel('Confirm')
                    .setEmoji('✅')
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
        const filter = (btnInt) => {
            btnInt.deferUpdate();
            return btnInt.user.id === message.author.id;
        };

        let userSelection, messageDisplayed;
        // Create Clan
        // Clan prompt
        async function clanCreation(botEmbedMessage) {
            while (userSelection != "cancel") {
                // Awaits interaction
                await botEmbedMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                    .then(async btnInt => {
                        currentColor = '#0099ff';
                        userSelection = btnInt.customId;
                        // Parse button pressed
                        parseClanCreation(userSelection);
                        botEmbedMessage.edit({ embeds: [await updateClanCreation(botEmbedMessage)], components: [] });
                    })
                    .catch(async (error) => {
                        currentColor = '#FF0000';
                        // If message was deleted, ignore
                        if (error.code == 'INTERACTION_COLLECTOR_ERROR') {
                            userSelection = "cancel";
                            return;
                        }
                        botEmbedMessage.edit({ embeds: [await updateClanCreation(botEmbedMessage)], components: [] });
                    });
            }

            // Parse button pressed
            async function parseClanCreation(action) {
                switch (action) {
                    case "confirm":
                        // Deactivates buttons and displays confirmation message
                        messageDisplayed = 'Awaiting confirmation...';
                        await confirmClanCreation(botEmbedMessage);
                        break;
                    case "cancel":
                        // Cancel message
                        messageDisplayed = "Clan was not created";
                        currentColor = '#FF0000';
                        break;
                }
            }
        }

        // Updates embed message
        async function updateClanCreation(embedMessage) {
            const receivedEmbed = embedMessage.embeds[0];
            const updatedBattleEmbed = new Discord.MessageEmbed(receivedEmbed)
                .setColor(currentColor)
                .setFooter({ text: `Update: ${messageDisplayed}` });
            return updatedBattleEmbed;
        }

        // Confirm clan creation
        async function confirmClanCreation(botEmbedMessage) {
            // Creates confirmation message
            const confirmationEmbed = new Discord.MessageEmbed()
                .setColor(currentColor)
                .setTitle('Are you sure you would like to proceed?')
                .setAuthor({ name: message.member.user.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setDescription(`Are you sure you would like to create a clan called ${clanName}?`)
                .setFooter({ text: 'Note: This action is irreversible.' });

            const confirmation = await botEmbedMessage.reply({ embeds: [confirmationEmbed], components: [row3], ephemeral: true });

            // Confirmation interaction collector
            await confirmation.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                .then(async btnInt => {
                    currentColor = '#0099ff';
                    userSelection = btnInt.customId;
                    // If user confirms, create clan
                    if (userSelection == 'confirm') {
                        // Get Clan ID from giveClanID.js
                        const clanID = await giveClanID();
                        // Create clan
                        const createClan = await Clan.insertMany({
                            clanID: clanID,
                            clanName: clanName,
                            clanDescription: "Poggers",
                            clanLeader: user.userID,
                            clanViceLeader: null,
                            clanMembers: [user.userID],
                            clanInvite: [],
                            clanBan: [],
                            clanTotalExp: 0,
                            clanCurrentExp: 0,
                            clanMaxMembers: 20,
                            stats: {
                                gold: 1,
                                exp: 1,
                                hp: 1,
                                attack: 1,
                                defense: 1,
                                speed: 1,
                            },
                            clanLevel: 1,
                            contribution: {},
                            sp: 0,
                        });
                        if (createClan) {
                            user.currency -= costToCreateClan;
                            user.clanID = clanID;
                            // Log
                            user.markModified('player');
                            user.save()
                                .then(() => console.log("reset"))
                                .catch(err => console.error(err));
                        }
                        // Send success embed
                        const successEmbed = new Discord.MessageEmbed(botEmbedMessage.embeds[0])
                            .setColor('#77DD66')
                            .setTitle('Clan Created!')
                            .setDescription(`You have successfully created a clan called ${clanName}!`)
                            .setFooter({ text: 'Upgrade your clan now by leveling up!' });
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
                            const retryEmbed = await updateClanCreation(botEmbedMessage);
                            retryEmbed.fields.pop();
                            // Re-add buttons to original message
                            await botEmbedMessage.edit({ embeds: [retryEmbed], components: [row3] });
                        } catch (error) {
                            // If original message was deleted
                            if (error.code == Discord.Constants.APIErrors.UNKNOWN_MESSAGE) {
                                const failureEmbed = new Discord.MessageEmbed(botEmbedMessage.embeds[0])
                                    .setColor('#FF0000')
                                    .setTitle('Clan was not created')
                                    .setDescription(`Your clan has not been created`)
                                    .setFooter({ text: 'Try again later.' });
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
                            const retryEmbed = await updateClanCreation(botEmbedMessage);
                            retryEmbed.fields.pop();
                            // Send message along with buttons
                            await botEmbedMessage.edit({ embeds: [retryEmbed], components: [row3] });
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
        // Upgrade Clan
        // Reset prompt
        async function clanUpgrade(clanData, botEmbedMessage) {
            while (userSelection != "cancel") {
                // Awaits interaction
                await botEmbedMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                    .then(async btnInt => {
                        currentColor = '#0099ff';
                        userSelection = btnInt.customId;
                        // Parse button pressed
                        parseUpgradeClan(clanData, botEmbedMessage, userSelection);
                        botEmbedMessage.edit({ embeds: [await createUpdatedMessage(clanData)], components: [row1, row2] });
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

        }
        // Parse button pressed
        async function parseUpgradeClan(clanData, botEmbedMessage, action) {
            switch (action) {
                case "up":
                    multiplier('up');
                    break;
                case "down":
                    multiplier('down');
                    break;
                case "gold":
                    updatedClanData = await upgradeClan(clanData, 'gold');
                    break;
                case "exp":
                    updatedClanData = await upgradeClan(clanData, 'exp');
                    break;
                case "hp":
                    updatedClanData = await upgradeClan(clanData, 'hp');
                    break;
                case "attack":
                    updatedClanData = await upgradeClan(clanData, 'attack');
                    break;
                case "defense":
                    updatedClanData = await upgradeClan(clanData, 'defense');
                    break;
                case "speed":
                    updatedClanData = await upgradeClan(clanData, 'speed');
                    break;
                case "confirm":
                    // Deactivates buttons and displays confirmation message
                    messageDisplayed = 'Awaiting confirmation...';
                    await confirm(clanData, botEmbedMessage);
                    break;
                case "cancel":
                    // Cancel message
                    messageDisplayed = "Upgrade did not pass validation. Cancelling...";
                    currentColor = '#FF0000';
                    break;
            }
            return updatedClanData;
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

        async function upgradeClan(clanData, statString) {
            if (clanData.sp >= multi) {
                clanData.sp -= multi;
                spSpent += multi;
                clanData.stats[statString] += multi;
                messageDisplayed = `Your ${statString} stat has been upgraded by ${multi}!`;
            } else {
                messageDisplayed = 'You do not have enough sp to upgrade this stat';
            }
            return clanData;
        }
        async function createUpdatedMessage(clanData) {
            const goldSp = clanData.stats.gold - 1;
            const expSp = clanData.stats.exp - 1;
            const hpSp = clanData.stats.hp - 1;
            const attackSp = clanData.stats.attack - 1;
            const defenseSp = clanData.stats.defense - 1;
            const speedSp = clanData.stats.speed - 1;
            // Make reset sp embed
            const spEmbed = new Discord.MessageEmbed()
                .setColor(currentColor)
                .setTitle(`Upgrade Embed`)
                .setAuthor({ name: message.member.user.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .addFields(
                    {
                        name: `Current Stats for __${clanData.clanName}__ clan!`, value: `<:x2Gold_Ticket1hr:898287203246047252> Gold: ${clanData.stats.gold}% **(+${goldSp})** \n <:x2ExpTicket1hr:898287128159592488> Exp: ${clanData.stats.exp}%: **(+${expSp})** \n :hearts: Health ${clanData.stats.hp}%: **(+${hpSp})** \n :crossed_swords: Attack ${clanData.stats.attack}%: **(+${attackSp})**  \n :shield: Defense ${clanData.stats.defense}%: **(+${defenseSp})**  \n :dash: Speed ${clanData.stats.speed}%: **(+${speedSp})**`,
                    },
                )
                .setFooter({ text: `Special Points Remaining : ${originalSP - spSpent} / ${originalSP}` });
            // .setFooter({ text: `Spent SP : ${spSpent}` });
            return spEmbed;
        }

        // Confirm reset
        async function confirm(clanData, botEmbedMessage) {
            // Creates confirmation message
            const confirmationEmbed = new Discord.MessageEmbed()
                .setColor(currentColor)
                .setTitle('Are you sure you would like to proceed?')
                .setAuthor({ name: message.member.user.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setDescription(`This will use your clan's sp`)
                .setFooter({ text: 'Note: This action is irreversible.' });

            const confirmation = await botEmbedMessage.reply({ embeds: [confirmationEmbed], components: [row3], ephemeral: true });

            // Confirmation interaction collector
            await confirmation.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                .then(async btnInt => {
                    currentColor = '#0099ff';
                    userSelection = btnInt.customId;
                    // If user selected confirm, reset stats, give sp
                    if (userSelection == 'confirm') {
                        clanData.markModified('stats');
                        clanData.save()
                            .then(() => console.log("reset"))
                            .catch(err => console.error(err));
                        // Send success embed
                        const successEmbed = new Discord.MessageEmbed(botEmbedMessage.embeds[0])
                            .setColor('#77DD66')
                            .setTitle('Successfully upgraded!')
                            .setDescription(`You have successfully assigned your Clan's stats!`)
                            .setFooter({ text: 'Spend your special points with the clan upgrade command!' });
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
                                    .setFooter({ text: 'Reset your special points with the reset command!' });
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

        // Create Clan
        // Clan prompt
        async function clanPromote(botEmbedMessage, clanData, userToPromote) {
            while (userSelection != "cancel") {
                // Awaits interaction
                await botEmbedMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                    .then(async btnInt => {
                        currentColor = '#0099ff';
                        userSelection = btnInt.customId;
                        // Parse button pressed
                        parseClanPromotion(userSelection);
                        botEmbedMessage.edit({ embeds: [await updateClanPromotion(botEmbedMessage)], components: [] });
                    })
                    .catch(async (error) => {
                        currentColor = '#FF0000';
                        // If message was deleted, ignore
                        if (error.code == 'INTERACTION_COLLECTOR_ERROR') {
                            userSelection = "cancel";
                            return;
                        }
                        botEmbedMessage.edit({ embeds: [await updateClanPromotion(botEmbedMessage)], components: [] });
                    });
            }

            // Parse button pressed
            async function parseClanPromotion(action) {
                switch (action) {
                    case "confirm":
                        // Deactivates buttons and displays confirmation message
                        messageDisplayed = 'Awaiting confirmation...';
                        await confirmClanPromotion(botEmbedMessage, clanData, userToPromote);
                        break;
                    case "cancel":
                        // Cancel message
                        messageDisplayed = "User was not promoted";
                        currentColor = '#FF0000';
                        break;
                }
            }
        }

        // Updates embed message
        async function updateClanPromotion(embedMessage) {
            const receivedEmbed = embedMessage.embeds[0];
            const updatedBattleEmbed = new Discord.MessageEmbed(receivedEmbed)
                .setColor(currentColor)
                .addField('Update: ', messageDisplayed);
            return updatedBattleEmbed;
        }

        // Confirm clan creation
        async function confirmClanPromotion(botEmbedMessage, clanData, userToPromote) {
            // Creates confirmation message
            const confirmationEmbed = new Discord.MessageEmbed()
                .setColor(currentColor)
                .setTitle('Are you sure you would like to proceed?')
                .setAuthor({ name: message.member.user.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setDescription(`Are you sure you want to promote ${clanName}?`)
                .setFooter({ text: 'Note: This action is irreversible.' });

            const confirmation = await botEmbedMessage.reply({ embeds: [confirmationEmbed], components: [row3], ephemeral: true });

            // Confirmation interaction collector
            await confirmation.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                .then(async btnInt => {
                    currentColor = '#0099ff';
                    userSelection = btnInt.customId;
                    // If user confirms, create clan
                    if (userSelection == 'confirm') {
                        // Get Clan ID from giveClanID.js
                        if (clanData.clanViceLeader == userToPromote) {
                            const promotedLeadder = clanData.clanViceLeader;
                            clanData.clanViceLeader = clanData.clanLeader;
                            clanData.clanLeader = promotedLeadder;
                        } else {
                            clanData.clanViceLeader = userToPromote;
                        }
                        clanData.markModified('clanViceLeader');
                        clanData.save();
                        // Send success embed
                        const successEmbed = new Discord.MessageEmbed(botEmbedMessage.embeds[0])
                            .setColor('#77DD66')
                            .setTitle('Success!')
                            .setDescription(`You have successfully promoted ${clanName}!`)
                            .setFooter({ text: `Congratulations to ${clanName}` });
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
                            const retryEmbed = await updateClanDemotion(botEmbedMessage);
                            retryEmbed.fields.pop();
                            // Re-add buttons to original message
                            await botEmbedMessage.edit({ embeds: [retryEmbed], components: [row3] });
                        } catch (error) {
                            // If original message was deleted
                            if (error.code == Discord.Constants.APIErrors.UNKNOWN_MESSAGE) {
                                const failureEmbed = new Discord.MessageEmbed(botEmbedMessage.embeds[0])
                                    .setColor('#FF0000')
                                    .setTitle('Promotion failed!')
                                    .setDescription(`User has not been promoted.`)
                                    .setFooter({ text: 'Try again later.' });
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
                            const retryEmbed = await updateClanPromotion(botEmbedMessage);
                            retryEmbed.fields.pop();
                            // Send message along with buttons
                            await botEmbedMessage.edit({ embeds: [retryEmbed], components: [row3] });
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
        // Clan prompt
        async function clanDemote(botEmbedMessage, clanData, userToDemote) {
            while (userSelection != "cancel") {
                // Awaits interaction
                await botEmbedMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                    .then(async btnInt => {
                        currentColor = '#0099ff';
                        userSelection = btnInt.customId;
                        // Parse button pressed
                        parseClanDemotion(userSelection);
                        botEmbedMessage.edit({ embeds: [await updateClanDemotion(botEmbedMessage)], components: [] });
                    })
                    .catch(async (error) => {
                        currentColor = '#FF0000';
                        // If message was deleted, ignore
                        if (error.code == 'INTERACTION_COLLECTOR_ERROR') {
                            userSelection = "cancel";
                            return;
                        }
                        botEmbedMessage.edit({ embeds: [await updateClanDemotion(botEmbedMessage)], components: [] });
                    });
            }

            // Parse button pressed
            async function parseClanDemotion(action) {
                switch (action) {
                    case "confirm":
                        // Deactivates buttons and displays confirmation message
                        messageDisplayed = 'Awaiting confirmation...';
                        await confirmClanDemotion(botEmbedMessage, clanData, userToDemote);
                        break;
                    case "cancel":
                        // Cancel message
                        messageDisplayed = "User was not promoted";
                        currentColor = '#FF0000';
                        break;
                }
            }
        }

        // Updates embed message
        async function updateClanDemotion(embedMessage) {
            const receivedEmbed = embedMessage.embeds[0];
            const updatedBattleEmbed = new Discord.MessageEmbed(receivedEmbed)
                .setColor(currentColor)
                .addField('Update: ', messageDisplayed);
            return updatedBattleEmbed;
        }

        // Confirm clan creation
        async function confirmClanDemotion(botEmbedMessage, clanData, userToDemote) {
            // Creates confirmation message
            const confirmationEmbed = new Discord.MessageEmbed()
                .setColor(currentColor)
                .setTitle('Are you sure you would like to proceed?')
                .setAuthor({ name: message.member.user.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setDescription(`Are you sure you want to demote ${clanName}?`)
                .setFooter({ text: 'Note: This action is irreversible.' });

            const confirmation = await botEmbedMessage.reply({ embeds: [confirmationEmbed], components: [row3], ephemeral: true });

            // Confirmation interaction collector
            await confirmation.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                .then(async btnInt => {
                    currentColor = '#0099ff';
                    userSelection = btnInt.customId;
                    // If user confirms, create clan
                    if (userSelection == 'confirm') {
                        // Get Clan ID from giveClanID.js
                        if (clanData.clanViceLeader == userToDemote) {
                            clanData.clanViceLeader = null;
                        } else {
                            return message.channel.send("User is not the vice leader of the clan.");
                        }
                        clanData.markModified('clanViceLeader');
                        clanData.save();
                        // Send success embed
                        const successEmbed = new Discord.MessageEmbed(botEmbedMessage.embeds[0])
                            .setColor('#77DD66')
                            .setTitle('Clan Created!')
                            .setDescription(`You have successfully demoted ${clanName}!`)
                            .setFooter({ text: `Potato potataaa ${clanName}` });
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
                            const retryEmbed = await updateClanDemotion(botEmbedMessage);
                            retryEmbed.fields.pop();
                            // Re-add buttons to original message
                            await botEmbedMessage.edit({ embeds: [retryEmbed], components: [row3] });
                        } catch (error) {
                            // If original message was deleted
                            if (error.code == Discord.Constants.APIErrors.UNKNOWN_MESSAGE) {
                                const failureEmbed = new Discord.MessageEmbed(botEmbedMessage.embeds[0])
                                    .setColor('#FF0000')
                                    .setTitle('Promotion failed!')
                                    .setDescription(`User has not been promoted.`)
                                    .setFooter({ text: 'Try again later.' });
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
                            const retryEmbed = await updateClanDemotion(botEmbedMessage);
                            retryEmbed.fields.pop();
                            // Send message along with buttons
                            await botEmbedMessage.edit({ embeds: [retryEmbed], components: [row3] });
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
        // Clan prompt
        async function clanDelete(botEmbedMessage, clanData) {
            while (userSelection != "cancel") {
                // Awaits interaction
                await botEmbedMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                    .then(async btnInt => {
                        currentColor = '#0099ff';
                        userSelection = btnInt.customId;
                        // Parse button pressed
                        parseClanDelete(userSelection);
                        botEmbedMessage.edit({ embeds: [await updateClanDelete(botEmbedMessage)], components: [] });
                    })
                    .catch(async (error) => {
                        currentColor = '#FF0000';
                        // If message was deleted, ignore
                        if (error.code == 'INTERACTION_COLLECTOR_ERROR') {
                            userSelection = "cancel";
                            return;
                        }
                        botEmbedMessage.edit({ embeds: [await updateClanDelete(botEmbedMessage)], components: [] });
                    });
            }

            // Parse button pressed
            async function parseClanDelete(action) {
                switch (action) {
                    case "confirm":
                        // Deactivates buttons and displays confirmation message
                        messageDisplayed = 'Awaiting confirmation...';
                        await confirmClanDelete(botEmbedMessage, clanData);
                        break;
                    case "cancel":
                        // Cancel message
                        messageDisplayed = "Clan was not deleted";
                        currentColor = '#FF0000';
                        break;
                }
            }
        }

        // Updates embed message
        async function updateClanDelete(embedMessage) {
            const receivedEmbed = embedMessage.embeds[0];
            const updatedBattleEmbed = new Discord.MessageEmbed(receivedEmbed)
                .setColor(currentColor)
                .setFooter({ text: `Update: ${messageDisplayed}` });
            return updatedBattleEmbed;
        }

        // Confirm clan creation
        async function confirmClanDelete(botEmbedMessage, clanData) {
            // Creates confirmation message
            const confirmationEmbed = new Discord.MessageEmbed()
                .setColor(currentColor)
                .setTitle('Are you sure you would like to proceed?')
                .setAuthor({ name: message.member.user.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setDescription(`Are you sure you want to delete ${clanData.clanName}?`)
                .setFooter({ text: 'Note: This action is irreversible.' });

            const confirmation = await botEmbedMessage.reply({ embeds: [confirmationEmbed], components: [row3], ephemeral: true });

            // Confirmation interaction collector
            await confirmation.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                .then(async btnInt => {
                    currentColor = '#0099ff';
                    userSelection = btnInt.customId;
                    // If user confirms, create clan
                    if (userSelection == 'confirm') {
                        // Get Clan ID from giveClanID.js
                        await clanData.deleteOne({ clanID: clanData.clanID });
                        // Send success embed
                        const successEmbed = new Discord.MessageEmbed(botEmbedMessage.embeds[0])
                            .setColor('#77DD66')
                            .setTitle('Success!')
                            .setDescription(`You have successfully delete ${clanData.clanName}!`)
                            .setFooter({ text: `Well done` });
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
                            const retryEmbed = await updateClanDelete(botEmbedMessage);
                            retryEmbed.fields.pop();
                            // Re-add buttons to original message
                            await botEmbedMessage.edit({ embeds: [retryEmbed], components: [row3] });
                        } catch (error) {
                            // If original message was deleted
                            if (error.code == Discord.Constants.APIErrors.UNKNOWN_MESSAGE) {
                                const failureEmbed = new Discord.MessageEmbed(botEmbedMessage.embeds[0])
                                    .setColor('#FF0000')
                                    .setTitle('Promotion failed!')
                                    .setDescription(`Clan has not been deleted`)
                                    .setFooter({ text: 'Try again later.' });
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
                            const retryEmbed = await updateClanDelete(botEmbedMessage);
                            retryEmbed.fields.pop();
                            // Send message along with buttons
                            await botEmbedMessage.edit({ embeds: [retryEmbed], components: [row3] });
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
        // Create a clan command that will allow users to create a clan and join a clan
        if (!args[0]) {
            const clanData = await clanUtil(user.clanID);
            if (clanData != null) {
                let formattedMembers = '';
                if (!clanData) { return message.channel.send('Error: Clan not found.'); }
                const nextLevel = Math.floor(clanData.clanLevel * (clanData.clanLevel / 10 * 750));
                const goldSp = clanData.stats.gold - 1;
                const expSp = clanData.stats.exp - 1;
                const hpSp = clanData.stats.hp - 1;
                const attackSp = clanData.stats.attack - 1;
                const defenseSp = clanData.stats.defense - 1;
                const speedSp = clanData.stats.speed - 1;
                const clanEmbed = new Discord.MessageEmbed()
                    .setColor(currentColor)
                    .setTitle(`Clan Name: __${clanData.clanName}__`)
                    .setDescription(`Clan Description: \n ${clanData.clanDescription} `);

                clanEmbed.addField('Clan Leader: ', `${clanData.clanLeader}`);
                clanEmbed.addField('Clan Vice Leader: ', `${clanData.clanViceLeader} `);
                clanEmbed.addField('Clan ID:', clanData.clanID);
                clanEmbed.addField('Clan Level:', (clanData.clanLevel).toString());
                clanEmbed.addField('Clan Current Experience:', `${clanData.clanCurrentExp} / ${nextLevel}`);
                clanEmbed.addField('Clan Members', `${(clanData.clanMembers).length} / ${clanData.clanMaxMembers}`);
                clanEmbed.addField('Clan Available SP', `${clanData.sp} Special Points Available`);

                for (const i in clanData.clanMembers) {
                    let memberName;
                    try {
                        const memberObject = await client.users.fetch(clanData.clanMembers[i]);
                        memberName = memberObject.tag;
                    } catch (error) {
                        memberName = clanData.clanMembers[i];
                    }
                    formattedMembers += `${parseInt(i) + 1}. ${memberName}\n`;
                }
                clanEmbed.addField(`Clan Members`, `${formattedMembers}`);
                clanEmbed.addField(`Clan Additional Stats`, " These are stats you gain for being part of this clan. \n");
                clanEmbed.addFields(
                    {
                        name: `Current Stats for __${clanData.clanName}__ clan!`, value: `<:x2Gold_Ticket1hr:898287203246047252> Gold: ${clanData.stats.gold}% **(+${goldSp})** \n <:x2ExpTicket1hr:898287128159592488> Exp: ${clanData.stats.exp}%: **(+${expSp})** \n :hearts: Health ${clanData.stats.hp}%: **(+${hpSp})** \n :crossed_swords: Attack ${clanData.stats.attack}%: **(+${attackSp})**  \n :shield: Defense ${clanData.stats.defense}%: **(+${defenseSp})**  \n :dash: Speed ${clanData.stats.speed}%: **(+${speedSp})**`,
                    },
                );
                message.channel.send({ embeds: [clanEmbed] });
            } else {
                message.channel.send(`You are not in a clan!`);
            }
        } else {
            args[0] = args[0].toLowerCase();
            switch (args[0]) {
                case "create": {
                    const clanData = await clanUtil(user.clanID);
                    // Check if user is already in a clan
                    if (clanData != null) {
                        return message.channel.send(`You are already in a clan!`);
                    }
                    // Check if user has enough gold
                    if (user.currency < costToCreateClan) {
                        return message.channel.send(`You do not have enough gold to create a clan! You need 10,000 gold to create a clan.`);
                    }
                    // Check if user has enough exp
                    if (user.level < levelToCreateClan) {
                        return message.channel.send(`You do not have enough exp to create a clan! You need to be level 10 to create a clan.`);
                    }
                    if (!clanName) { return message.channel.send(`Specify a clan name!`); }
                    // For users who were created before sp was created
                    // Make reset sp embed
                    const clanEmbed = new Discord.MessageEmbed()
                        .setColor(currentColor)
                        .setTitle('Create a clan')
                        .setAuthor({ name: message.member.user.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setDescription(`Are you sure you want to create a clan called ${clanName}?`)
                        .addFields(
                            { name: `You will be using 10,000 currency for this clan creation`, value: "\u200b" },
                        );
                    message.channel.send({ embeds: [clanEmbed], components: [row3] })
                        .then(botMessage => {
                            clanCreation(botMessage, clanName);
                        });
                }
                    break;
                case "upgrade": {
                    if (!user.clanID) { return message.channel.send(`You do not have a clan!`); }
                    clan.findOne({ clanID: user.clanID }, async (err, clanData) => {
                        if (clanData == null) { return message.channel.send(`You do not have a clan!`); }
                        if (user.userID !== clanData.clanLeader && user.userID !== clanData.clanViceLeader) {
                            return message.channel.send(`You do not have the necessary permissions to upgrade this clan's stats!`);
                        }
                        if (clanData.sp < 1) { return message.channel.send(`You do not have enough SP to upgrade your clan!`); }
                        // Begin clan upgrade
                        // Get base clan stats
                        const goldSp = clanData.stats.gold - 1;
                        const expSp = clanData.stats.exp - 1;
                        const hpSp = clanData.stats.hp - 1;
                        const attackSp = clanData.stats.attack - 1;
                        const defenseSp = clanData.stats.defense - 1;
                        const speedSp = clanData.stats.speed - 1;
                        originalSP = clanData.sp;
                        // Make reset sp embed
                        const spEmbed = new Discord.MessageEmbed()
                            .setColor(currentColor)
                            .setTitle(`Upgrade Embed`)
                            .setAuthor({ name: message.member.user.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .addFields(
                                {
                                    name: `Current Stats for __${clanData.clanName}__ clan!`, value: `<:x2Gold_Ticket1hr:898287203246047252> Gold: ${clanData.stats.gold}% **(+${goldSp})** \n <:x2ExpTicket1hr:898287128159592488> Exp: ${clanData.stats.exp}%: **(+${expSp})** \n :hearts: Health ${clanData.stats.hp}%: **(+${hpSp})** \n :crossed_swords: Attack ${clanData.stats.attack}%: **(+${attackSp})**  \n :shield: Defense ${clanData.stats.defense}%: **(+${defenseSp})**  \n :dash: Speed ${clanData.stats.speed}%: **(+${speedSp})**`,
                                },
                            )
                            .setFooter({ text: `Special Points Remaining : ${originalSP - spSpent} / ${originalSP}` });

                        message.channel.send({ embeds: [spEmbed], components: [row1, row2] })
                            .then(botMessage => {
                                clanUpgrade(clanData, botMessage);
                            });
                    });
                }
                    break;
                case 'join': {
                    const levelToJoinClan = 10;
                    const clanID = args[1];
                    // Call clan util
                    const checkClan = await clanUtil(user.clanID);
                    if (checkClan == null) {
                        // Check if user has enough exp
                        if (user.level < levelToJoinClan) {
                            return message.channel.send(`You do not have enough exp to join a clan! You need to be level 10 to join a clan.`);
                        }
                        if (!clanID) { return message.channel.send(`Please specify a valid Clan ID to join.`); }

                        // Check if clan exists
                        clan.findOne({ clanID: clanID }, async (err, clanData) => {
                            if (!clanData) { return message.channel.send(`That clan does not exist!`); }
                            // Check if user is already in a clan
                            // Check if clan is full
                            if (clanData.clanMembers.length >= clanData.maxMembers) {
                                return message.channel.send(`That clan is full!`);
                            }
                            clanData.clanInvite.push(user.userID);
                            clanData.markModified('clanInvite');
                            clanData.save();
                            message.channel.send(`You have successfully requested to join ${clanData.clanName}, let the Leader or Vice Leader know, they can accept you by doing ${prefix}clan invite ${user.userID}!`);

                        });
                    } else {
                        return message.channel.send(`You are already in a clan!`);
                    }
                }
                    break;
                case 'invite': {
                    const requestID = message.mentions.users.first()?.id || args[1];
                    if (!user.clanID) { return message.channel.send(`You do not have a clan!`); }
                    clan.findOne({ clanID: user.clanID }, async (err, clanData) => {
                        if (clanData == null) { return message.channel.send(`You do not have a clan!`); }
                        if (user.userID !== clanData.clanLeader && user.userID !== clanData.clanViceLeader) {
                            return message.channel.send(`You do not have the necessary permissions to invite people to your clan!`);
                        }
                        if (clanData.clanInvite.includes(requestID)) {
                            clanData.clanMembers.push(requestID);
                            clanData.clanInvite.splice(clanData.clanInvite.indexOf(requestID), 1);
                            clanData.markModified('clanMembers');
                            clanData.markModified('clanInvite');
                            clanData.save();
                            // Get user data
                            await User.findOne({ userID: requestID }, async (err, userData) => {
                                userData.clanID = user.clanID;
                                userData.markModified('clanID');
                                userData.save();
                                message.channel.send(`You have successfully been invited to the clan!`);
                            });
                            message.channel.send(`You have successfully accepted **${requestID}** to your clan!`);
                        } else {
                            const clanInvites = clanData.clanInvite;
                            // Display list of invites
                            displayList({ clanInvites, message, client, clanData });
                        }
                    });
                }
                    break;
                case 'leave': {
                    if (!user.clanID) { return message.channel.send(`You do not have a clan!`); }
                    clan.findOne({ clanID: user.clanID }, async (err, clanData) => {
                        if (clanData == null) { return message.channel.send(`You do not have a clan!`); }
                        if (user.userID == clanData.clanLeader) {
                            return message.channel.send(`You cannot leave your clan because you are the leader!`);
                        }
                        if (clanData.clanMembers.includes(user.userID)) {
                            // Remove user from clan
                            const index = clanData.clanMembers.indexOf(user.userID);
                            if (index > -1) {
                                clanData.clanMembers.splice(index, 1);
                                if (user.userID == clanData.clanViceLeader) {
                                    clanData.clanViceLeader = null;
                                }
                                clanData.markModified('clanViceLeader');
                                clanData.markModified('clanMembers');
                                clanData.save();
                                // Get user data
                                await User.findOne({ userID: user.userID }, async (err, userData) => {
                                    userData.clanID = '';
                                    userData.markModified('clanID');
                                    userData.save();
                                    message.channel.send(`You have successfully been left your clan!`);
                                });
                            }
                        }
                    });
                }
                    break;
                case 'kick': {
                    const userToKick = message.mentions.users.first()?.id || args[1];
                    if (!user.clanID) { return message.channel.send(`You do not have a clan!`); }
                    if (!userToKick) { return message.channel.send(`Specify a user to kick!`); }
                    if (userToKick == user.userID) { return message.channel.send(`You cannot kick yourself!`); }

                    clan.findOne({ clanID: user.clanID }, async (err, clanData) => {
                        if (clanData == null) { return message.channel.send(`You do not have a clan!`); }
                        if (user.userID !== clanData.clanLeader && user.userID !== clanData.clanViceLeader) {
                            return message.channel.send(`You cannot kick someone because you are not the leader or vice leader!`);
                        }
                        if (userToKick == clanData.clanLeader) {
                            return message.channel.send(`You cannot kick a user because you are the leader!`);
                        }
                        if (userToKick == clanData.clanLeader) {
                            return message.channel.send(`You cannot kick the leader!`);
                        }
                        if (userToKick == clanData.clanViceLeader) {
                            return message.channel.send(`You cannot kick the vice leader!`);
                        }
                        if (clanData.clanMembers.includes(userToKick)) {
                            // Remove user from clan
                            const index = clanData.clanMembers.indexOf(userToKick);
                            if (index > -1) {
                                clanData.clanMembers.splice(index, 1);
                                clanData.markModified('clanMembers');
                                clanData.save();
                                message.channel.send(`You have successfully kicked **${userToKick}** from your clan!`);
                                // Get user data
                                await User.findOne({ userID: userToKick }, async (err, userData) => {
                                    userData.clanID = '';
                                    userData.markModified('clanID');
                                    userData.save();
                                    message.channel.send(`You have successfully been kicked from your clan!`);
                                });
                            }
                        } else {
                            message.channel.send(`That user is not in your clan!`);
                        }
                    });
                }
                    break;
                case 'promote': {
                    const userToPromote = message.mentions.users.first()?.id || args[1];
                    if (!user.clanID) { return message.channel.send(`You do not have a clan!`); }
                    if (!userToPromote) { return message.channel.send(`Specify a user to promote!`); }
                    if (userToPromote == user.userID) { return message.channel.send(`You cannot promote yourself!`); }
                    clan.findOne({ clanID: user.clanID }, async (err, clanData) => {
                        if (clanData == null) { return message.channel.send(`You do not have a clan!`); }
                        if (user.userID !== clanData.clanLeader) {
                            return message.channel.send(`You cannot promote someone because you are not the leader!`);
                        }
                        if (clanData.clanMembers.includes(userToPromote)) {
                            // Make reset sp embed
                            const promoteEmbed = new Discord.MessageEmbed()
                                .setColor(currentColor)
                                .setTitle('Promote a user')
                                .setAuthor({ name: message.member.user.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                                .setDescription(`Are you sure you want to promote user ${userToPromote}?`)
                                .addFields(
                                    { name: `If you are promoting a vice leader, you would lose ownership of your clan!!`, value: "\u200b" },
                                );
                            message.channel.send({ embeds: [promoteEmbed], components: [row3] })
                                .then(botMessage => {
                                    clanPromote(botMessage, clanData, userToPromote);
                                });
                        }
                    });

                }
                    break;
                case 'demote': {
                    const userToDemote = message.mentions.users.first()?.id || args[1];
                    if (!user.clanID) { return message.channel.send(`You do not have a clan!`); }
                    if (!userToDemote) { return message.channel.send(`Specify a user to demote!`); }
                    if (userToDemote == user.userID) { return message.channel.send(`You cannot demote yourself!`); }
                    clan.findOne({ clanID: user.clanID }, async (err, clanData) => {
                        if (clanData == null) { return message.channel.send(`You do not have a clan!`); }
                        if (user.userID !== clanData.clanLeader) {
                            return message.channel.send(`You cannot demote someone because you are not the leader!`);
                        }
                        if (clanData.clanViceLeader == userToDemote) {
                            // Make reset sp embed
                            const promoteEmbed = new Discord.MessageEmbed()
                                .setColor(currentColor)
                                .setTitle('Promote a user')
                                .setAuthor({ name: message.member.user.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                                .setDescription(`Are you sure you want to demote user ${userToDemote}?`)
                                .addFields(
                                    { name: `If you are demoting a vice leader, they would lose permissions`, value: "\u200b" },
                                );
                            message.channel.send({ embeds: [promoteEmbed], components: [row3] })
                                .then(botMessage => {
                                    clanDemote(botMessage, clanData, userToDemote);
                                });
                        }
                    });
                }
                    break;
                case 'disband': {
                    if (!user.clanID) { return message.channel.send(`You do not have a clan!`); }
                    clan.findOne({ clanID: user.clanID }, async (err, clanData) => {
                        if (clanData == null) { return message.channel.send(`You do not have a clan!`); }
                        if (user.userID !== clanData.clanLeader) {
                            return message.channel.send(`You cannot disband this clan`);
                        }

                        // Make delete embed
                        const deleteEmbed = new Discord.MessageEmbed()
                            .setColor(currentColor)
                            .setTitle('Disband your clan')
                            .setAuthor({ name: message.member.user.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setDescription(`Are you sure you want disband this clan?`)
                            .addFields(
                                { name: `If you choose to disband your clan, it can never be retrieved`, value: "\u200b" },
                            );
                        message.channel.send({ embeds: [deleteEmbed], components: [row3] })
                            .then(botMessage => {
                                clanDelete(botMessage, clanData);
                            });
                    });
                }
                    break;
                case 'description': {
                    if (!user.clanID) { return message.channel.send(`You do not have a clan!`); }
                    clan.findOne({ clanID: user.clanID }, async (err, clanData) => {
                        if (clanData == null) { return message.channel.send(`You do not have a clan!`); }
                        if (user.userID !== clanData.clanLeader && user.userID !== clanData.clanViceLeader) {
                            return message.channel.send(`You do not have the permissions to change the description of this clan`);
                        }
                        const description = args.slice(1).join(' ');
                        if (!description) { return message.channel.send(`Please specify a description!`); }
                        if (description.length > 1000) { return message.channel.send(`Description cannot be longer than 1000 characters!`); }
                        clanData.clanDescription = description;
                        clanData.save();
                        // Make delete embed
                        const descriptionEmbed = new Discord.MessageEmbed()
                            .setColor(currentColor)
                            .setTitle('Description changed!')
                            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .addFields(
                                { name: `New Description:`, value: `${description}` },
                            );
                        message.channel.send({ embeds: [descriptionEmbed] });
                    });
                }
                    break;
                case 'contribution': {
                    if (!user.clanID) { return message.channel.send(`You do not have a clan!`); }
                    clan.findOne({ clanID: user.clanID }, async (err, clanData) => {
                        if (clanData == null) { return message.channel.send(`You do not have a clan!`); }
                        let formattedContribution = ``;
                        // Make delete embed
                        const contributionEmbed = new Discord.MessageEmbed()
                            .setColor(currentColor)
                            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
                        // Display all contributions
                        for (const contribution in clanData.contribution) {
                            let memberName = ``;
                            try {
                                const memberObject = await client.users.fetch(contribution);
                                memberName = memberObject.tag;
                            } catch (error) {
                                memberName = "Unable to find member";
                            }
                            formattedContribution += `${memberName}: **${clanData.contribution[contribution].exp}** __Experience__ \n`;

                        }
                        if (formattedContribution == ``) { formattedContribution = `No one has contributed to this clan yet!`; }
                        contributionEmbed.addFields({ name: `Members who contributed to __${clanData.clanName}__ clan`, value: `${formattedContribution}` });
                        message.channel.send({ embeds: [contributionEmbed] });
                    });
                }
                    break;

                default: {
                    // Create sub help command for clans
                    const clanHelpEmbed = new Discord.MessageEmbed()
                        .setColor(currentColor)
                        .setAuthor({ name: message.member.user.tag, iconURL: message.author.avatarURL({ dynamic: true }) })
                        .addFields(
                            { name: `Create Clan`, value: `__Correct Usage__: ${prefix}clan create \`{clanName}\` \n Creates a new clan, requiring 10,000 currency and level 10, \n you are not allowed to be in more than 1 clan.` },
                            { name: `Upgrade Clan`, value: `__Correct Usage__: ${prefix}clan upgrade \n Upgrades the clan, only Vice Leaders and Clan Leaders can use this command. Each upgrade increases the stats of the clan.` },
                            { name: `Join Clan`, value: `__Correct Usage__: ${prefix}join \`{clanID}\` \n Requests to join a clan, the clan leaders can see the invitation by doing ${prefix}clan invite` },
                            { name: `Invite User`, value: `__Correct Usage__: ${prefix}invite \`{userID}\` \n Accepts the invite from a user, if no arguments are provided, lists all the requests to join the clan` },
                            { name: `Leave Clan`, value: `__Correct Usage__: ${prefix}leave \n Leaves your current clan, what else is there more to say? thenceforth thy shall not be passive aggressive when coding for 12 hours straight..` },
                            { name: `Kick User`, value: `__Correct Usage__: ${prefix}kick \`{userID}\` \n Kicks the user from the clan. One must have the right permissions to use this command, and be a Vice Leader or Leader.` },
                            { name: `Promote User`, value: `__Correct Usage__: ${prefix}promote \`{userID}\` \n Promotes said user to a higher rank, if the user is a Vice Leader, they would own the clan and be the leader. Only Leaders can use this command.` },
                            { name: `Demote User`, value: `__Correct Usage__: ${prefix}demote \`{userID}\` \n Demotes a Vice Leader to a clam member. Only Leaders are allowed to use this command.` },
                            { name: `Disband Clan`, value: `__Correct Usage__: ${prefix}disband \n Disbands the clan, only leaders can use this command.` },
                            { name: `Description`, value: `__Correct Usage__: ${prefix}description \`{newDescription}\` \n Gives a new description to the clan, though I think poggers is quite good as a description.` },
                            { name: `Contribution`, value: `__Correct Usage__: ${prefix}contribution \n Displays all contributors to the clan, if there are none, display nothing.` },
                        );
                    return message.channel.send({ embeds: [clanHelpEmbed] });
                }
            }
        }
    },
};
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

const inviteEmbed = {
    title: "Invite Listing :scroll:",
    description: "Invite listings are shown below\n\n",
    color: '#0099ff',
};
// Display list of invites
async function displayList({ message, clanInvites, client, clanData }) {
    let currentPage = 1;
    const clanName = clanData.clanName;
    const itemsPerPage = 10;
    const totalListings = clanInvites.length;
    const totalPages = Math.ceil(totalListings / itemsPerPage) || 1;
    let itemsOnCurrentPage = currentPage == totalPages ? totalListings - ((currentPage - 1) * itemsPerPage) : itemsPerPage;

    inviteEmbed.footer = { text: `Page ${currentPage} | Items: ${itemsOnCurrentPage} / ${totalListings}.` };
    inviteEmbed.description = `__${clanName}__ Invite listings are shown below\n\n`;

    inviteEmbed.color = '#0099ff';

    let currentArray = clanInvites.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    for (const item in currentArray) {
        let memberName;
        try {
            const memberObject = await client.users.fetch(currentArray[item]);
            memberName = memberObject.tag;
        } catch (error) {
            memberName = "Unable to find member";
        }
        inviteEmbed.description += `${parseInt(item) + 1}. Request ID: ${currentArray[item]}\n Tag: ${memberName} \n `;
    }
    const listMessage = await message.channel.send({ embeds: [inviteEmbed], components: [row] });

    const filter = btnInt => {
        btnInt.deferUpdate();
        return btnInt.user.id === message.author.id;
    };

    let isExpired, messageDeleted;
    while (!isExpired && !messageDeleted) {
        await listMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
            .then(async int => {
                if (int.customId === 'delete') {
                    messageDeleted = true;
                    return listMessage.delete();
                }

                if (int.customId === 'back') {
                    currentPage--;
                }

                if (int.customId === 'forward') {
                    currentPage++;
                }

                inviteEmbed.description = inviteEmbed.description.split('\n\n')[0] + '\n\n';
                if (currentPage > totalPages || currentPage < 1) {
                    currentPage = 1;
                }
                currentArray = clanInvites.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                for (const item in currentArray) {
                    let memberName;
                    try {
                        const memberObject = await client.users.fetch(currentArray[item]);
                        memberName = memberObject.tag;
                    } catch (error) {
                        memberName = "Unable to find member";
                    }
                    inviteEmbed.description += `${parseInt(item) + 1}. Request ID: ${currentArray[item]}\n Tag: ${memberName} \n `;
                }
                itemsOnCurrentPage = currentPage == totalPages ? totalListings - ((currentPage - 1) * itemsPerPage) : itemsPerPage;

                inviteEmbed.footer = { text: `Page ${currentPage} | Items: ${itemsOnCurrentPage} / ${totalListings}.` };

                listMessage.edit({ embeds: [inviteEmbed], components: [row] });
            })
            .catch(async (err) => {
                inviteEmbed.color = '#FF0000';
                if (err.code == 'INTERACTION_COLLECTOR_ERROR') {
                    return;
                }
                listMessage.edit({ embeds: [inviteEmbed] });

                isExpired = true;
            });
    }
}
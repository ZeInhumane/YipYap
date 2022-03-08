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
    syntax: "[area's id or name]",
    async execute({ client, prefix, args, message, user }) {
        const costToCreateClan = 10000;
        const levelToCreateClan = 10;
        const clanName = args[1];
        const maxOnPage = 20;
        let originalSP = 0;
        let multi = 1;
        let spSpent = 0;
        let currentColor = "#ffccff";
        let onPage = 0;
        let totalItems = 0;
        let maxPage = 0;
        let playerAction = "";
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
        const row4 = new Discord.MessageActionRow()
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
                .addField('Update: ', messageDisplayed);
            return updatedBattleEmbed;
        }

        // Confirm clan creation
        async function confirmClanCreation(botEmbedMessage) {
            // Creates confirmation message
            const confirmationEmbed = new Discord.MessageEmbed()
                .setColor(currentColor)
                .setTitle('Are you sure you would like to proceed?')
                .setAuthor({ name: message.member.user.tag, icon_url: message.author.avatarURL() })
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
        let updatedClanData;
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
            // Make reset sp embed
            const spEmbed = new Discord.MessageEmbed()
                .setColor(currentColor)
                .setTitle(`Upgrade Embed`)
                .setAuthor({ name: message.member.user.tag, icon_url: message.author.avatarURL() })
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
                .setAuthor({ name: message.member.user.tag, icon_url: message.author.avatarURL() })
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
                        console.log(clanData);
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

        // Shows all invited users of clan
        async function invitePages(clanData, botEmbedMessage) {
            async function createUpdatedInvite() {
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

                const updatedInviteEmbed = new Discord.MessageEmbed()
                    .setColor(currentColor)
                    .setTitle(`Clan Invite Embed`)
                    .setAuthor({ name: message.member.user.tag, icon_url: message.author.avatarURL() })
                    .setFooter({ text: `Current page is ${onPage + 1}/${maxPage + 1}` });
                while (i < totalItems && counter < maxOnPage) {
                    let memberName;
                    try {
                        const memberObject = await client.users.fetch(clanData.clanMembers[i]);
                        memberName = memberObject.tag;
                    } catch (error) {
                        memberName = "Unable to find member";
                    }
                    updatedInviteEmbed.addField(`Request ID: ${clanData.clanInvite[i]}`, `Tag: ${memberName}`);
                    i++;
                    counter++;
                }
                return updatedInviteEmbed;
            }
            let isExpired = false;

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
                        botEmbedMessage.edit({ embeds: [await createUpdatedInvite()], components: [row4] });
                    })
                    .catch(async err => {
                        console.log(err);
                        currentColor = '#FF0000';
                        isExpired = true;
                    });
            }
            // Check if interaction expired
            if (isExpired) {
                botEmbedMessage.edit({ embeds: [await createUpdatedInvite()], components: [] });
                return;
            }
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
                .setAuthor({ name: message.member.user.tag, icon_url: message.author.avatarURL() })
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
                .setAuthor({ name: message.member.user.tag, icon_url: message.author.avatarURL() })
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
                .addField('Update: ', messageDisplayed);
            return updatedBattleEmbed;
        }

        // Confirm clan creation
        async function confirmClanDelete(botEmbedMessage, clanData) {
            // Creates confirmation message
            const confirmationEmbed = new Discord.MessageEmbed()
                .setColor(currentColor)
                .setTitle('Are you sure you would like to proceed?')
                .setAuthor({ name: message.member.user.tag, icon_url: message.author.avatarURL() })
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
            console.log(clanData);
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
                    .setTitle(`${clanData.clanName}`)
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
            switch (args[0]) {
                case "create": {
                    const clanData = await clanUtil(user.clanID);
                    console.log(clanData);
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
                        .setAuthor({ name: message.member.user.tag, icon_url: message.author.avatarURL() })
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
                            .setAuthor({ name: message.member.user.tag, icon_url: message.author.avatarURL() })
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
                    const checkClan = await clanUtil(user.userID);
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
                    const requestID = args[1];
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
                            totalItems = clanData.clanInvite.length;
                            maxPage = Math.floor(totalItems / maxOnPage);
                            // Make reset sp embed
                            const invitedEmbed = new Discord.MessageEmbed()
                                .setColor(currentColor)
                                .setTitle(`Clan Invite Embed`)
                                .setAuthor({ name: message.member.user.tag, icon_url: message.author.avatarURL() })
                                .setFooter({ text: `Current page is ${onPage + 1}/${maxPage + 1}` });

                            let i = onPage * maxOnPage;
                            let counter = 0;
                            while (i < totalItems && counter < maxOnPage) {
                                let memberName;
                                try {
                                    const memberObject = await client.users.fetch(clanData.clanMembers[i]);
                                    memberName = memberObject.tag;
                                } catch (error) {
                                    memberName = "Unable to find member";
                                }
                                invitedEmbed.addField(`${i + 1}. Request ID: ${clanData.clanInvite[i]}`, `Tag: ${memberName}`);
                                i++;
                                counter++;
                            }

                            message.channel.send({ embeds: [invitedEmbed], components: [row4] })
                                .then(botMessage => {
                                    invitePages(clanData, botMessage);
                                });
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
                                .setAuthor({ name: message.member.user.tag, icon_url: message.author.avatarURL() })
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
                                .setAuthor({ name: message.member.user.tag, icon_url: message.author.avatarURL() })
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
                            .setAuthor({ name: message.member.user.tag, icon_url: message.author.avatarURL() })
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

                default: {
                    // Create sub help command for clans
                    const clanHelpEmbed = new Discord.MessageEmbed()
                        .setColor(currentColor)
                        .setTitle(`Clan Help Embed`)
                        .setAuthor({ name: message.member.user.tag, icon_url: message.author.avatarURL() })
                        .addFields(
                            { name: `Create clan`, value: `**Correct usage:* ${prefix}clan create \`{clanName}\` \n Creates a new clan, requiring 10,000 currency and level 10, \n you are not allowed to be in more than 1 clan.` },
                            { name: `Current Statistics for player`, value: "\u200b" },
                        );

                    return message.channel.send({ embeds: [clanHelpEmbed] });
                }
            }
        }
    },
};

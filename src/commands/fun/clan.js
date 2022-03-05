// Import clan util
const clanUtil = require('./utils/clanUtil.js');
const Clan = require('../../models/clan');
const Discord = require('discord.js');
const giveClanID = require('../../functions/giveClanID');
module.exports = {
    name: 'clan',
    aliases: [''],
    category: "fun",
    description: "Anything related to clans",
    syntax: "[area's id or name]",
    async execute({ client, args, message, user }) {
        const costToCreateClan = 10000;
        const levelToCreateClan = 10;
        const clanName = args[1];
        let currentColor = "#ffccff";
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
        // Clan prompt
        async function clanCreation(botEmbedMessage, sp) {
            while (userSelection != "cancel") {
                // Awaits interaction
                await botEmbedMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                    .then(async btnInt => {
                        currentColor = '#0099ff';
                        userSelection = btnInt.customId;
                        // Parse button pressed
                        parse(userSelection);
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
            async function parse(action) {
                switch (action) {
                    case "confirm":
                        // Deactivates buttons and displays confirmation message
                        messageDisplayed = 'Awaiting confirmation...';
                        await confirmClanCreation(botEmbedMessage, sp);
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
                .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                .setDescription(`Are you sure you would like to create a clan called ${clanName}?`)
                .setFooter('Note: This action is irreversible.');

            const confirmation = await botEmbedMessage.reply({ embeds: [confirmationEmbed], components: [row1], ephemeral: true });

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
                            contribution: [],
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
                            .setTitle('Stats were reset!')
                            .setDescription(`You have successfully created a clan called ${clanName}!`)
                            .setFooter('Upgrade your clan now by leveling up!');
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
                            await botEmbedMessage.edit({ embeds: [retryEmbed], components: [row1] });
                        } catch (error) {
                            // If original message was deleted
                            if (error.code == Discord.Constants.APIErrors.UNKNOWN_MESSAGE) {
                                const failureEmbed = new Discord.MessageEmbed(botEmbedMessage.embeds[0])
                                    .setColor('#FF0000')
                                    .setTitle('Clan was not created')
                                    .setDescription(`Your clan has not been created`)
                                    .setFooter('Try again later.');
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


        // if (!user.clan) { return message.channel.send(`You do not have a clan, join one now!`); }
        // Create a clan command that will allow users to create a clan and join a clan
        if (!args[0]) {
            if (user.clanID) {
                let formattedMembers = '';
                const clanData = await clanUtil(user.clanID);
                const nextLevel = Math.floor(clanData.clanLevel * (clanData.clanLevel / 10 * 750));
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

                for (const i in clanData.clanMembers) {
                    let memberName;
                    try {
                        const memberObject = await client.users.fetch(clanData.clanMembers[i]);
                        memberName = memberObject.tag;
                    } catch (error) {
                        memberName = clanData.clanMembers[i];
                    }
                    formattedMembers += `${parseInt(i + 1)}. ${memberName}\n`;
                }
                clanEmbed.addField(`Clan Members`, `${formattedMembers}`);
                clanEmbed.addField(`Clan Additional Stats`, " These are stats you gain for being part of this clan. \n");
                clanEmbed.addField(`<:x2Gold_Ticket1hr:898287203246047252> Gold: ${clanData.stats.gold} %`, " \u200b  ", true);
                clanEmbed.addField(`<:x2ExpTicket1hr:898287128159592488> Exp: ${clanData.stats.exp} %`, " \u200b  ", true);
                clanEmbed.addField(`:hearts: Health Point: ${clanData.stats.hp} %   `, " \u200b  ", true);
                clanEmbed.addField(`:crossed_swords: Attack: ${clanData.stats.attack} %   `, " \u200b  ", true);
                clanEmbed.addField(`:shield: Defense: ${clanData.stats.defense} %   `, " \u200b  ", true);
                clanEmbed.addField(`💨 Speed: ${clanData.stats.speed} %   `, " \u200b  ", true);
                // clanData.clanMembers.map(x => clanEmbed.addField(`${x}`, `a`));
                message.channel.send({ embeds: [clanEmbed] });
            }
        } else {
            switch (args[0]) {
                case "create": {
                    console.log(clanName);
                    // Check if user is already in a clan
                    if (user.clan) {
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
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setDescription(`Are you sure you want to create a clan called ${clanName}?`)
                        .addFields(
                            { name: `You will be using 10,000 currency for this clan creation`, value: "\u200b" },
                        );
                    message.channel.send({ embeds: [clanEmbed], components: [row1] })
                        .then(botMessage => {
                            clanCreation(botMessage, clanName);
                        });
                }
                    break;

                default:
                    return message.channel.send(`You do not have a clan, join one now!`);
            }
        }
        // Display user clan when no arguments are given

    },
};

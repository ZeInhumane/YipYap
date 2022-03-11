const Discord = require('discord.js');
const User = require('../../models/user');
const titleCase = require('../../functions/titleCase');
require('dotenv').config();
var assert = require('assert');

module.exports = {
    name: "trade",
    description: "Trade stuff with other users, pretty self-explanatory.",
    syntax: `{user}`,
    aliases: ['tr'],
    category: "Economy",
    cooldown: 5,
    maxConcurrency: 1,
    async execute({ client, message, prefix }) {

        // A bunch of checks
        const tradeTarget = message.mentions.users.first();
        if (!tradeTarget) {
            return message.channel.send(`You need to mention a user to trade with.`);
        }

        const tradeTargetUser = await User.findOne({ userID: tradeTarget.id });
        if (!tradeTargetUser) {
            return message.channel.send(`The player you are trying to trade with has not set up a player yet! Do ${prefix}start to start.`);
        }

        if (tradeTarget.id === message.author.id) {
            return message.channel.send("You can't trade with yourself lmao");
        }

        const tradeTargetFilter = (interaction) => {
            interaction.deferUpdate();
            interaction.user.id === tradeTarget.id;
        };

        const tradeInitationMessage = await message.channel.send({
            content: `<@${tradeTarget.id}>, would you like to trade with <@${message.author.id}>?`,
            embeds: [{
                title: "Trade Request",
                color: 0xe1e1e1,
                description: `<@${tradeTarget.id}>, please accept or decline the trade request with <@${message.author.id}> to continue.`,
            }],
            components: [tradeRow],
        });

        const interaction = await tradeInitationMessage.awaitMessageComponent({ tradeTargetFilter, time: 60_000 })
            .catch(() => {
                return;
            });

        // Timed out or declined
        if (!interaction || interaction.customId === "decline" || interaction.customId !== "accept") {
            tradeInitationMessage.embeds[0].color = 0xFF0000;
            tradeInitationMessage.embeds[0].description = "The trade request has been declined";

            await tradeInitationMessage.edit({ embeds: [tradeInitationMessage.embeds[0]], components: [] });
            return;
        }

        if (interaction.user.id !== tradeTarget.id) return;

        // Generate new embed for trade start
        const embed = tradeInitationMessage.embeds[0];
        embed.color = 0xe1e1e1;
        embed.description = "Type `<#> item` to add to the trade.\nSeparate entries with `,` to add multiple items with a single message.\nThis trade session will expire in 5 minutes.";
        embed.fields = [
            {
                value: "```diff\n- Not Ready -\n```** **",
                name: `${message.author.tag}`,
                inline: true,
            },
            {
                value: "```diff\n- Not Ready -\n```** **",
                name: `${tradeTarget.tag}`,
                inline: true,
            },
        ];
        embed.footer = "You both must lock your items before proceeding to the next step";

        const tradeInitiatedMessage = await tradeInitationMessage.edit({ embeds: [embed], components: [tradeRowWithLock] });
        const successMsg = await handleTrade(client, message.author, tradeTarget, message, tradeInitiatedMessage);
    },
};

const tradeRow = new Discord.MessageActionRow()
    .addComponents(
        new Discord.MessageButton()
            .setCustomId('decline')
            .setLabel('❌')
            .setStyle('DANGER'),
        new Discord.MessageButton()
            .setCustomId('accept')
            .setLabel('✅')
            .setStyle('SUCCESS'),
    );

const tradeRowWithLock = new Discord.MessageActionRow()
    .addComponents(
        new Discord.MessageButton()
            .setCustomId('decline')
            .setLabel('❌')
            .setStyle('DANGER'),
        new Discord.MessageButton()
            .setCustomId('accept')
            .setLabel('✅')
            .setStyle('SUCCESS')
            .setDisabled(true),
        new Discord.MessageButton()
            .setCustomId('lock')
            .setLabel('🔒')
            .setStyle('PRIMARY'),
    );

const tradeRowConfirmation = new Discord.MessageActionRow()
    .addComponents(
        new Discord.MessageButton()
            .setCustomId('decline')
            .setLabel('❌')
            .setStyle('DANGER'),
        new Discord.MessageButton()
            .setCustomId('accept')
            .setLabel('✅')
            .setStyle('SUCCESS')
            .setDisabled(false),
        new Discord.MessageButton()
            .setCustomId('lock')
            .setLabel('🔒')
            .setStyle('PRIMARY'),
    );

async function handleTrade(client, tradeStarter, tradeTarget, message, tradeMessage) {
    let tradeIsActive = true, tradeIsCompleted = false;
    const time = 5 * 60 * 1000;

    // Start 10 minute timer
    setTimeout(() => tradeIsActive = false, time);

    let embed = tradeMessage.embeds[0];

    const trade = {
        [tradeStarter.id]: {
            items: {},
            locked: false,
            accepted: false,
        },
        [tradeTarget.id]: {
            items: {},
            locked: false,
            accepted: false,
        },
    };

    const tradeInteractionCollector = tradeMessage.createMessageComponentCollector({ componentType: 'BUTTON', time: time });

    const tradeMessageCollector = message.channel.createMessageCollector({ time: time });

    tradeInteractionCollector.on('collect', async (interaction) => {

        if (![tradeStarter.id, tradeTarget.id].includes(interaction.user.id)) return;

        embed = tradeMessage.embeds[0];
        if (interaction.customId === "decline") {
            // Update embed
            embed.color = 0xFF0000;
            embed.description = "The trade request has been declined";

            await tradeMessage.edit({ embeds: [embed], components: [] });
            tradeIsActive = false;
            tradeInteractionCollector.stop();
            tradeMessageCollector.stop();
            return;
        }

        if (interaction.customId === "lock") {
            // Check who locked in
            const tradeStarterLocked = interaction.user.id === tradeStarter.id;

            // Update status
            trade[interaction.user.id].locked = !trade[interaction.user.id].locked;
            if (!trade[interaction.user.id].locked && (trade[tradeStarter.id].accepted || trade[tradeTarget.id].accepted)) {
                // Reset accepted status if either user unlocked
                trade[tradeTarget.id].accepted = false;
                trade[tradeStarter.id].accepted = false;
            }

            // Update embed
            let temp = embed.fields[tradeStarterLocked ? 0 : 1].value.split("```");
            temp[1] = `diff\n${trade[interaction.user.id].locked ? '+' : '-'} ${trade[interaction.user.id].locked ? "Ready" : "Not Ready"} ${trade[interaction.user.id].locked ? '+' : '-'}\n`;
            embed.fields[tradeStarterLocked ? 0 : 1].value = temp.join("```");
            if (trade[tradeTarget.id].locked && !trade[tradeTarget.id].accepted) {
                temp = embed.fields[1].value.split("```");
                temp[1] = "diff\n+ Ready +\n";
                embed.fields[1].value = temp.join("```");
            }
            if (trade[tradeStarter.id].locked && !trade[tradeStarter.id].accepted) {
                temp = embed.fields[0].value.split("```");
                temp[1] = "diff\n+ Ready +\n";
                embed.fields[0].value = temp.join("```");
            }

            const msgActionRow = (trade[tradeStarter.id].locked && trade[tradeTarget.id].locked) ? tradeRowConfirmation : tradeRowWithLock;
            await tradeMessage.edit({ embeds: [embed], components: [msgActionRow] });
            return;
        }

        if (interaction.customId === "accept") {
            // Check who accepted
            const tradeStarterAccepted = interaction.user.id === tradeStarter.id;

            // Update status
            trade[interaction.user.id].accepted = !trade[interaction.user.id].accepted;

            // Update embed
            const temp = embed.fields[tradeStarterAccepted ? 0 : 1].value.split("```");
            temp[1] = `diff\n+ ${trade[interaction.user.id].accepted ? "Confirmed" : "Ready"} +\n`;
            embed.fields[tradeStarterAccepted ? 0 : 1].value = temp.join("```");

            // Check if trade completed
            if (trade[tradeStarter.id].accepted && trade[tradeTarget.id].accepted) {
                await tradeMessage.edit({ embeds: [embed], components: [] });

                tradeIsActive = false;
                const tradeResults = await tradeConfirmed(client, trade);
                if (tradeResults == 0) {
                    embed.description = `The trade has been completed.`;
                    embed.color = 0x00FF00;
                    await tradeMessage.edit({ embeds: [embed] });
                } else {
                    embed.description = "An error has occurred, please try again.";
                    embed.color = 0xFF0000;
                    await tradeMessage.edit({ embeds: [embed] });
                }

                tradeInteractionCollector.stop();
                tradeMessageCollector.stop();
                return;
            }

            await tradeMessage.edit({ embeds: [embed], components: [tradeRowConfirmation] });
            return;
        }
    });

    tradeMessageCollector.on('collect', async (msg) => {

        if (![tradeStarter.id, tradeTarget.id].includes(msg.author.id)) return;

        if (trade[msg.author.id].locked || trade[msg.author.id].accepted) return;

        const user = await User.findOne({ userID: msg.author.id });

        const args = msg.content.split(',');
        const items = await parseArguments(args);
        if (!items) return;

        const validItems = await parseItems(items, user, trade[msg.author.id].items);
        if (!validItems) return;

        for (const item of validItems) {
            if (!trade[msg.author.id].items[item.name]) {
                trade[msg.author.id].items[item.name] = item;
                continue;
            }

            if (trade[msg.author.id].items[item.name].quantity == item.quantity) {
                delete trade[msg.author.id].items[item.name];
                continue;
            }

            trade[msg.author.id].items[item.name].quantity += item.quantity;
        }

        embed = tradeMessage.embeds[0];
        const msgActionRow = tradeMessage.components[0];

        let fieldValueToEdit = embed.fields[msg.author.id === tradeStarter.id ? 0 : 1].value;
        fieldValueToEdit = fieldValueToEdit.split("** **");

        const tradeItems = Object.entries(trade[msg.author.id].items);
        fieldValueToEdit[1] = `\`\`\`${tradeItems.map(([itemName, itemInfo]) => `${itemInfo.quantity}x ${itemName}`).join("\n")}\`\`\``;
        if (fieldValueToEdit[1] === "``````") fieldValueToEdit[1] = "";

        embed.fields[msg.author.id === tradeStarter.id ? 0 : 1].value = fieldValueToEdit.join("** **");
        await tradeMessage.edit({ embeds: [embed], components: [msgActionRow] });
    });

    tradeMessageCollector.on('end', async () => {
        if (tradeIsCompleted) return;

        // Update embed
        if (tradeIsActive) {
            embed = tradeMessage.embeds[0];
            embed.color = 0xFF0000;
            embed.description = "The trade request has expired";
        }

        await tradeMessage.edit({ embeds: [embed], components: [] });
    });

    tradeInteractionCollector.on('end', async () => {
        if (tradeIsCompleted) return;

        // Update embed
        if (tradeIsActive) {
            embed = tradeMessage.embeds[0];
            embed.color = 0xFF0000;
            embed.description = "The trade request has expired";
        }

        await tradeMessage.edit({ embeds: [embed], components: [] });
    });
}

async function parseArguments(_arguments) {
    const items = [];
    for (let arg of _arguments) {

        arg = arg.trim();

        let [quantity, ...itemName] = arg.split(' ');
        quantity = parseInt(quantity), itemName = titleCase(itemName.join(' '));

        if (!quantity || !itemName) {
            return;
        }

        items.push({
            quantity,
            name: itemName,
        });
    }

    return items;
}

async function parseItems(itemsArray, user, userItemsInTrade) {
    itemsArray = itemsArray.filter(item => {

        return item.quantity > 0;

    }).filter(item => {

        if (item.name === "Gold") return true;

        return item.name in user.inv;

    }).filter(item => {

        if (item.quantity === userItemsInTrade[item.name]?.quantity) return true;

        if (item.name === "Gold") return user.currency >= item.quantity;

        return user.inv[item.name].quantity -
            (user.inv[item.name].listed ? user.inv[item.name].listed : 0) -
            (userItemsInTrade[item.name] ? userItemsInTrade[item.name].quantity : 0) -
            (user.inv[item.name]?.equipped ? 1 : 0) >= item.quantity;
    });

    return itemsArray;
}

async function tradeConfirmed(client, trade) {

    const session = await User.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' },
    };

    try {
        const transactionResults = await session.withTransaction(async () => {

            let [tradeStarter, tradeTarget] = Object.keys(trade);
            tradeStarter = await User.findOne({ userID: tradeStarter }).session(session);
            tradeTarget = await User.findOne({ userID: tradeTarget }).session(session);
            const users = {
                [tradeStarter.userID]: tradeStarter,
                [tradeTarget.userID]: tradeTarget,
            };

            if (!tradeStarter) {
                await session.abortTransaction();
                console.error("Transaction aborted [buyer not found].");
                return { success: false, message: "Transaction aborted [buyer not found].", code: 2 };
            }

            if (!tradeTarget) {
                await session.abortTransaction();
                console.error("Transaction aborted [seller not found].");
                return { success: false, message: "Transaction aborted [seller not found].", code: 3 };
            }

            console.log(trade);

            for (const user in trade) {
                for (const [itemName, itemInfo] of Object.entries(trade[user].items)) {
                    if (itemName === "Gold") {
                        assert.ok(users[user].currency >= itemInfo.quantity, "Not enough gold");
                    } else {
                        if (!users[user].inv[itemName]) continue;

                        console.log(users[user].inv[itemName].quantity,
                            users[user].inv[itemName].listed,
                            users[user].inv[itemName].equipped,
                            itemInfo.quantity);

                        assert.ok(users[user].inv[itemName].quantity -
                            (users[user].inv[itemName].listed ? users[user].inv[itemName] : 0) -
                            (users[user].inv[itemName].equipped ? 1 : 0) >=
                            itemInfo.quantity, "Not enough items in inventory");
                    }
                }
            }

            for (const [itemName, itemInfo] of Object.entries(trade[tradeStarter.userID].items)) {
                // Special case for gold since it isn't an 'item'
                if (itemName === "Gold") {
                    tradeStarter.currency -= itemInfo.quantity;
                    tradeTarget.currency += itemInfo.quantity;

                    assert.ok(tradeStarter.currency >= 0, "Negative gold");

                    await tradeStarter.save({ session });
                    await tradeTarget.save({ session });
                    continue;
                }

                // Remove items from starter
                tradeStarter.inv[itemName].quantity -= itemInfo.quantity;
                assert.ok(tradeStarter.inv[itemName].quantity >= 0, "Negative item quantity");
                if (!tradeTarget.inv[itemName]) {
                    // Copy item to target
                    tradeTarget.inv[itemName] = tradeStarter.inv[itemName];

                    // Delete if 0 quantity so doesn't take up redundant space, especially for unique items
                    if (tradeStarter.inv[itemName].quantity === 0) {
                        delete tradeStarter.inv[itemName];
                    }

                    // Set listed to 0, quantity to transaction amount
                    tradeTarget.inv[itemName].listed = 0;
                    tradeTarget.inv[itemName].quantity = 0;
                }

                tradeTarget.inv[itemName].quantity += itemInfo.quantity;

                tradeTarget.markModified("inv");
                tradeStarter.markModified("inv");

                await tradeStarter.save({ session });
                await tradeTarget.save({ session });
            }

            for (const [itemName, itemInfo] of Object.entries(trade[tradeTarget.userID].items)) {
                // Special case for gold since it isn't an 'item'
                if (itemName === "Gold") {
                    tradeStarter.currency += itemInfo.quantity;
                    tradeTarget.currency -= itemInfo.quantity;

                    assert.ok(tradeTarget.currency >= 0, "Negative gold");

                    await tradeStarter.save({ session });
                    await tradeTarget.save({ session });
                    continue;
                }

                // Remove items from target
                tradeTarget.inv[itemName].quantity -= itemInfo.quantity;
                assert.ok(tradeTarget.inv[itemName].quantity >= 0, "Negative item quantity");
                if (!tradeStarter.inv[itemName]) {
                    // Copy item to starter
                    tradeStarter.inv[itemName] = tradeTarget.inv[itemName];

                    // Delete if 0 quantity so doesn't take up redundant space, especially for unique items
                    if (tradeTarget.inv[itemName].quantity === 0) {
                        delete tradeTarget.inv[itemName];
                    }

                    // Set listed to 0, quantity to transaction amount
                    tradeStarter.inv[itemName].listed = 0;
                    tradeStarter.inv[itemName].quantity = 0;
                }

                tradeStarter.inv[itemName].quantity += itemInfo.quantity;

                tradeTarget.markModified("inv");
                tradeStarter.markModified("inv");

                await tradeStarter.save({ session });
                await tradeTarget.save({ session });
            }

        }, transactionOptions);

        if (!transactionResults) {
            console.log("Transaction failed [unknown reason].");
            return { success: false, message: "Transaction failed [unknown reason].", code: 5 };
        }

        console.log("Transaction was successfully created.");
        return 0;

    } catch (e) {
        console.log(e);
        console.log("The transaction was aborted.");
    } finally {
        session.endSession();
    }
}
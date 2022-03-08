const Discord = require('discord.js');
const User = require('../../models/user');
const checkChannel = require('../../functions/maxConcurrency');
const titleCase = require('../../functions/titleCase');

module.exports = {
    name: "trade",
    description: "Trade stuff with other users, pretty self-explanatory.",
    syntax: `{user}`,
    aliases: ['tr'],
    category: "Economy",
    cooldown: 5,
    maxConcurrency: 1,
    async execute({ client, message, prefix }) {

        const results = await checkChannel(this, message.channel.id, {});
        if (!results.active) {
            return message.channel.send(`There is an ongoing trade in this channel.`);
        }

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

        // Generate new embed for trade start
        const embed = tradeInitationMessage.embeds[0];
        embed.color = 0x00FF00;
        embed.description = "Type `<#> item` to add to the trade.\nSeparate entries with `,` to add multiple items with a single message.\nThis trade session will expire in 10 minutes.";
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
        await handleTrade(client, message.author, tradeTarget, message, tradeInitiatedMessage);
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

async function handleTrade(client, tradeStarter, tradeTarget, message, tradeMessage) {
    let tradeIsActive = true, tradeIsCompleted = false;
    // Start 10 minute timer
    setTimeout(() => tradeIsActive = false, 60_000 * 10);

    // Filter for interactions from trade initiator
    const tradeInteractionFilter = (interaction) => {
        interaction.deferUpdate();
        interaction.user.id === tradeStarter.id || interaction.user.id === tradeTarget.id;
    };

    const tradeMessageFilter = (msg) => {
        msg.author.id === tradeStarter.id || msg.author.id === tradeTarget.id;
    };

    const embed = tradeMessage.embeds[0];

    const trade = {
        [tradeStarter.id]: {
            items: [],
            locked: false,
            accepted: false,
        },
        [tradeTarget.id]: {
            items: [],
            locked: false,
            accepted: false,
        },
    };

    const tradeInteractionCollector = tradeMessage.createMessageComponentCollector({ componentType: 'BUTTON', filter: tradeInteractionFilter, time: 60_000 * 10 });

    const tradeMessageCollector = message.channel.createMessageCollector({ filter: tradeMessageFilter, time: 60_000 * 10 });

    tradeInteractionCollector.on('collect', async (interaction) => {

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
            embed.fields[tradeStarterLocked ? 0 : 1].value = `\`\`\`diff\n${trade[interaction.user.id].locked ? '+' : '-'} ${trade[interaction.user.id].locked ? "Ready" : "Not Ready"} ${trade[interaction.user.id].locked}\n\`\`\``;
            tradeRowWithLock[1].disabled = trade[tradeStarter.id].locked && trade[tradeTarget.id].locked;

            await tradeMessage.edit({ embeds: [tradeMessage.embeds[0]], components: [tradeRowWithLock] });
            return;
        }

        if (interaction.customId === "accept") {
            // Update status
            trade[interaction.user.id].accepted = !trade[interaction.user.id].accepted;

            // Update embed
            embed.fields[trade[interaction.user.id].accepted ? 0 : 1].value = `\`\`\`diff\n${trade[interaction.user.id].accepted ? '+' : '-'} ${trade[interaction.user.id].accepted ? "Confirmed" : "Ready"} ${trade[interaction.user.id].accepted}\n\`\`\``;

            // Check if trade completed
            if (trade[tradeStarter.id].accepted && trade[tradeTarget.id].accepted) {
                // //////////////////////////
                // HANDLE TRADE COMPLETION //
                // //////////////////////////
            }

            await tradeMessage.edit({ embeds: [tradeMessage.embeds[0]], components: [tradeRowWithLock] });
            return;
        }
    });

    tradeMessageCollector.on('collect', async (msg) => {


        const args = msg.content.split(',');

        // ///////////////////////
        // HANDLE ITEM ADDITION //
        // ////////////////////////

        const items = await parseArguments(args);

    });
}

async function parseArguments(_arguments) {
    const items = [];
    for (const arg of _arguments) {

        const item = await parseItem(titleCase(arg.trim()));
        if (item) {
            items.push(item);
        }
    }
}

async function parseItem(itemName) {
    // hi
}

async function createTransaction(client, buyerID, sellerID, listingID) {

    await client.mongoUtils.client.connect();

    const session = client.mongoUtils.client.startSession();

    const usersCollection = await client.mongoUtils.getCollection('users');
    const listingsCollection = await client.mongoUtils.getCollection('listings');

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' },
    };

    try {
        const transactionResults = await session.withTransaction(async () => {

            const listing = await listingsCollection.findOne({ listingID }, { session });
            const buyer = await usersCollection.findOne({ userID: buyerID }, { session });
            const seller = await usersCollection.findOne({ userID: sellerID }, { session });
            const txCost = listing.itemCost * listing.quantity;

            if (!listing) {
                await session.abortTransaction();
                console.error("Transaction aborted [listing not found].");
                return { success: false, message: "Transaction aborted [listing not found].", code: 1 };
            }

            if (!buyer) {
                await session.abortTransaction();
                console.error("Transaction aborted [buyer not found].");
                return { success: false, message: "Transaction aborted [buyer not found].", code: 2 };
            }

            if (!seller) {
                await session.abortTransaction();
                console.error("Transaction aborted [seller not found].");
                return { success: false, message: "Transaction aborted [seller not found].", code: 3 };
            }

            if (buyer.currency < txCost) {
                await session.abortTransaction();
                console.error("Transaction aborted [buyer does not have enough currency].");
                return { success: false, message: "Transaction aborted [buyer does not have enough currency].", code: 4 };
            }

            await listingsCollection.deleteOne({ listingID }, { session });

            await usersCollection.updateOne({ userID: buyerID },
                { $inc: { currency: -txCost } },
                { session },
            );

            await usersCollection.updateOne({ userID: sellerID },
                { $inc: { currency: txCost } },
                { session },
            );

            listing.item.quantity = listing.quantity;
            listing.item.listed = 0;

            seller.inv[listing.itemName].listed -= listing.quantity;
            seller.inv[listing.itemName].quantity += listing.quantity;

            if (!buyer.inv[listing.itemName]) {
                await usersCollection.updateOne({ userID: buyerID },
                    { $set: { [`inv.${listing.itemName}`]: listing.item } },
                    { session },
                );
            } else {
                await usersCollection.updateOne({ userID: buyerID },
                    { $inc: { [`inv.${listing.itemName}.quantity`]: listing.quantity } },
                    { session },
                );
            }

            await usersCollection.updateOne({ userID: sellerID },
                {
                    $inc: {
                        [`inv.${listing.itemName}.quantity`]: -listing.quantity,
                        [`inv.${listing.itemName}.listed`]: -listing.quantity,
                    },
                },
                { session },
            );

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
        await session.endSession();
        await client.mongoUtils.client.close();
    }
}
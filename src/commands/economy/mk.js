const Listing = require('../../models/listing');
const Discord = require('discord.js');
const titleCase = require('../../functions/titleCase');
const mongoose = require('mongoose');
const marketUtils = require('./utils/marketUtils');
var assert = require('assert');
const User = require('../../models/user');
require('dotenv').config();

module.exports = {
    name: "mk",
    description: "Stuff.",
    syntax: `buy {item name} {quantity}\nmk sell {item name} {quantity}\nmk remove {item name}\nmk list`,
    aliases: [''],
    category: "Economy",
    cooldown: 5,
    async execute({ client, message, args, user }) {

        const option = args.shift()?.toLowerCase();
        if (!option) {
            return;
        }

        await handleOption({ client, message, args, user, option });
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

const listingNotAvailable = {
    title: "Error :no_entry:",
    description: "This item isn't available in the market! Either you bought it already, it might've just been bought, or you might've inserted the wrong listing ID.",
    footer: "If you require assistance with this command, please type use help for more info!",
    color: '#0099ff',
    author: true,
};

const confirmation = {
    title: "Confirmation <:MarinHype:948598624156274738>",
    color: '#0099ff',
};

const confirmationFailed = {
    title: "Request Declined... ",
    description: "lmeow this item has just been sold to another user",
    color: '#0099ff',
};

const confirmationFailedNotEnoughMoney = {
    title: "Request Declined... ",
    description: "lmwo you can't afford this item",
    color: '#0099ff',
};

const unknownError = {
    title: "Error :no_entry:",
    description: "An unknown error has occurred. Please try again later.",
    footer: "If you require assistance with this command, please type use help for more info!",
};

const listingConfirmed = {
    title: "Success! :white_check_mark:",
    color: '#0099ff',
};

const listingEmbed = {
    title: "Market Listing :scroll:",
    description: "All the items that you listed in the Global Market are shown below!\n\n",
    color: '#0099ff',
};

const listingRemoved = {
    title: "Success! :white_check_mark:",
    description: "You have successfully removed this listing from the market!",
    color: '#0099ff',
};

const confirmationRow = new Discord.MessageActionRow()
    .addComponents(
        new Discord.MessageButton()
            .setCustomId('confirm')
            .setLabel('✅')
            .setStyle('SUCCESS'),
        new Discord.MessageButton()
            .setCustomId('decline')
            .setLabel('❌')
            .setStyle('DANGER'),
    );

async function handleOption({ client, message, args, user, option }) {
    switch (option) {
        case 'buy':
            handleBuy({ client, message, args, user });
            break;
        case 'sell':
            handleSell({ client, message, args, user });
            break;
        case 'list':
            handleList({ message });
            break;
        case 'remove':
            handleRemove({ message, args, user });
            break;
        default:
            return;
    }
}

async function handleBuy({ client, message, args, user }) {
    if (!args[0] || !parseInt(args[0])) return message.channel.send('Please enter a valid listing ID.');

    const listings = await Listing.find({ listingID: args[0] });
    if (!listings.length) {
        listingNotAvailable.author = { name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) };
        await message.$incchannel.send({ embeds: [listingNotAvailable] });
    }

    const listing = listings[0];
    // if (listing.userID === message.author.id) return message.channel.send('You cannot buy your own listing. Use `mk remove {listing ID}` instead.');

    if (listing.itemCost * listing.itemQuantity > user.currency) return message.channel.send('You do not have enough gold to buy this listing.');

    await confirmationBuy(client, message, user, listing);
    return;
}

async function confirmationBuy(client, message, buyer, listing) {

    const channel = message.channel;
    const buyerID = buyer.userID;
    const sellerID = listing.userID;
    const listingID = listing.listingID;
    confirmation.description = marketUtils.returnMessage({ listing, type: listing.type, messageType: "confirmBuy" });
    const confirmationMessage = await message.channel.send({ embeds: [confirmation], components: [confirmationRow] });

    const filter = btnInt => {
        btnInt.deferUpdate();
        return btnInt.user.id === message.author.id;
    };

    await confirmationMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
        .then(async int => {
            const selection = int.customId;

            if (selection === 'decline') {
                await confirmationMessage.delete();
                return;
            }

            if (selection === 'confirm') {
                try {
                    await confirmationMessage.delete();

                    const results = await createTransaction(client, buyerID, sellerID, listingID);
                    if (results != 0) {
                        switch (results.code) {
                            case 1:
                                confirmationFailed.author = { name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) };
                                await channel.send({ embeds: [confirmationFailed] });
                                return;

                            case 4:
                                confirmationFailedNotEnoughMoney.author = { name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) };
                                await channel.send({ embeds: [confirmationFailedNotEnoughMoney] });
                                return;

                            default:
                                unknownError.author = { name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) };
                                await channel.send({ embeds: [unknownError] });
                                return;
                        }
                    }

                    listingConfirmed.description = marketUtils.returnMessage({ listing, type: listing.type, info: listing.item, messageType: 'purchase' });

                    await channel.send({ embeds: [listingConfirmed] });

                    return;
                } catch (err) {
                    unknownError.author = { name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) };
                    await channel.send({ embeds: [unknownError] });
                    return;
                }
            }
            return;
        })
        .catch(async (err) => {
            if (err.code == 'INTERACTION_COLLECTOR_ERROR' || err.code == 10008) {
                return;
            }

            const embed = confirmationMessage.embeds[0];
            embed.color = '#FF0000';
            confirmationMessage.edit({ embeds: [embed], components: [] });
            return;
        });
}

async function handleSell({ client, message, args, user }) {
    let { itemQuantity, itemName, itemPrice } = parseInt(args[0]) ? {
        itemQuantity: parseInt(args.shift()),
        itemPrice: parseInt(args[args.length - 1]) ? parseInt(args.pop()) : null,
        itemName: args.join(' '),
    } : {
        itemQuantity: 1,
        itemPrice: parseInt(args[args.length - 1]) ? parseInt(args.pop()) : null,
        itemName: args.join(' '),
    };
    if (!itemName) return message.channel.send('Please enter a valid item name.');
    itemName = titleCase(itemName);

    if (!itemPrice) return message.channel.send('Please enter a valid item price.');

    const items = Object.entries(user.inv);
    for (const [name, info] of items) {
        if (name != itemName) continue;

        if (info.quantity - info.listed < itemQuantity) return message.channel.send('You do not have enough of this item to sell.');

        if (info.equipped) return message.channel.send('You cannot sell an equipped item.');

        await confirmationSell({ client, message, user, itemQuantity, itemName, itemPrice, info });

        return;
    }

    return message.channel.send('You do not have this item to sell.');
}

async function confirmationSell({ client, message, user, itemQuantity, itemName, itemPrice, info }) {

    const channel = message.channel;
    confirmation.description = marketUtils.returnMessage({ info, itemQuantity, itemName, itemPrice, type: info.type, messageType: "sell" });

    const confirmationMessage = await message.channel.send({ embeds: [confirmation], components: [confirmationRow] });

    const filter = btnInt => {
        btnInt.deferUpdate();
        return btnInt.user.id === message.author.id;
    };

    await confirmationMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
        .then(async int => {
            const selection = int.customId;

            if (selection === 'decline') {
                await confirmationMessage.delete();
                return;
            }

            if (selection === 'confirm') {

                await confirmationMessage.delete();
                const userID = user.userID;

                const results = await createMarketListing(client, userID, { quantity: itemQuantity, name: itemName, price: itemPrice, info });

                if (!results || !results.success) {
                    return channel.send('There was an error creating your listing.');
                }

                const listing = results.transactionResults.listing;

                listingConfirmed.description = marketUtils.returnMessage({ listing, type: listing.type, info: listing.item, messageType: 'listingConfirmed' });

                await channel.send({ embeds: [listingConfirmed] });
                return;
            }

            return;
        })
        .catch(async (err) => {
            if (err.code == 'INTERACTION_COLLECTOR_ERROR') {
                return;
            }

            const embed = confirmationMessage.embeds[0];
            embed.color = '#FF0000';
            try {
                confirmationMessage.edit({ embeds: [embed], components: [] });
            } catch (e) {
                return;
            }

            return;
        });
}

async function handleList({ message }) {
    const listings = await Listing.find({ userID: message.author.id });

    let currentPage = 1;
    const itemsPerPage = 10;
    const totalListings = listings.length;
    const totalPages = Math.ceil(totalListings / itemsPerPage) || 1;
    const itemsOnCurrentPage = currentPage == totalPages ? totalListings - ((currentPage - 1) * itemsPerPage) : itemsPerPage;

    listingEmbed.footer = { text: `Page ${currentPage} | Items: ${itemsOnCurrentPage} / ${totalListings}.` };
    listingEmbed.description = "All the items that you listed in the Global Market are shown below!\n\n";

    listingEmbed.description += listings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(listing => {
        return marketUtils.returnMessage({ listing, type: listing.type, messageType: "listing" });
    })
        .join('\n\n');

    listingEmbed.color = '#0099ff';

    const listMessage = await message.channel.send({ embeds: [listingEmbed], components: [row] });

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

                listingEmbed.description = listingEmbed.description.split('\n\n')[0] + '\n\n';
                if (currentPage > totalPages || currentPage < 1) {
                    currentPage = 1;
                }

                listingEmbed.description += listings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(listing => {
                    return marketUtils.returnMessage({ listing, type: listing.type, messageType: "listing" });
                })
                    .join('\n\n');

                const itemsOnCurrentPage = currentPage == totalPages ? totalListings - ((currentPage - 1) * itemsPerPage) : itemsPerPage;

                listingEmbed.footer = { text: `Page ${currentPage} | Items: ${itemsOnCurrentPage} / ${totalListings}.` };

                listMessage.edit({ embeds: [listingEmbed], components: [row] });
            })
            .catch(async (err) => {
                listingEmbed.color = '#FF0000';
                if (err.code == 'INTERACTION_COLLECTOR_ERROR') {
                    return;
                }
                listMessage.edit({ embeds: [listingEmbed] });

                isExpired = true;
            });
    }
}

async function handleRemove({ message, args, user }) {
    if (!args[0] || !parseInt(args[0])) return message.channel.send('Please enter a valid listing ID.');

    const listings = await Listing.find({ listingID: args[0] });
    if (!listings.length) return message.channel.send('This listing does not exist.');

    const listing = listings[0];
    if (listing.userID !== message.author.id) return message.channel.send('You do not own this listing.');

    await confirmationRemove({ message, listing, user });
}

async function confirmationRemove({ message, listing, user }) {
    confirmation.description = marketUtils.returnMessage({ listing, type: listing.type, messageType: "confirmRemove" });

    const confirmationMessage = await message.channel.send({ embeds: [confirmation], components: [confirmationRow] });

    const filter = btnInt => {
        btnInt.deferUpdate();
        return btnInt.user.id === message.author.id;
    };

    await confirmationMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
        .then(async int => {
            const selection = int.customId;

            if (selection === 'decline') {
                await confirmationMessage.delete();
                return;
            }

            if (selection === 'confirm') {
                await confirmationMessage.delete();

                try {
                    await Listing.find({ _id: listing._id })
                        .remove()
                        .exec();

                    user.inv[listing.itemName].listed -= listing.quantity;
                    user.markModified('inv');
                    await user.save();

                    await message.channel.send({ embeds: [listingRemoved] });

                } catch (err) {
                    return message.channel.send('An error occurred while trying to remove this listing.');
                }

                return;
            }

            return;
        })
        .catch(async (err) => {
            if (err.code == 'INTERACTION_COLLECTOR_ERROR') {
                return;
            }

            const embed = confirmationMessage.embeds[0];
            embed.color = '#FF0000';
            confirmationMessage.edit({ embeds: [embed], components: [] });
            return;
        });
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

async function createMarketListing(client, listerID, item) {

    const db = mongoose.createConnection(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const session = await db.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' },
    };


    try {
        let listing;

        const transactionResults = await session.withTransaction(async () => {

            const lister = await User.findOne({ userID: listerID }).session(session);

            lister.inv[item.name].listed ? (

                lister.inv[item.name].listed += item.quantity

            ) : (

                lister.inv[item.name].listed = item.quantity

            );

            lister.markModified('inv');
            await lister.save();

            assert.ok(!lister.inv[item.name].equipped, "You cannot list an item that is equipped.");

            listing = new Listing({
                _id: mongoose.Types.ObjectId(),
                userID: listerID,
                itemCost: item.price,
                itemName: item.name,
                quantity: item.quantity,
                item: item.info,
                type: item.info.type,
            });

            await listing.save();

        }, transactionOptions);

        if (!transactionResults) {
            console.log("Transaction failed [unknown reason].");
            return { success: false, message: "Transaction failed [unknown reason].", code: 5 };
        }

        transactionResults.listing = listing;
        console.log(`${JSON.stringify(transactionResults, null, 2)}`);


        console.log("Transaction was successfully created.");
        return { success: true, message: "Transaction was successfully created.", transactionResults };

    } catch (e) {
        console.log(e);
        console.log("The transaction was aborted.");
    } finally {
        await session.endSession();
        await client.mongoUtils.client.close();
    }
}
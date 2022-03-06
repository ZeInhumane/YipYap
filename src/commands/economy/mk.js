const Listing = require('../../models/listing');
const Discord = require('discord.js');
const titleCase = require('../../functions/titleCase');
const mongoose = require('mongoose');
const marketUtils = require('./utils/marketUtils');
const User = require('../../models/user');
const user = require('../../models/user');

module.exports = {
    name: "mk",
    description: "Stuff.",
    syntax: `buy {item name} {quantity}\nmk sell {item name} {quantity}\nmk remove {item name}\nmk list`,
    aliases: [''],
    category: "Economy",
    cooldown: 5,
    async execute({ message, args, user }) {

        let option = args.shift()?.toLowerCase();
        if (!option) {
            return;
        }

        await handleOption({ message, args, user, option })
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

listingNotAvailable = {
    title: "Error :no_entry:",
    description: "Summoner, this card isn't available in the market! Either you own the card already, it might've just been bought, or you might've inserted the wrong card ID.",
    footer: "If you require assistance with this command, please type .help mk buy for more info!",
    color: '#0099ff',
    author: true
}

confirmation = {
    title: "Confirmation <:MarinHype:948598624156274738>",
    color: '#0099ff'
}

confirmationFailed = {
    title: "Request Declined... ",
    description: "Summoner, how unfortunate! This card has just been sold to another user!",
    color: '#0099ff'
}

listingConfirmed = {
    title: "Success! :white_check_mark:",
    color: '#0099ff'
}

listingEmbed = {
    title: "Market Listing :scroll:",
    description: "All the items that you listed in the Global Market are shown below!\n\n",
    color: '#0099ff'
}

listingRemoved = {
    title: "Success! :white_check_mark:",
    description: "You have successfully removed this listing from the market!",
    color: '#0099ff'
}

confirmationRow = new Discord.MessageActionRow()
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

async function handleOption({ message, args, user, option }) {
    switch (option) {
        case 'buy':
            handleBuy({ message, args, user });
            break;
        case 'sell':
            handleSell({ message, args, user });
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

async function handleBuy({ message, args, user }) {
    if (!args[0] || !parseInt(args[0])) return message.channel.send('Please enter a valid listing ID.');

    let listings = await Listing.find({ listingID: args[0] });
    if (!listings.length) return message.channel.send('This listing does not exist.');

    let listing = listings[0];
    if (listing.userID === message.author.id) return message.channel.send('You cannot buy your own listing. Use `mk remove {listing ID}` instead.');

    if (listing.itemCost * listing.itemQuantity > user.currency) return message.channel.send('You do not have enough gold to buy this listing.');

    await confirmationBuy(message, user, listing);
    return;
}

async function confirmationBuy(message, buyer, listing) {

    const channel = message.channel;
    const buyerID = message.author.id;
    const sellerID = listing.userID;
    const listingID = listing.listingID;
    confirmation.description = marketUtils.returnMessage({ listing, type: listing.type, messageType: "confirmBuy" });

    confirmationMessage = await message.channel.send({ embeds: [confirmation], components: [confirmationRow] });

    const filter = btnInt => {
        btnInt.deferUpdate();
        return btnInt.user.id === message.author.id;
    };

    await confirmationMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
        .then(async int => {
            console.log(listing);
            const selection = int.customId;

            if (selection === 'decline') {
                await confirmationMessage.delete();
                return;
            }

            if (selection === 'confirm') {
                try {
                    await confirmationMessage.delete();

                    // Delete listing
                    await Listing.deleteOne({ listingID })
                    console.log(`Deleted listing ${listingID}`);

                    // Update buyer currency
                    tx = listing.itemCost * listing.quantity;
                    if (buyer.currency < tx) {
                        return message.channel.send('You do not have enough gold to buy this listing.');
                    }
                    buyer.currency -= tx;
                    buyer.markModified('currency');
                    await buyer.save();

                    // Update seller
                    let seller = await User.findOne({ userID: sellerID });
                    seller.inv[listing.itemName].quantity -= listing.quantity
                    seller.inv[listing.itemName].listed -= listing.quantity;
                    seller.markModified('inv');
                    await seller.save();

                    seller.currency ? seller.currency += tx : seller.currency = tx;
                    seller.markModified('currency');
                    await seller.save();

                    // Reset item
                    listing.item.quantity = listing.quantity;
                    listing.item.listed = 0;

                    // Update user
                    // If null, create new item, otherwise add to existing quantity
                    if (!buyer.inv[listing.itemName]) {
                        buyer.inv[listing.itemName] = listing.item;
                    }
                    buyer.inv[listing.itemName].quantity += listing.quantity;
                    buyer.markModified('inv');
                    await buyer.save();

                    listingConfirmed.description = marketUtils.returnMessage({ listing, type: listing.type, info: listing.item, messageType: 'purchase' });

                    await channel.send({ embeds: [listingConfirmed] });

                    return;
                } catch (err) {
                    console.log(err);
                    return message.channel.send('An error occurred.');
                }
            }
            return;
        })
        .catch(async (err) => {
            console.log(err, err.code);
            if (err.code == 'INTERACTION_COLLECTOR_ERROR' || err.code == 10008) {
                return;
            }

            embed = confirmationMessage.embeds[0];
            embed.color = '#FF0000';
            confirmationMessage.edit({ embeds: [embed], components: [] });
            return;
        });
}

async function handleSell({ message, args, user }) {
    let { itemQuantity, itemName, itemPrice } = parseInt(args[0]) ? {
        itemQuantity: parseInt(args[0]),
        itemName: args.slice(1, args.length - 1).join(' '),
        itemPrice: parseInt(args[args.length - 1])
    } : {
        itemQuantity: 1,
        itemName: args.slice(0, args.length > 1 ? args.length - 1 : 1).join(' '),
        itemPrice: parseInt(args[args.length - 1])
    };

    console.log(args[0], args[1], args[2]);
    console.log(itemQuantity, itemName, itemPrice);

    if (!itemName) return message.channel.send('Please enter a valid item name.');
    itemName = titleCase(itemName);

    if (!itemPrice) return message.channel.send('Please enter a valid item price.');

    items = Object.entries(user.inv)
    for (const [name, info] of items) {
        if (name != itemName) continue;

        if (info.quantity - info.listed < itemQuantity) return message.channel.send('You do not have enough of this item to sell.');

        await confirmationSell({ message, user, itemQuantity, itemName, itemPrice, info });

        return;
    }

    return message.channel.send('You do not have this item to sell.');
}

async function confirmationSell({ message, user, itemQuantity, itemName, itemPrice, info }) {

    confirmation.description = marketUtils.returnMessage({ info, itemQuantity, itemName, itemPrice, type: info.type, messageType: "sell" });

    confirmationMessage = await message.channel.send({ embeds: [confirmation], components: [confirmationRow] });

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

                user.inv[itemName].listed ? user.inv[itemName].listed += itemQuantity : user.inv[itemName].listed = itemQuantity;
                user.markModified('inv');
                await user.save();

                const listing = new Listing({
                    _id: mongoose.Types.ObjectId(),
                    userID: message.author.id,
                    itemCost: itemPrice,
                    itemName,
                    quantity: itemQuantity,
                    item: info,
                    type: info.type
                });

                await listing.save()
                    .then(result => console.log(`A new listing was created by ${result._doc.userID}`))
                    .catch(err => console.error(err));

                listingConfirmed.description = marketUtils.returnMessage({ listing, type: listing.type, info: listing.item, messageType: 'listingConfirmed' });

                await message.channel.send({ embeds: [listingConfirmed] });

                return;
            }

            return
        })
        .catch(async (err) => {
            if (err.code == 'INTERACTION_COLLECTOR_ERROR') {
                return;
            }

            embed = confirmationMessage.embeds[0];
            embed.color = '#FF0000';
            confirmationMessage.edit({ embeds: [embed], components: [] });
            return;
        });
}

async function handleList({ message }) {
    let listings = await Listing.find({ userID: message.author.id });

    let currentPage = 1;
    const itemsPerPage = 10;
    const totalListings = listings.length;
    const totalPages = Math.ceil(totalListings / itemsPerPage) || 1;
    let itemsOnCurrentPage = currentPage == totalPages ? totalListings - ((currentPage - 1) * itemsPerPage) : itemsPerPage;

    listingEmbed.footer = { text: `Page ${currentPage} | Items: ${itemsOnCurrentPage} / ${totalListings}.` };
    listingEmbed.description = "All the items that you listed in the Global Market are shown below!\n\n";

    listingEmbed.description += listings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(listing => {
        return marketUtils.returnMessage({ listing, type: listing.type, messageType: "listing" });
    })
        .join('\n\n');

    listingEmbed.color = '#0099ff';

    listMessage = await message.channel.send({ embeds: [listingEmbed], components: [row] })

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

                let itemsOnCurrentPage = currentPage == totalPages ? totalListings - ((currentPage - 1) * itemsPerPage) : itemsPerPage;

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

async function handleRemove({ message, args }) {
    if (!args[0] || !parseInt(args[0])) return message.channel.send('Please enter a valid listing ID.');

    let listings = await Listing.find({ listingID: args[0] });
    if (!listings.length) return message.channel.send('This listing does not exist.');

    let listing = listings[0];
    if (listing.userID !== message.author.id) return message.channel.send('You do not own this listing.');

    await confirmationRemove({ message, listing });
}

async function confirmationRemove({ message, listing }) {
    confirmation.description = marketUtils.returnMessage({ listing, type: listing.type, messageType: "confirmRemove" });

    confirmationMessage = await message.channel.send({ embeds: [confirmation], components: [confirmationRow] });

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

                    user.inv[itemName].listed -= itemQuantity;
                    user.markModified('inv');
                    await user.save();

                    await message.channel.send({ embeds: [listingRemoved] });

                } catch (err) {
                    return message.channel.send('An error occurred while trying to remove this listing.');
                }

                return;
            }

            return
        })
        .catch(async (err) => {
            if (err.code == 'INTERACTION_COLLECTOR_ERROR') {
                return;
            }

            embed = confirmationMessage.embeds[0];
            embed.color = '#FF0000';
            confirmationMessage.edit({ embeds: [embed], components: [] });
            return;
        });
}

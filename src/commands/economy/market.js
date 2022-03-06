const Listing = require('../../models/listing');
const titleCase = require('../../functions/titleCase');
const Discord = require('discord.js');
const findPartialItem = require('../../functions/findPartialItem');
const marketUtils = require('./utils/marketUtils');
const mongoose = require('mongoose');

module.exports = {
    name: "market",
    description: "Stuff.",
    syntax: `{filters}`,
    aliases: [''],
    category: "Economy",
    cooldown: 5,
    async execute({ message, args }) {

        let filters = await parseArguments(args);

        let { names, rarities, types, ascensions } = await parseFilters(filters);

        let listings = await Listing.find({}).sort({ itemCost: 1 });
        listings = listings.filter(listing => {
            if (!names || !names.size) return true;

            if (!names.has(listing.itemName)) return false;

            return true;
        }).filter(listing => {
            if (!rarities) return true;

            if (!rarities.has(listing.item.rarity)) return false;

            return true;
        }).filter(listing => {
            if (!types) return true;

            if (!types.has(listing.itemType)) return false;

            return true;
        }).filter(listing => {
            if (!ascensions || !ascensions.size) return true;

            if (!ascensions.has(listing.item.ascension)) return false;

            return true;
        })

        let currentPage = 1;
        const itemsPerPage = 10;
        const totalListings = listings.length;
        const totalPages = Math.ceil(totalListings / itemsPerPage) || 1;
        let itemsOnCurrentPage = currentPage == totalPages ? totalListings - ((currentPage - 1) * itemsPerPage) : itemsPerPage;

        marketListing.footer = { text: `Page ${currentPage} | Items: ${itemsOnCurrentPage} / ${totalListings}.` };
        marketListing.description = "All the items that you listed in the Global Market are shown below!\n\n";

        marketListing.description += listings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(listing => {
            return marketUtils.returnMessage({ listing, type: listing.type, messageType: "listing" });
        })
            .join('\n\n');

        marketListing.color = '#0099ff';

        listMessage = await message.channel.send({ embeds: [marketListing], components: [row] })

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

                    marketListing.description = marketListing.description.split('\n\n')[0] + '\n\n';
                    if (currentPage > totalPages || currentPage < 1) {
                        currentPage = 1;
                    }

                    marketListing.description += listings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(listing => {
                        return marketUtils.returnMessage({ listing, type: listing.type, messageType: "listing" });
                    })
                        .join('\n\n');

                    let itemsOnCurrentPage = currentPage == totalPages ? totalListings - ((currentPage - 1) * itemsPerPage) : itemsPerPage;

                    marketListing.footer = { text: `Page ${currentPage} | Items: ${itemsOnCurrentPage} / ${totalListings}.` };

                    listMessage.edit({ embeds: [marketListing], components: [row] });
                })
                .catch(async (err) => {
                    marketListing.color = '#FF0000';
                    if (err.code == 'INTERACTION_COLLECTOR_ERROR') {
                        return;
                    }
                    listMessage.edit({ embeds: [listingEmbed] });

                    isExpired = true;
                });
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

marketListing = {
    title: "Global Market :shopping_cart:",
    description: "All the cards listed in the Global Market that matches your requirements are shown below!\n\n",
    author: true
}

async function parseArguments(args) {

    let filters = {};
    let currentKey = "";
    // Rarity (r), Type (t), Name (n), Ascension (a)
    for (var i = 0, l = args.length; i < l; i++) {
        if (args[0][0] === "-") {
            currentKey = args[0][1].toLowerCase();
            args.shift();
            if (filters[currentKey]) {
                filters[currentKey] += ",";
            }
            continue;
        }

        filters[currentKey] ? filters[currentKey] += " " + args[0] : filters[currentKey] = args[0];
        args.shift();
    }

    return filters;
}

async function parseFilters(filters) {

    let names = await parseNames(filters.n);

    let rarities, types, ascensions = new Set();
    for (let [key, value] of Object.entries(filters)) {
        if (key === "r") {
            filters[key] = value.split(",").forEach(rarity => {
                rarity = rarity.trim().toLowerCase();
                if (["common", "c"].includes(rarity)) {
                    rarity = "Common";
                } else if (["uncommon", "u"].includes(rarity)) {
                    rarity = "Uncommon";
                } else if (["rare", "r"].includes(rarity)) {
                    rarity = "Rare";
                } else if (["epic", "e"].includes(rarity)) {
                    rarity = "Epic";
                } else if (["legendary", "l"].includes(rarity)) {
                    rarity = "Legendary";
                } else if (["mythic", "m"].includes(rarity)) {
                    rarity = "Mythic";
                } else if (["basic", "b"].includes(rarity)) {
                    rarity = "Basic";
                } else {
                    return;
                }
                rarity.add(rarity);
            })
        } else if (key === "t") {
            filters[key] = value.split(",").forEach(type => {
                type = type.trim().toLowerCase();
                if (['consumable'].includes(type)) {
                    type = "consumable";
                } else if (['equipment', 'e'].includes(type)) {
                    type = "equipment";
                } else if (['fruit', 'f'].includes(type)) {
                    type = "fruit";
                } else if (['chest'].includes(type)) {
                    type = "chest";
                } else if (['pack', 'p'].includes(type)) {
                    type = "pack";
                } else {
                    return;
                }
                type.add(type);
            })
        } else if (key === "a") {
            filters[key] = value.split(",").forEach(ascension => {
                ascension = parseInt(ascension.trim());
                if (!ascension) return;

                ascension.add(ascension);
            });
        } else {
            continue;
        }
    }

    return { names, rarities, types, ascensions };
}

async function parseNames(nameFilterOptions) {
    let names = new Set();
    if (nameFilterOptions) {
        nameFilterOptions = nameFilterOptions.toLowerCase().split(",");
        await Promise.all(nameFilterOptions.map(async (name) => {
            let items = await findPartialItem(titleCase(name.trim()));
            if (items.length == 1) {
                names.add(items[0].itemName);
            } else if (items.length > 1) {
                for (const item of items) {
                    names.add(item)
                };
            }
        }));

        return names;
    }

    return names;
}
const Listing = require("../../models/listing");
const titleCase = require("../../functions/titleCase");
const { MessageEmbed } = require("discord.js");
const findPartialItem = require("../../functions/findPartialItem");
const marketUtils = require("./utils/marketUtils");
const {
    PaginateContent,
    splitArrayIntoChunksOfLen,
} = require("../../functions/pagination/Pagination");

module.exports = {
    name: "market",
    description: "Stuff.",
    syntax: `{filters}`,
    aliases: [""],
    category: "Economy",
    cooldown: 5,
    async execute({ client, message, args }) {
        const filters = await parseArguments(args);

        const listingFilters = await parseFilters(filters);

        let listings = await Listing.find({}).sort({ itemCost: 1 });

        listings = await filterListings(listings, listingFilters);

        const itemsPerPage = 10;
        const chunks = splitArrayIntoChunksOfLen(listings, itemsPerPage);
        const listingEmbeds = [];

        chunks.forEach((chunk, index) => {
            const embed = new MessageEmbed()
                .setAuthor({
                    name: message.author.username,
                    iconURL: message.author.displayAvatarURL({
                        dynamic: true,
                    }),
                })
                .setColor(client.config.colors.primary)
                .setTitle(embedStuff.title)
                .setDescription(embedStuff.descHeader)
                .setFooter({
                    text: `Page ${index + 1} | Items: ${
                        chunk.length + index * itemsPerPage
                    }/${listings.length}`,
                });

            embed.description += chunk
                .map((listing) => {
                    return marketUtils.returnMessage({
                        listing,
                        type: listing.type,
                        messageType: "listing",
                    });
                })
                .join("\n\n");

            listingEmbeds.push(embed);
        });

        if (!listingEmbeds.length) {
            await message.channel.send({
                embeds: [getDefaultEmbed(client, message)],
            });
            return;
        }

        const paginated = new PaginateContent(client, message, listingEmbeds);
        paginated.init();
    },
};

async function parseArguments(args) {
    const filters = {};
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

        filters[currentKey]
            ? (filters[currentKey] += " " + args[0])
            : (filters[currentKey] = args[0]);
        args.shift();
    }

    return filters;
}

async function parseFilters(filters) {
    const names = await parseNames(filters.n);

    const rarities = new Set();
    const types = new Set();
    const ascensions = new Set();
    for (const [key, value] of Object.entries(filters)) {
        if (key === "r") {
            filters[key] = value.split(",").forEach((rarity) => {
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
                rarities.add(rarity);
            });
        } else if (key === "t") {
            filters[key] = value.split(",").forEach((type) => {
                type = type.trim().toLowerCase();
                if (["consumable"].includes(type)) {
                    type = "consumable";
                } else if (["equipment", "e"].includes(type)) {
                    type = "equipment";
                } else if (["fruit", "f"].includes(type)) {
                    type = "fruit";
                } else if (["chest"].includes(type)) {
                    type = "chest";
                } else if (["pack", "p"].includes(type)) {
                    type = "pack";
                } else {
                    return;
                }
                types.add(type);
            });
        } else if (key === "a") {
            filters[key] = value.split(",").forEach((ascension) => {
                ascension = parseInt(ascension.trim());
                if (!ascension) return;

                ascensions.add(ascension);
            });
        } else {
            continue;
        }
    }

    return { names, rarities, types, ascensions };
}

async function parseNames(nameFilterOptions) {
    const names = new Set();
    if (nameFilterOptions) {
        nameFilterOptions = nameFilterOptions.toLowerCase().split(",");
        await Promise.all(
            nameFilterOptions.map(async (name) => {
                const items = await findPartialItem(titleCase(name.trim()));
                if (items.length == 1) {
                    names.add(items[0].itemName);
                } else if (items.length > 1) {
                    for (const item of items) {
                        names.add(item);
                    }
                }
            }),
        );

        return names;
    }

    return names;
}

async function filterListings(listings, filters) {
    const { names, rarities, types, ascensions } = filters;

    const filteredListings = listings
        .filter((listing) => {
            if (names.size == 0) return true;

            if (!names.has(listing.itemName)) return false;

            return true;
        })
        .filter((listing) => {
            if (rarities.size == 0) return true;

            if (!rarities.has(listing.item.rarity)) return false;

            return true;
        })
        .filter((listing) => {
            if (types.size == 0) return true;

            if (!types.has(listing.itemType)) return false;

            return true;
        })
        .filter((listing) => {
            if (ascensions.size == 0) return true;

            if (!ascensions.has(listing.item.ascension)) return false;

            return true;
        });
    return filteredListings;
}

const embedStuff = {
    title: "Global market :shopping_cart: ",
    descHeader:
        "All the items listed in the Global Market that matches your requirements are shown below!\n\n",
};

function getDefaultEmbed(client, message) {
    const embed = new MessageEmbed()
        .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({
                dynamic: true,
            }),
        })
        .setColor(client.config.colors.primary)
        .setTitle(embedStuff.title)
        .setDescription(embedStuff.descHeader)
        .setFooter({
            text: `Page 1 | Items: 0/0`,
        });

    return embed;
}

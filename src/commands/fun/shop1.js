const { MessageEmbed } = require("discord.js");
const invUtil = require("./utils/invUtil.js");
const Shop = require('../../models/shopData');
const {
    PaginateContent,
    splitArrayIntoChunksOfLen,
} = require("../../functions/pagination/Pagination");

module.exports = {
    name: "shoptest",
    description: "Shopee pee pee pee. No its just the shop.",
    aliases: ["s"],
    cooldown: 5,
    category: "Fun",
    async execute({ client, message, user }) {
        // Array of embeds.
        const items = [];

        const itemsArray2 = await Shop.find({}).sort({ itemCost: 1 });
        const test = await Shop.aggregate([
            {
                $lookup: {
                    localField: "itemName",
                    from: "items",
                    foreignField: "itemName",
                    as: "itemInfo",
                },
            },
        ]);
        console.log(test);

        // Array of user's items.
        const itemsArray = [];

        for (const [itemName, itemInfo] of Object.entries(user.inv)) {
            itemsArray.push({
                itemName,
                itemInfo,
            });
        }
        // console.log(itemsArray2);
        // console.log(itemsArray);

        const itemsPerPage = 10;
        const chunks = splitArrayIntoChunksOfLen(itemsArray, itemsPerPage);

        chunks.forEach((chunk, index) => {
            const embed = new MessageEmbed()
                .setAuthor({
                    name: message.author.username,
                    iconURL: message.author.displayAvatarURL({
                        dynamic: true,
                    }),
                })
                .setColor(client.config.colors.primary)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTitle("Inventory")
                .setDescription("")
                .setFooter({
                    text: `Page ${index + 1} | Items: ${chunk.length + index * itemsPerPage
                        }/${itemsArray.length}`,
                });

            embed.description += chunk
                .map(
                    (item) =>
                        `${invUtil.invMessage({
                            property: item.itemInfo,
                            type: item.itemInfo.type,
                            name: item.itemName,
                            emote: item.itemInfo.emote,
                        })}`,
                )
                .join("\n\n");

            items.push(embed);
        });

        const paginated = new PaginateContent(client, message, items);
        paginated.init();
    },
};

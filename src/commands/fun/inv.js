const { MessageEmbed } = require("discord.js");
const invUtil = require("./utils/invUtil.js");
const { PaginateContent } = require("../../functions/pagination/Pagination");

module.exports = {
    name: "inventory",
    description:
        "Wanna check what you have in your inventory? Scroll between the pages!",
    aliases: ["inv", "itemCount", "icbm"],
    cooldown: 5,
    category: "Fun",
    async execute({ client, message, user }) {
        // Array of embeds.
        const items = [];

        // Array of user's items.
        const itemsArray = [];

        for (const [itemName, itemInfo] of Object.entries(user.inv)) {
            itemsArray.push({
                itemName,
                itemInfo,
            });
        }

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
                    text: `Page ${index + 1} | Items: ${
                        chunk.length + index * itemsPerPage
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

function splitArrayIntoChunksOfLen(arr, len) {
    const chunks = [];
    const n = arr.length;
    let i = 0;

    while (i < n) {
        chunks.push(arr.slice(i, (i += len)));
    }
    return chunks;
}

const AreaInterface = require("./AreaInterface.js");
const { MessageEmbed } = require("discord.js");
const { PaginateContent } = require("../../functions/pagination/Pagination");

module.exports = {
    name: "areas",
    aliases: [""],
    category: "Areas",
    async execute({ client, message, user }) {
        const areas = [];
        const areaArray = [];
        for (const id in AreaInterface.areas) {
            const area = AreaInterface.areas[id];
            areaArray.push({
                name: `${area.getID}. ${area.getName}`,
                value: `${area.getDesc}`,
            });
        }

        const itemsPerPage = 10;
        const chunks = splitArrayIntoChunksOfLen(areaArray, itemsPerPage);
        chunks.forEach((chunk, index) => {
            const embed = new MessageEmbed()
                .setAuthor({
                    name: message.author.username,
                    icon_url: message.author.displayAvatarURL({
                        dynamic: true,
                    }),
                })
                .setColor(client.config.colors.primary)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTitle("Areas 🗺️")
                .setDescription(
                    `All the areas are listed down below. You are currently at **Area [${
                        user.location.area || 1
                    } - ${user.location.floor || 1}]**.`,
                )
                .addFields(chunk)
                .setFooter({
                    text: `Page ${index + 1} | Areas: ${
                        chunk.length + index * itemsPerPage
                    }/${areaArray.length}`,
                });

            areas.push(embed);
        });

        const paginated = new PaginateContent(client, message, areas);
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

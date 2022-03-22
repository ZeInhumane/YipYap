const Discord = require("discord.js");
const findItem = require("../../functions/findItem.js");
const invUtil = require("./utils/invUtil.js");

module.exports = {
    name: "inventory",
    description:
        "Wanna check what you have in your inventory? Scroll between the pages!",
    aliases: ["inv", "itemCount", "icbm"],
    cooldown: 5,
    category: "Fun",
    async execute({ message, user }) {
        let currentColor = "#629dc9";
        const row = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
                .setCustomId("back")
                .setLabel("◀️")
                .setStyle("PRIMARY"),
            new Discord.MessageButton()
                .setCustomId("forward")
                .setLabel("▶️")
                .setStyle("PRIMARY"),
            new Discord.MessageButton()
                .setCustomId("delete")
                .setLabel("🗑️")
                .setStyle("DANGER"),
        );

        // Edited shop function
        async function page(botEmbedMessage) {
            async function createUpdatedMessage() {
                let itemsOnCurrentPage = 0;
                if (onPage < 0) {
                    onPage = maxPage;
                }
                if (onPage > maxPage) {
                    onPage = 0;
                }
                // itemCount = item itemCount am on
                let itemCount = onPage * maxOnPage;
                // removing execute apparently fixes await function

                const updatedShopEmbed = new Discord.MessageEmbed()
                    .setColor(currentColor)
                    .setTitle(`Inventory`)
                    .setDescription("")
                    .setAuthor({
                        name: message.author.tag,
                        iconURL: message.author.displayAvatarURL({
                            dynamic: true,
                        }),
                    })
                    .setFooter({ text: `Page ${onPage + 1}/${maxPage + 1}` });

                // Adds items to embed till user does not have any more items to show or it hits max page limit
                while (
                    itemCount < totalItems &&
                    itemsOnCurrentPage < maxOnPage
                ) {
                    const itemName = items[itemCount][0];
                    // Checks item in db
                    const itemInfo = await findItem(
                        items[itemCount][0].split("#")[0],
                    );
                    const itemProperty = items[itemCount][1];

                    updatedShopEmbed.description += `${invUtil.invMessage({
                        property: itemProperty,
                        type: itemProperty.type,
                        name: itemName,
                        emote: itemInfo.emote,
                    })}\n\n`;

                    itemCount++;
                    itemsOnCurrentPage++;
                }
                return updatedShopEmbed;
            }

            let isExpired = false;
            // Filter so only user can interact with the buttons
            const filter = (i) => {
                i.deferUpdate();
                return i.user.id === message.author.id;
            };
            while (!isExpired) {
                // awaits Player interaction
                await botEmbedMessage
                    .awaitMessageComponent({
                        filter,
                        componentType: "BUTTON",
                        time: 60000,
                    })
                    .then(async (i) => {
                        playerAction = i.customId;
                        switch (playerAction) {
                            case "forward":
                                onPage++;
                                break;
                            case "back":
                                onPage--;
                                break;
                            case "delete":
                                isExpired = true;
                                return;
                        }
                        botEmbedMessage.edit({
                            embeds: [await createUpdatedMessage()],
                            components: [row],
                        });
                    })
                    .catch(async () => {
                        isExpired = true;
                    });
            }
            // Check if interaction expired
            if (isExpired) {
                currentColor = "#FF0000";
                try {
                    await botEmbedMessage.edit({
                        embeds: [await createUpdatedMessage()],
                        components: [],
                    });
                } catch (err) {
                    console.log(
                        "An error has occurred while trying to update inventory page.",
                    );
                }
                return;
            }
        }

        let playerAction;
        let onPage = 0;
        let itemsOnCurrentPage = 0;
        // Sets how many items are displayed on a single shop page
        const maxOnPage = 10;
        // Shows max number of page, example if the there are 20 items, there would be 7 pages(Determined by maxOnPage and number of items)

        // Gets total items in inventory
        const totalItems = Object.entries(user.inv).length;
        const items = Object.entries(user.inv);
        const maxPage = Math.floor(totalItems / maxOnPage);

        let itemCount = onPage * maxOnPage;
        const shopEmbed = new Discord.MessageEmbed()
            .setColor(currentColor)
            .setTitle(`Inventory`)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setDescription("")
            .setFooter({
                text: `Page ${onPage + 1}/${maxPage + 1}`,
            });

        while (itemCount < totalItems && itemsOnCurrentPage < maxOnPage) {
            const itemName = items[itemCount][0];
            // Checks item in db
            const itemInfo = await findItem(items[itemCount][0].split("#")[0]);
            const itemProperty = items[itemCount][1];

            shopEmbed.description += `${invUtil.invMessage({
                property: itemProperty,
                type: itemProperty.type,
                name: itemName,
                emote: itemInfo.emote,
            })}\n\n`;

            itemCount++;
            itemsOnCurrentPage++;
        }

        message.channel
            .send({ embeds: [shopEmbed], components: [row] })
            .then((botMessage) => {
                page(botMessage);
            });
    },
};

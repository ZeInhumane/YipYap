const AreaInterface = require('./AreaInterface.js');

module.exports = {
    name: 'areas',
    aliases: [''],
    category: "Areas",
    async execute({ client, message, user }) {

        const areasEmbed = {
            color: 0x0099ff,
            title: 'Areas 🗺️',
            author: {
                name: message.author.username,
                icon_url: message.author.displayAvatarURL({ dynamic: true }),
            },
            description: `All the areas are listed down below. You are currently at **Area [${user.location.area} - ${user.location.floor}]**.`,
            thumbnail: {
                url: client.user.displayAvatarURL({ dynamic: true }),
            },
            fields: [],
            footer: {
                text: 'Page 1 | Areas: 3 / 10',
            },
        };

        for (const id in AreaInterface.areas) {
            const area = AreaInterface.areas[id];
            areasEmbed.fields.push({
                name: `${area.getID}. ${area.getName}`,
                value: `${area.getDesc}`,
            });
        }

        message.channel.send({ embeds: [areasEmbed] });
    },
};
const AreaInterface = require('./AreaInterface.js');

module.exports = {
    name: 'area',
    aliases: [''],
    category: "Areas",
    description: "Travels to an area.",
    syntax: "[area's id or name]",
    async execute({ user, message, args, prefix }) {

        if (!args[0]) {
            return message.channel.send(`You need to specify an area.\n` +
                `Correct usage: \`${prefix}${this.name} ${this.syntax}\``);
        }

        const input = Number.isNaN(parseInt(args[0])) ? { type: 'name', value: args[0] } : { type: 'id', value: parseInt(args[0]) };

        const area = await getArea(input, message, prefix);

        if (!area) {
            return;
        }

        const areaEmbed = {
            color: 0x0099ff,
            title: `Successfully travelled to ${area.getName} [Area ${area.getID}]`,
            author: {
                name: `${message.author.username}'s travel`,
                icon_url: message.author.displayAvatarURL({ dynamic: true }),
            },
            description: `${area.getDesc}`,
            image: {
                url: area.getImageURL,
            },
            footer: {
                text: `View all areas with ${prefix}areas`,
            },
        };

        await message.channel.send({ embeds: [areaEmbed] });

        user.location = {
            area: area.getID,
            floor: 1,
        };
        user.save()
            .then(result => console.log(`Set area for ${result._doc.userID} to ${result._doc.location.area}`))
            .catch(err => console.error(err));
    },
};

function getArea(input, message, prefix) {
    if (input.type === 'name') {
        console.log(Object.entries(AreaInterface.areas));
        for (const [, areaClass] of Object.entries(AreaInterface.areas)) {
            if (areaClass.getName.toLowerCase() === input.value.toLowerCase()) {
                return areaClass;
            }
        }
        message.channel.send(`You need to specify a valid area name.\n` +
            `Correct usage: \`${prefix}area ${this.syntax}\``);
        return;
    }

    if (input.type === 'id') {
        for (const [, areaClass] of Object.entries(AreaInterface.areas)) {
            if (areaClass.getID === input.value) {
                return areaClass;
            }
        }
        message.channel.send(`You need to specify a valid area id.\n` +
            `Correct usage: \`${prefix}area ${this.syntax}\``);
        return;
    }
}

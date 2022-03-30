const AreaInterface = require('./AreaInterface');

module.exports = {
    name: "floor",
    description: "Move to a new floor to receive different prizes :)",
    syntax: "{floor to access}",
    cooldown: 10,
    aliases: ['fl'],
    category: "areas",
    async execute({ message, args, user, prefix }) {

        const area = AreaInterface.areas[user.location['area'] || 1];
        const floorToAccess = parseInt(args[0]);

        if (!area) {
            user.location = {
                area: 1,
                floor: 1,
            };
            user.save();
        }

        if (!args[0] || isNaN(floorToAccess)) {
            const floorEmbed = {
                color: 0x0099ff,
                title: "Floors :map:",
                author: {
                    name: `${message.author.username}`,
                    iconURL: message.author.displayAvatarURL({ dynamic: true }),
                },
                description: `All the floors that you have unlocked in **${area.getName}** are listed down below.\n\n`,
                image: {
                    url: area.getImageURL,
                },
            };

            let floorCount = 0;
            for (const [floorID, floor] of Object.entries(area.getFloors)) {
                floorEmbed.description += `Area | ${area.getID} - ${floorID}\n` + `Enemies: ${floor.enemies.join(", ")}\n\n`;
                floorCount += 1;
            }

            floorEmbed.footer = {
                text: `Page 1 | ${floorCount} / ${floorCount}`,
            };

            return message.channel.send({ embeds: [floorEmbed] });
        }

        if (floorToAccess > Object.keys(area.getFloors).length) {
            return message.channel.send(`You need to specify a valid floor.\n` +
                `Correct usage: \`${prefix}${this.name} ${this.syntax}\``);
        }

        if (area.getFloors[floorToAccess].requirement > user.level) {
            return message.channel.send(`It looks like you do not meet the requirements to access this floor.\n` +
                `Come back when you are level ${area.getFloors[floorToAccess].requirement}`);
        }

        user.location.floor = floorToAccess;
        user.markModified('location');
        user.save()
            .then(result => console.log(`Set floor for ${result._doc.userID} to ${result._doc.location.floor}`))
            .catch(err => console.error(err));

        const { hp, attack, defense, speed } = area.getFloors[floorToAccess].buffs;
        const { ExpMultiplier, GoldMultiplier } = area.getFloors[floorToAccess].multipliers;

        const floorEmbed = {
            color: 0x0099ff,
            title: `You have successfully travelled to Area [${area.getID} - ${floorToAccess}]`,
            author: {
                name: `${message.author.username}'s travel`,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
            },
            fields: [
                {
                    name: `Applied enemy buffs`,
                    value: `HP Multiplier: **${hp}**\n` +
                        `ATK Multiplier: **${attack}**\n ` +
                        `DEF Multiplier: **${defense}**\n` +
                        `SPD Multiplier: **${speed}**\n`,
                },
                {
                    name: `Additional rewards due to current location`,
                    value: `EXP Multiplier: **${ExpMultiplier}**\n` +
                        `Gold Multiplier: **${GoldMultiplier}**`,
                },
            ],
            image: {
                url: area.getImageURL,
            },
            footer: {
                text: `View all areas with ${prefix}areas`,
            },
        };

        await message.channel.send({ embeds: [floorEmbed] });
    },
};
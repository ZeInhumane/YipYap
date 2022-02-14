const Discord = require('discord.js');
const AreaInterface = require('./AreaInterface.js');

module.exports = {
    name: "areas",
    description: "Shows list of areas",
    aliases: ['area'],
    cooldown: 5,
    category: "Area",
    async execute({ message, args, client }) {
        let text = '';
        try {
            console.log(AreaInterface.areaDir);
            console.log(AreaInterface.areas);
            if (args[0] == undefined) {
                for (const area in AreaInterface.areas) {
                    text += `${AreaInterface.areas[area].getName} - ${AreaInterface.areas[area].getDesc}\n`;
                }
            } else {
                text += `${AreaInterface.areas[args[0]].getName} - ${AreaInterface.areas[args[0]].getDesc}`;
            }

            const areaEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Areas')
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setDescription('List of currently open areas.')
                .setFooter({ text: 'Travel to an area with -area {area name}' });

            for (const area in AreaInterface.areas) {
                areaEmbed.fields.push({ name: AreaInterface.areas[area].getName, value: AreaInterface.areas[area].getDesc });
            }
            message.reply({ embeds: [areaEmbed] });

        } catch (e) {
            console.log(e);
        }
    },
};
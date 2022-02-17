const Discord = require('discord.js');
const findPrefix = require('../../functions/findPrefix');
const commonTags = require("common-tags");
var config = require('../../../config.json');
const fs = require("fs");

module.exports = {
    name: "help",
    description: "Help yourself uwu",
    syntax: "{Command to check} / none",
    cooldown: 5,
    category: "Utility",
    async execute({ message, args, client }) {
        // Getting the prefix from db
        const prefix = await findPrefix(message.guild.id);
        message.channel.send(`type ${prefix}help + {command name for specific help on that command}`);
        const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));

        // Check if user want specific help
        if (!command || args[0] == undefined) {
            // General help

            const helpEmbed = new Discord.MessageEmbed()
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setColor("#FF69B4")
                .setFooter({ text: `For more info: ${prefix}help {command name}` })
                .setTitle(`Commands`);

            let admin = false;
            if (config.admins.includes(message.author.id)) {
                admin = true;
            }

            const commands = (category) => {
                return client.commands
                    .filter(cmd => cmd.category.toLowerCase() === category.toLowerCase())
                    .filter(cmd => admin ? true : !(cmd.category.toLowerCase() === "admin"))
                    .map(cmd => `\`${cmd.name}\``)
                    .join(" ");
            };

            const fields = helpEmbed.fields;
            fs.readdirSync("./src/commands")
                .filter(cat => admin ? true : !(cat.toLowerCase() === "admin"))
                .forEach(cat => fields.push(
                    {
                        name: commonTags.stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}**`,
                        value: `${commands(cat)}`,
                    },
                ));

            const links = [
                {
                    hypertext: "Invite Link",
                    url: "https://discord.com/api/oauth2/authorize?client_id=745275291785494571&permissions=0&scope=applications.commands%20bot",
                },
                {
                    hypertext: "Official Server",
                    url: "https://discord.gg/cJgAG3W",
                },
            ]
                .map(({ hypertext, url }) => (`[${hypertext}](${url})`))
                .join(" **|** ");
            fields.push(
                {
                    name: "Links",
                    value: links,
                },
            );

            message.channel.send({ embeds: [helpEmbed] });
        } else {
            // Specific help
            const helpEmbed = new Discord.MessageEmbed()
                .setColor('#FF69B4')
                .setTitle(`${command.name.charAt(0).toUpperCase() + command.name.slice(1)} help`)
                .addFields(
                    { name: command.description, value: `Syntax: ${prefix}${command.name} ${command.syntax}` },
                );
            message.channel.send({ embeds: [helpEmbed] });
        }
    },
};

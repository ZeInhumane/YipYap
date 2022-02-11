module.exports = {
    name: "highlight",
    description: "Highlights a text with the embed",
    syntax: "{Message}",
    cooldown: 5,
    aliases: ['hl'],
    category: "Utility",
    execute(message, args) {
        const Discord = require('discord.js');
        let highlightedMessage = "";
        args.forEach(arg => {
            highlightedMessage += arg + " ";
        });

        let user = message.member.user.tag;
        user = user.toString();
        user = user.split("#", user.length - 4);
        const authorName = user[0];

        const highlightEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(highlightedMessage)
            .setFooter(authorName);

        message.channel.send({ embeds: [highlightEmbed] });
        // message.delete();
    },
};
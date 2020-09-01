module.exports = {
    name: "highlight",
    description: "Highlights a message",
    execute(message, args) {
        const Discord = require('discord.js');
        var highlightedMessage = "";
        args.forEach(arg => {
            highlightedMessage += arg + " ";
        });

        user = message.member.user.tag;
        user = user.toString();
        user = user.split("#", user.length - 4);
        authorName = user[0];

        var highlightEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(highlightedMessage)
            .setFooter(authorName);

        message.channel.send(highlightEmbed);
        message.delete();
    }
}
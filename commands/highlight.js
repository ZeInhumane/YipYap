module.exports = {
    name: "highlight",
    description: "Highlights a message",
    execute(message, args) {
        const Discord = require('discord.js');
        var highlightedMessage = "";
        args.forEach(arg => {
            highlightedMessage += arg + " ";
        });
        var highlightEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(highlightedMessage)
                    .setFooter(message.author.name);

        message.channel.send(highlightEmbed);
        message.delete();
    }
}
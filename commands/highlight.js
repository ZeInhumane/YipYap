module.exports = {
    name: "highlight",
    description: "Highlights a message",
    execute(message, args) {
        const Discord = require('discord.js');
        var highlightEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(args);
                    
        message.channel.send(highlightEmbed);
    }
}
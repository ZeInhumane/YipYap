module.exports = {
    name: "highlight",
    description: "Highlights a message",
    execute(message, args) {
        const Discord = require('discord.js');
        var message = "";
        args.forEach(arg => {
            message += arg;
        });
        var highlightEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(message);
                    
        message.channel.send(highlightEmbed);
    }
}
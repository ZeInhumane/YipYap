module.exports = {
    name: "start",
    description: "Sets up a new player",
    execute(message, args) {
        const Discord = require('discord.js');
        var hightlightEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(args);
                    
        message.channel.send(highlightEmbed);
    }
}
module.exports = {
    name: "help",
    description: "Help command",
    execute(message, args) {
        const Discord = require('discord.js');
        const index = require('../index.js');
        message.channel.send('type help + {command name for specific help on that command}');
        switch (args[0]) {
            case "battle":
            case "start":
            case "ping":
            case "highlight":
                var helpEmbed = new Discord.MessageEmbed()
                    .setColor('#FF69B4')
                    .setTitle('Battle help')
                    .addFields(
                        { name: client.commands.get(command).description, value: "​" },
                    );
                message.channel.send(helpEmbed);
                break;
            //Description of start
            //'Start registers you to the bot database to allow you to play the bot'
            default:
                var helpEmbed = new Discord.MessageEmbed()
                    .setColor('#FF69B4')
                    .setTitle('All commands, To get help for each command do =help {command name}')
                    .addFields(
                        { name: 'start', value: "​" },
                        { name: 'battle', value: "​" },
                        { name: 'highlight', value: "​" },
                        { name: 'ping', value: "​" },
                    );
                message.channel.send(helpEmbed);
        }
    },
};
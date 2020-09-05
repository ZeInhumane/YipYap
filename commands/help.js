module.exports = {
    name: "help",
    description: "Help command",
    execute(message, args) {
        const Discord = require('discord.js');
        const client = require('../index.js').client;
        message.channel.send('type help + {command name for specific help on that command}');
        switch (args[0]) {
            case "battle":
            case "start":
            case "ping":
            case "highlight":
            case "reminder":
            case "daily":
            case "currency":
                var helpEmbed = new Discord.MessageEmbed()
                    .setColor('#FF69B4')
                    .setTitle(client.commands.get(args[0]).name.charAt(0).toUpperCase() + client.commands.get(args[0]).name.slice(1) + ' help')
                    .addFields(
                        { name: client.commands.get(args[0]).description, value: "​" },
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
                        { name: 'reminder', value: "​" },
                        { name: 'daily', value: "​" },
                        { name: 'currency', value: "​" },
                    );
                message.channel.send(helpEmbed);
        }
    },
};
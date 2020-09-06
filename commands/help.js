module.exports = {
    name: "help",
    description: "Help command",
    execute(message, args) {
        const Discord = require('discord.js');
        const client = require('../index.js').client;
        message.channel.send('type help + {command name for specific help on that command}');
        const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));
        if (!command) {
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
                    { name: 'profile', value: "​" },
                );
            message.channel.send(helpEmbed);
        }
        else {
            var helpEmbed = new Discord.MessageEmbed()
                .setColor('#FF69B4')
                .setTitle(command.name.charAt(0).toUpperCase() + command.name.slice(1) + ' help')
                .addFields(
                    { name: command.description, value: "​" },
                );
            message.channel.send(helpEmbed);
        }
    }
};
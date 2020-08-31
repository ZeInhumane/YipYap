module.exports = {
    name: "help",
    description: "Help command",
    execute(message, args) {
        const Discord = require('discord.js');
        message.channel.send('type help + {command name for specific help on that command}');
        switch (args[0]) {
            case "battle":
                var helpEmbed = new Discord.MessageEmbed()
                    .setColor('#FF69B4')
                    .setTitle('Battle help')
                    .addFields(
                        { name: 'Battle allows you to engage enemies and gain gold and experience as a result of your engagement', value: "​" },
                    );
                break;
            case "start":
                var startEmbed = new Discord.MessageEmbed()
                    .setColor('#FF69B4')
                    .setTitle('start')
                    .addFields(
                        { name: 'Start registers you to the bot database to allow you to play the bot', value: "​" },
                    );
                message.channel.send(startEmbed);
                break;
            case "jerick":
                var battleEmbed = new Discord.MessageEmbed()
                    .setColor('#FF69B4')
                    .setTitle(`Jerica's gayness`)
                    .addFields(
                        { name: 'Jerica rates your gayness on a scale of 1 to 100, Jerica is still 100% gay tho(and fat)', value: "​" },
                    );
                message.channel.send(battleEmbed);
                break;
            case "gay":
                var gayEmbed = new Discord.MessageEmbed()
                    .setColor('#FF69B4')
                    .setTitle('GAY')
                    .addFields(
                        { name: 'GAY', value: "​" },
                    );
                message.channel.send(gayEmbed);
                break;
            default:
                helpEmbed = new Discord.MessageEmbed()
                    .setColor('#FF69B4')
                    .setTitle('All commands, To get help for each command do =help {command name}')
                    .addFields(
                        { name: 'Start', value: "​" },
                        { name: 'Battle', value: "​" },
                        { name:'Gay', value: "​" },
                        { name:'Jerick', value: "​" },
                    );
                message.channel.send(helpEmbed);
        }
    },
};
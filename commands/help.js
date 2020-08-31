module.exports = {
    name: "help",
    description: "Help command",
    execute(message, args) {
        const Discord = require('discord.js');
        message.channel.send('type help + {command name for specific help on that command}');
        switch (args[0]) {
            case "battle":
                var helpEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Batlle help')
                    .addFields(
                        { name: 'command1', value: "Battle is to fight against enemies to gain gold and exp" },
                        { name: 'command2', value: "nothing" },
                        { name: 'command3', value: "nothing" }
                    )
                    .addField('To get help for each command, do =help (command name)');
                message.channel.send(helpEmbed);
                break;
            case "starthelp":
                var startEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Batlle help')
                    .addFields(
                        { name: 'command1', value: "Battle is to fight against enemies to gain gold and exp" },
                        { name: 'command2', value: "nothing" },
                        { name: 'command3', value: "nothing" }
                    )
                    .addField('To get help for each command, do =help (command name)');
                message.channel.send(startEmbed);
                break;
            case "battlehelp":
                var battleEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Batlle help')
                    .addFields(
                        { name: 'command1', value: "Battle is to fight against enemies to gain gold and exp" },
                        { name: 'command2', value: "nothing" },
                        { name: 'command3', value: "nothing" }
                    )
                    .addField('To get help for each command, do =help (command name)');
                message.channel.send(battleEmbed);
                break;
            case "gayhelp":
                var gayEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Batlle help')
                    .addFields(
                        { name: 'command1', value: "Battle is to fight against enemies to gain gold and exp" },
                        { name: 'command2', value: "nothing" },
                        { name: 'command3', value: "nothing" },
                    )
                    .addField('To get help for each command, do =help (command name)');
                message.channel.send(gayEmbed);
                break;
            default:
                helpEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('All commands')
                    .addFields(
                        { name: 'battle', value: "battle" },
                        { name: 'battle', value: "battle" },
                        { value: "battle" },
                        { name: 'To get help for each command do =help {command name}', value: "thanks" },
                    );
                message.channel.send(helpEmbed);
        }
    },
};
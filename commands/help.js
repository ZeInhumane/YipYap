module.exports = {
    name: "help",
    description: "Help command",
    syntax: "{Command to check} / none",
    category: "Utility",
    execute(message, args) {
        const Discord = require('discord.js');
        const client = require('../index.js').client;
        message.channel.send('type help + {command name for specific help on that command}');
        const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));
        if (!command || args[0] == undefined) {
            var helpEmbed = new Discord.MessageEmbed()
                .setColor('#FF69B4')
                .setTitle('All commands, To get help for each command do =help {command name}');
            var fieldsToAdd = [];
            for (let commandName of client.commands.keys()) {
                let categoryExists = false;
                let commandCategory = client.commands.get(commandName).category;
                console.log({commandCategory: commandCategory, commandName: commandName})
                for(var i = 0; i < fieldsToAdd.length; i++){
                    if(commandCategory == fieldsToAdd[i][0]){
                        fieldsToAdd[i][1].push(commandName);
                        categoryExists = true;
                    }
                }
                if(!categoryExists){
                    fieldsToAdd.push([commandCategory, [commandName]]);
                }
            }
            console.log({fieldsToAdd:fieldsToAdd})
            let numCategory = fieldsToAdd.length;
            for(var i = 0; i < numCategory; i++){
                let fieldValue = "";
                let numCommandsInCategory = fieldsToAdd[i][1].length;
                for(var j = 0; j < numCommandsInCategory; j++){
                    fieldValue += "`" + fieldsToAdd[i][1][j] + "` ";
                }
                console.log({fieldValue:fieldValue})
                helpEmbed.addField(fieldsToAdd[i][0], fieldValue);
            }
            message.channel.send(helpEmbed);
        }
        else {
            helpEmbed = new Discord.MessageEmbed()
                .setColor('#FF69B4')
                .setTitle(command.name.charAt(0).toUpperCase() + command.name.slice(1) + ' help')
                .addFields(
                    { name: command.description, value: "Syntax: =" + command.name + " " + command.syntax },
                );
            message.channel.send(helpEmbed);
        }
    }
};
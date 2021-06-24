const prefix = require('../models/prefix.js');

module.exports = {
    name: "help",
    description: "Help command",
    syntax: "{Command to check} / none",
    category: "Utility",
    async execute(message, args) {
        const Discord = require('discord.js');
        const client = require('../index.js').client;
        message.channel.send('type help + {command name for specific help on that command}');
        const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));
        const data = await prefix.findOne({
            GuildID: message.guild.id
        });
        if (!command || args[0] == undefined) {
            let helpEmbed = new Discord.MessageEmbed()
                .setColor('#FF69B4')
                .setTitle('Enter this server for updates on the bot \n https://discord.gg/cJgAG3W%7D');
            let fieldsToAdd = [];
            for (let commandName of client.commands.keys()) {
                let categoryExists = false;
                let commandCategory = client.commands.get(commandName).category;
                
                for (let i = 0; i < fieldsToAdd.length; i++) {
                    if (commandCategory == fieldsToAdd[i][0]) {
                        fieldsToAdd[i][1].push(commandName);
                        categoryExists = true;
                    }
                }
                if (!categoryExists) {
                    fieldsToAdd.push([commandCategory, [commandName]]);
                }
            
            }
            if (!(message.author.id == "752724534028795955" || message.author.id == "344431410360090625" || message.author.id == "272202473827991557")) {
                console.log(fieldsToAdd)
                fieldsToAdd.shift()
                console.log(fieldsToAdd)
            }
            let numCategory = fieldsToAdd.length;
            for (let i = 0; i < numCategory; i++) {
                let fieldValue = "";
                let numCommandsInCategory = fieldsToAdd[i][1].length;
                for (let j = 0; j < numCommandsInCategory; j++) {
                    fieldValue += "`" + fieldsToAdd[i][1][j] + "` ";
                }
                helpEmbed.addField(fieldsToAdd[i][0], fieldValue);
            }
            message.channel.send(helpEmbed);
        }
        else {
            const prefix = data.Prefix;
            helpEmbed = new Discord.MessageEmbed()
                .setColor('#FF69B4')
                .setTitle(`${command.name.charAt(0).toUpperCase() + command.name.slice(1)} help`)
                .addFields(
                    { name: command.description, value: `Syntax: ${prefix}${command.name} ${command.syntax}` },
                );
            message.channel.send(helpEmbed);
        }
    }
};
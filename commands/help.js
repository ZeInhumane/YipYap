const Discord = require('discord.js');
const findPrefix = require('../functions/findPrefix');

module.exports = {
    name: "help",
    description: "Help yourself uwu",
    syntax: "{Command to check} / none",
    cooldown: 5,
    category: "Utility",
    async execute(message, args) {
        const client = require('../index.js').client;
        
        //Getting the prefix from db
        const prefix = await findPrefix(message.guild.id);
        message.channel.send(`type ${prefix}help + {command name for specific help on that command}`);
        const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));

        // Check if user want specific help
        if (!command || args[0] == undefined) {
            // General help
            let helpEmbed = new Discord.MessageEmbed()
                .setColor('#FF69B4')
                .setTitle('Enter this server for updates on the bot \n https://discord.gg/cJgAG3W%7D');
            let fieldsToAdd = [];
            for (let commandName of client.commands.keys()) {
                let categoryExists = false;
                let commandCategory = client.commands.get(commandName).category;

                // Skips adding admin command if user is not admin
                if (!(message.author.id == "752724534028795955" || message.author.id == "344431410360090625" || message.author.id == "272202473827991557") && commandCategory == "Admin") {
                    continue;
                }

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

            let numCategory = fieldsToAdd.length;
            for (let i = 0; i < numCategory; i++) {
                let fieldValue = "";
                let numCommandsInCategory = fieldsToAdd[i][1].length;
                for (let j = 0; j < numCommandsInCategory; j++) {
                    fieldValue += "`" + fieldsToAdd[i][1][j] + "` ";
                }
                helpEmbed.addField(fieldsToAdd[i][0], fieldValue);
            }
            message.channel.send({embeds: [helpEmbed]});
        }
        else {
            // Specific help
            helpEmbed = new Discord.MessageEmbed()
                .setColor('#FF69B4')
                .setTitle(`${command.name.charAt(0).toUpperCase() + command.name.slice(1)} help`)
                .addFields(
                    { name: command.description, value: `Syntax: ${prefix}${command.name} ${command.syntax}` },
                );
            message.channel.send({embeds: [helpEmbed]});
        }
    }
};
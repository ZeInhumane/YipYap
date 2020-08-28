module.exports = {
    name: "help",
    description: "Help command",
    execute(message, args) {
        const Discord = require('discord.js');
        message.channel.send('type help + {command name for specific help on that command}');
        messageArg = message.content.slice(4).split(" ");
        switch (messageArg) {
            case "":
                const helpEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('All commands')
                    .addFields(
                        { name: 'command1', value: "battle" },
                        { name: 'command2', value: "start" },
                        { name: 'command3', value: "nothing yet" }
                    )
                    .addField('To get help for each command, do =help (command name)')
                message.channel.send(helpEmbed);
        }
    },
    // probably change this to switch statement cuz it obviously does not work
    aname: "starthelp",
    adescription: "starthelp",
    aexecute(message, args) {
        const Discord = require('discord.js');
        message.channel.send('starthelp');
    },
    bname: "battlehelp",
    bdescription: "Help command",
    bexecute(message, args) {
        const Discord = require('discord.js');
        message.channel.send('battlehelp');
    },
    cname: "gayhelp",
    cdescription: "Help command",
    cexecute(message, args) {
        const Discord = require('discord.js');
        message.channel.send('gayhelp');
    },
};
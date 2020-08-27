module.exports = {
    name: "help",
    description: "Help command",
    execute(message, args) {
        const Discord = require('discord.js');
        message.channel.send('type help + {command name for specific help on that command}');
    },
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
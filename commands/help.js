module.exports = {
    name: "help",
    description: "Help command",
    execute(message, args) {
        const Discord = require('discord.js');
        message.channel.send('type help + {command name for specific help on that command}');
    },
    name: "starthelp",
    description: "starthelp",
    execute(message, args) {
        const Discord = require('discord.js');
        message.channel.send('starthelp');
    },
    name: "battlehelp",
    description: "Help command",
    execute(message, args) {
        const Discord = require('discord.js');
        message.channel.send('battlehelp');
    }
    name: "gayhelp",
    description: "Help command",
    execute(message, args) {
        const Discord = require('discord.js');
        message.channel.send('gayhelp');
    },
};
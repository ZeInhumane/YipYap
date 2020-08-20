module.exports = {
    name: "start",
    description: "Sets up a new player",
    execute(message, args) {
        const Discord = require('discord.js');
        message.channel.send('Successful registration');
    }
}
const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token, bot_age } = require('./config.json');

client.once('ready', () => {
    console.log(prefix);
    console.log(token);
    console.log(bot_age);
});

client.login(token);

client.on('message', message => {
    if (message.content === `${prefix}start`) {
        message.channel.send('Successful registration');
    }
});
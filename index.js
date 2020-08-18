const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
    console.log('ready');
});

client.login('NzQ1Mjc1MjkxNzg1NDk0NTcx.XzvZtA.TKTcChDiOjH9waCcOWXBuV0r_5g');

client.on('message', message => {
    if (message.content === '!start') {
        message.channel.send('Successful registration');
    }
});
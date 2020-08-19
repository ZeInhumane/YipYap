const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token, bot_age } = require('./config.json');

client.once('ready', () => {
    console.log(prefix);
    console.log(bot_age);
});

client.login(token);

client.on('message', message => {
    if (message.content === `${prefix}start`) {
        message.channel.send('Successful registration');
    }
    if (message.content === `${prefix}battle`) {
        console.log("emoji is")
        console.log(message.guild.emojis.cache.find(emoji => emoji.name === '⚔️'))
        message.channel.send("Battle Start! :crossed_swords:")
            .then(botMessage => {
                botMessage.react("⚔️");
                botMessage.react("🛡️");});
                //botMessage.react(message.guild.emojis.cache.find(emoji => emoji.name === 'crossed_swords'))});

    }
});
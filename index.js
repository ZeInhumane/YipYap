const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, bot_age } = require('./config.json');

client.once('ready', () => {
    console.log(prefix);
    console.log(bot_age);
});

client.login(process.env.token);

client.on('message', message => {
    if (message.content === `${prefix}start`) {
        message.channel.send('Successful registration');
    }
    if (message.content === `${prefix}battle`) {
        message.channel.send("Battle Start! :crossed_swords:");
        const reactionEmoji = message.guild.emojis.cache.find(emoji => emoji.name === 'jarjarbinks');
        message.react(reactionEmoji);

    }
});
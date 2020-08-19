const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token, bot_age } = require('./config.json');
const battle = require("./battle.js");

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
        message.channel.send("Battle Start! :crossed_swords:")
            .then(botMessage => {
                botMessage.react("⚔️");
                botMessage.react("🛡️");
            })
            .then(() => {
                const filter = (reaction, user) => (reaction.emoji.name === '⚔️' || reaction.emoji.name === '🛡️');
                const collector = embedMsg.message.createReactionCollector(filter, { time: 10000 });
                collector.on('collect', r => r.emoji.name === '⚔️' ?
                    console.log('Reacted Yes') : console.log('Reacted No'));
            })

    }
});
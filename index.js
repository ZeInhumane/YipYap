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
        const battleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Battle Start! :crossed_swords:')
            .setURL('https://discord.js.org/')
            .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
            .setDescription('Some description here')
            .setThumbnail('https://i.imgur.com/wSTFkRM.png')
            .addFields(
                { name: 'Regular field title', value: 'Some value here' },
                { name: '\u200B', value: '\u200B' },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            .addField('Inline field title', 'Some value here', true)
            .setImage('https://i.imgur.com/wSTFkRM.png')
            .setTimestamp()
            .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

        message.channel.send(battleEmbed)
            .then(botMessage => {
                botMessage.react("⚔️");
                botMessage.react("🛡️");
            })
            .then(() => {
                const filter = (reaction, user) => (reaction.emoji.name === '⚔️' || reaction.emoji.name === '🛡️');
                const collector = battleEmbed.message.createReactionCollector(filter, { time: 10000 });
                collector.on('collect', r => r.emoji.name === '⚔️' ?
                    console.log('Reacted Yes') : console.log('Reacted No'));
            });


    }
});
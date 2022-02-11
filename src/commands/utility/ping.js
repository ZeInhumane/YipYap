const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Returns bot and API latency in milliseconds.',
    syntax: "",
    cooldown: 10,
    category: "Utility",
    async execute(message) {
        const client = require('../index.js').client;
        const msg = await message.channel.send('🏓 Pinging...');

        const embed = new MessageEmbed()
            .setColor('#000000')
            .setTitle('🏓 Pong!')
            .setDescription(`Bot Latency is **${Math.floor(msg.createdTimestamp - message.createdTimestamp)} ms** \nAPI Latency is **${Math.round(client.ws.ping)} ms**`);

        message.channel.send({ embeds: [embed] });
    },
};
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Returns bot and API latency in milliseconds.',
    syntax: "",
    cooldown: 10,
    category: "Utility",
    async execute({ message, client }) {
        const msg = await message.channel.send('🏓 Pinging...');

        try {
            const embed = new MessageEmbed()
                .setColor('#000000')
                .setTitle('🏓 Pong!')
                .setDescription(`Bot Latency is **${Math.floor(msg.createdTimestamp - message.createdTimestamp)} ms** \nAPI Latency is **${Math.round(client.ws.ping)} ms**`);

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.log(client.ws);
            console.log(error);
        }

    },
};
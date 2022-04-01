const { MessageEmbed } = require('discord.js');
const CommandInterface = require('../interfaces/CommandInterface');

module.exports = new CommandInterface({
    name: 'ping',
    description: 'Returns bot and API latency in milliseconds.',
    cooldown: 10,
    syntax: "",
    category: "Utility",

    async execute(client, interaction) {
        const msg = await interaction.channel.send('🏓 Pinging...');

        const embed = new MessageEmbed()
            .setTitle('🏓 Pong!')
            .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL() })
            .setColor("RANDOM")
            .setDescription(`Bot Latency is **${Math.floor(msg.createdTimestamp - interaction.createdTimestamp)} ms** \nAPI Latency is **${Math.round(client.ws.ping)} ms**`);
        interaction.reply({ embeds: [embed] });
    },
});


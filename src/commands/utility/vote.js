const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
module.exports = {
    name: 'vote',
    description: 'Vote for the bot on top.gg!',
    syntax: "",
    cooldown: 10,
    aliases: ['v'],
    category: "Utility",
    async execute({ message, client }) {
        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setURL('https://top.gg/bot/745275291785494571/vote')
                    .setLabel('Vote 1')
                    .setStyle('LINK'),
                new Discord.MessageButton()
                    .setURL('https://discordbotlist.com/bots/yipyap')
                    .setLabel('Vote 2')
                    .setStyle('LINK'),
            );
        const embed = new MessageEmbed()
            .setColor(client.config.colors.primary)
            .setTitle('Vote for me!')
            .setDescription('Currently, there are no perks for voting for the bot, but if you were so kind as to vote, we will give you 100% of our love!')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));
        message.channel.send({ embeds: [embed], components: [row] });
    },
};
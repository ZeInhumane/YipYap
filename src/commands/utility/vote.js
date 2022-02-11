const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'vote',
    description: 'Vote for the bot on top.gg!',
    syntax: "",
    cooldown: 10,
    aliases: ['v'],
    category: "Utility",
    async execute(message) {

        const embed = new MessageEmbed()
            .setColor('#ADD8E6')
            .setTitle('Currently, there are no perks for voting for the bot, but if you were so kind as to vote, we will give you 100% of our love!')
            .addField("Vote here: https://top.gg/bot/745275291785494571/vote", "​");
        message.channel.send({ embeds: [embed] });
    },
};
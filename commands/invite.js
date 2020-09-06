const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'invite',
    description: 'Invite bot',
    cooldown:10,
    async execute(message, args) {

        const embed = new MessageEmbed()
            .setColor('#000000')
            .setTitle('🏓 Pong!')
            .addField("Bot invite: https://discord.com/oauth2/authorize?client_id=745275291785494571&permissions=43072&scope=bot", "​")
            .addField("Server invite: https://discord.gg/cJgAG3W", "​");
            message.channel.send(embed);
    }
}
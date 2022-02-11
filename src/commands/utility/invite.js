const Discord = require("discord.js");

module.exports = {
    name: "invite",
    description: "I'm pleasantly surprised that anyone would use this XD. But yeah invite the bot if you want to, its greatly appreciated if you report any bugs.. I may even kiss you",
    syntax: "",
    cooldown: 10,
    category: "Utility",
    async execute(message, args) {

        const embed = new Discord.MessageEmbed()
            .setTitle("Invite the bot")
            .setColor("#000000")
            .addField("Bot invite: https://discord.com/oauth2/authorize?client_id=745275291785494571&scope=bot&permissions=262208", "​")
            .addField("Server invite: https://discord.gg/cJgAG3W", "​");
        message.channel.send({ embeds: [embed] });
    },
};
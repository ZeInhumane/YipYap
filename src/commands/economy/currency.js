const User = require('../../models/user');
const Discord = require('discord.js');
const findPrefix = require('../../functions/findPrefix');

module.exports = {
    name: "currency",
    description: "Shows the amount of currency a player has",
    syntax: "",
    cooldown: 5,
    aliases: ['cash', 'balance', 'fat', 'bal'],
    category: "Economy",
    execute({ message }) {
        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                // Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }
            let name = message.member.user.tag.toString();
            // Removes user tag
            name = name.split("#", name.length - 4)[0];

            const embed = new Discord.MessageEmbed()
                .setTitle(name + `'s Balance`)
                .setColor('#000000')
                .addField(user.currency + "<:cash_24:751784973488357457>​", "​");
            message.channel.send({ embeds: [embed] });
        });
    },
};
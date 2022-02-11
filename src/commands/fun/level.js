const User = require('../../models/user');
const Discord = require('discord.js');
const findPrefix = require('../../functions/findPrefix');

module.exports = {
    name: "level",
    description: "Checks for level, basically a simplified version of profile.",
    syntax: "",
    cooldown: 5,
    category: "Fun",
    execute({ message }) {
        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                // Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }
            // exp needed for each level
            const next_lvl = Math.floor(user.level * (user.level / 10 * 15));
            const to_upgrade = next_lvl - user.exp;

            // put into discord
            let name = message.member.user.tag.toString();
            // Removes tag from name
            name = name.split("#", name.length - 4)[0];

            const embed = new Discord.MessageEmbed()
                .setTitle(name + "'s level information")
                .setColor('#000000')
                .addField('Level: ', ` ${user.level}`, true)
                .addField('Current Experience: ', `${user.exp}/${next_lvl}`, true)
                .addField('Experience to next level: ', ` ${to_upgrade}`, true)
                .addField('Total Available Special Points: ', ` ${user.sp}`, true);
            message.channel.send({ embeds: [embed] });
        });
    },
};

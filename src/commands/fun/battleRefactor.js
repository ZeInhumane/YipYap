const Discord = require('discord.js');
const botLevel = require('../../models/botLevel');
const User = require('../../models/user');
const findPrefix = require('../../functions/findPrefix');
const ticketUtil = require('./utils/ticketUtil.js');
const battleUtil = require('./utils/battleUtil.js');
const Battle = require('./test/battleInterface.js');

module.exports = {
    name: "new",
    description: "Battling is the primary means of war. 'The war of war is very pog' -Sun Tzu",
    syntax: "",
    cooldown: 20,
    aliases: ['new'],
    category: "Fun",
    async execute({ message }) {
        // Find user, if user not found, prompt user to create new user
        const user = await User.findOne({ userID: message.author.id });
        if (!user) {
            const prefix = await findPrefix(message.guild.id);
            message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
            return;
        }

        // Get effects messages to display in embed later
        const { expMsg, goldMsg } = await ticketUtil.ticketEffects(message.author.id, user, message);

        const locationInfo = await botLevel.findOne({ 'Location': user.location });

        await message.reply(`${locationInfo}`);

        const enemy = battleUtil.makeNewEnemy(user, locationInfo);

        // Retrieve player name and stats from discord user
        const player = { name: user.player.name };

        for (const stat in user.player.baseStats) {
            player[stat] = Math.round(user.player.baseStats[stat] * (1 + user.player.additionalStats[stat].multi / 100) + user.player.additionalStats[stat].flat);
        }

        // Store original hp to display in battle
        const originalPlayerHP = player.hp;
        const originalEnemyHP = enemy.hp;

        // Makes battle embed
        const battleEmbed = new Discord.MessageEmbed()
            .setColor(currentColor)
            .setTitle(user.player.name + '\'s ultimate charge: ' + ultimate + "/100")
            .setAuthor({ name: message.member.user.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription(displayUltimateString)
            .addFields(
                { name: 'Experience Ticket', value: expMsg, inline: true },
                { name: 'Gold Ticket', value: goldMsg, inline: true },
                { name: 'Player HP', value: `Lvl ${user.level} **${player.name}**'s **HP**: ${player.hp}/${originalPlayerHP}` },
                { name: 'Enemy HP', value: `Lvl ${enemy.level} **${enemy.name}**'s **HP**: ${enemy.hp}/${originalEnemyHP}` },
            )
            .setImage(locationInfo.LocationImage)
            .setFooter({ text: `${locationInfo.Description}` });

        const battleMessage = await message.channel.send({ embeds: [battleEmbed], components: [row] });
    },
};

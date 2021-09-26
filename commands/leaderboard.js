const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "leaderboard",
    description: "Reality check on your ego. Only valid arguments are level and currency for now.",
    syntax: "{Checks by requirement} {Leaderboard size}",
    cooldown: 10,
    aliases: ['top'],
    category: "Fun",
    async execute(message, args) {
        // Finds arguments no matter the position
        // Finds sortBy
        let sortBy = "currency";
        let sortByIndex = args.findIndex(arg => /^(currency|level)$/gi.test(arg));
        if (sortByIndex != -1) {
            // Extracts sortBy
            sortBy = args[sortByIndex];
            // Removes sortBy from args list
            args.splice(sortByIndex, 1);
        }

        // Finds leaderboardSize
        let leaderboardSize = 5;
        let leaderboardSizeIndex = args.findIndex(arg => /^[1-9]\d*$/g.test(arg))
        if (leaderboardSizeIndex != -1) {
            // Extracts leaderboardSize
            leaderboardSize = parseInt(args[leaderboardSizeIndex]);
            // Removes leaderboardSize from args list
            args.splice(leaderboardSizeIndex, 1);
        }

        if (leaderboardSize > 10) {
            leaderboardSize = 10
        };

        // Filter so only user can interact with the buttons
        filter = i => {
            i.deferUpdate();
            return i.user.id === message.author.id;
        };
        row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('currency')
                    .setLabel('')
                    .setStyle('DANGER')
                    .setEmoji('<:cash_24:751784973488357457>'),
                new Discord.MessageButton()
                    .setCustomId('level')
                    .setLabel('🎚️')
                    .setStyle('DANGER'),
            );
        // Turns type selected to green
        row.components.find(button => button.customId == sortBy).setStyle('SUCCESS');

        let lb, botEmbedMessage;

        User.find({})
            .sort("-" + sortBy)
            .limit(leaderboardSize)
            .exec(function (err, user) {
                lb = "Global leaderboard for " + sortBy + "\n";
                for (let i = 0; i < leaderboardSize; i++) {
                    lb += `\n${(i + 1)}. ${user[i].player.name}\n${user[i][sortBy]} ${sortBy}`;
                }

                message.channel.send({ content: "``` " + "\n" + lb + "```", components: [row] })
                    .then(botMessage => {
                        botEmbedMessage = botMessage;
                        leaderboardUpdate();
                    });
            });

        async function leaderboardUpdate() {
            let isExpired = false;
            while (!isExpired) {
                // awaits Player reaction
                await botEmbedMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                    .then(async i => {
                        // Turns type previously selected to red
                        row.components.find(button => button.customId == sortBy).setStyle('DANGER');

                        sortBy = i.customId;

                        // Turns type selected to green
                        row.components.find(button => button.customId == sortBy).setStyle('SUCCESS');

                        User.find({})
                            .sort("-" + sortBy)
                            .limit(leaderboardSize)
                            .exec(function (err, user) {
                                lb = "Global leaderboard for " + sortBy + "\n";
                                for (let i = 0; i < leaderboardSize; i++) {
                                    lb += "\n" + (i + 1) + "." + user[i].player.name + "\n " + user[i][sortBy] + ` ${sortBy}`;
                                }

                                botEmbedMessage.edit({ content: "``` " + "\n" + lb + "```", components: [row] });
                            });
                    })
                    .catch(async err => {
                        botEmbedMessage.edit({ content: "``` " + "\n" + lb + "```", components: [] });
                        isExpired = true;
                    });
            }
        }
    },
};

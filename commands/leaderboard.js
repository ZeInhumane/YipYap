const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "leaderboard",
    description: "Checks leaderboard. Valid sorts args are **currency,level**",
    syntax: "{Checks by requirement} {Leaderboard size}",
    cooldown: 10,
    aliases: ['top'],
    category: "Fun",
    execute(message, args) {
        let sortBy;
        let leaderboardSize = parseInt(args[1]);
        if(leaderboardSize > 5) leaderboardSize = 5;
        // Find First 10 News Items
        switch (args[0]) {
            case "currency":
                sortBy = "currency";
                break;
            case "level":
                sortBy = "level";
                break;
            default:
                message.channel.send("Please enter a valid category to sort by");
                return;
        }
        User.find({})
            .sort("-" + sortBy)
            .limit(leaderboardSize)
            .exec(function (err, user) {
                let lb = "Global leaderboard for " + sortBy + "\n";
                for (let i = 0; i < leaderboardSize; i++) {
                    lb += "\n" + (i + 1) + "." + user[i].player.name + "\n " + user[i][sortBy] + ` ${sortBy}`;
                }
                message.channel.send("``` " + "\n" + lb + "```");
            });
    },
};

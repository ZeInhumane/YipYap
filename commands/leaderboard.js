const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "leaderboard",
    description: "Checks leaderboard",
    syntax: "{Checks by requirement} {Leaderboard size}",
    cooldown: 10,
    aliases: ['top'],
    category: "Fun",
    execute(message, args) {
        var sortBy;
        const client = require('../index.js').client;
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
            .exec(function (err, user) {
                var lb = "Leaderboard for " + sortBy + "\n";
                console.log("it is entering the before the for loop");
                if (args[1] < 0 || args[1] > 3 || args[1] == null) {
                    args[1] = 3;
                }
                console.log(' this is sorted by' + sortBy);
                for (var i = 0; i < args[1]; i++) {
                    console.log(user[i].userID);
                    lb += "\n" + client.users.cache.get(user[i].userID).tag + "\n " + user[i][sortBy] + ":person_fencing: ";
                }
                message.channel.send("``` " + "\n" + lb + "```");
            });
    },
};
    
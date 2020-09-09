const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "leaderboard",
    description: "Checks leaderboard",
    cooldown: 10,
    aliases: ['top'],
    execute(message, args) {
        const client = require('../index.js').client;
        // Find First 10 News Items
        switch (args[0]) {
            case "currency":
                console.log("it is entering the case");
                User.find({})
                    .sort({ currency: -1 })
                    .exec(function (err, user) {
                        var lb = "Leaderboard for currency \n";
                        console.log("it is entering the before the for loop");
                        if(args[1] < 0 || args[1] > 3 || args[1] == null) {
                            args[1] = 3;
                        }
                        for (var i = 0; i < args[1]; i++) {
                            console.log(user[i].userID);
                            lb += "\n" + client.users.cache.get(user[i].userID).tag + "\n " + user[i].currency + "<:cash_24:751784973488357457>";
                            console.log("user[i}.currency" + user[i].currency);
                            console.log("it is entering the for loop");
                        }
                        message.channel.send("``` " + "\n" + lb + "```");
                    });
                break;
            default:
                message.channel.send("Please enter a valid category to sort by");
        }
    },
};

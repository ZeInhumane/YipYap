const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "daily",
    description: "Claims a daily",
    cooldown: 86400,
    aliases: ['dailies'],
    category: "Economy",
    execute(message, args) {
        User.findOne({ userID: message.author.id }, (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
            }
            else {
                user.currency += 5;
                user.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
                message.channel.send('You have successfully claimed your daily of ' + 5 + "<:cash_24:751784973488357457>​");
                message.channel.send("This database is gonna be purged so there really is no point in spamming daily, abby")
                message.channel.send('you now have ' + user.currency + '<:cash_24:751784973488357457>');
            }
        });
    }
}
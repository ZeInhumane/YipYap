const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "daily",
    description: "Claims a daily",
    aliases: ['dailies'],
    execute(message, args) {
        User.findOne({ userID: message.author.id }, (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
            }
            else {
                user.currency += 5;
                message.channel.send(user.currency);
                user.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
                message.channel.send('You have successfully claimed your daily of ' + user.currency + ":money_with_wings:");
                message.channel.send("This database is gonna be purged so there really is no point in spamming daily, abby")
            }
        });
    }
}
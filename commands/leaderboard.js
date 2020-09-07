const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "leaderboard",
    description: "Checks  leaderboard",
    cooldown: 86400,
    aliases: ['top'],
    execute(message, args) {
        User.find({}, "currency userID", function(err, docs) {
            if (err) console.log(err);
            console.log(docs);
            })
            .sort([["userID", 1], ["currency", "descending"]]);
            message.channel.send(User.currency);
    },
};
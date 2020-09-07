const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const currency = require('./currency');

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
            .sort([["currency", 1], ["userID", "descending"]]);
            message.channel.send(currency);
    },
};
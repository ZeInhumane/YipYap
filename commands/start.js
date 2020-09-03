const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "start",
    description: "Sets up a new player",
    execute(message, args, user) {
        user = new User({
            _id: mongoose.Types.ObjectId(),
            userID: message.author.id,
            currency: 0,
        });
        user.save()
        .then(result => console.log(result))
        .catch(err => console.error(err));
        console.log('user!' + message.author.id + 'registered');
        var localCurrency = User.findOne({ userID : message.author.id });
        var aCurrency = localCurrency[0];
        message.channel.send('Successful registration you start with' + aCurrency);
    },
}
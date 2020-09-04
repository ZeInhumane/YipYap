const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "start",
    description: "Sets up a new player",
    execute(message, args, user) {
        User.findOne({ userID: message.author.id }, (err, user) => {
            if (err) console.log(err);
            if (user == null) {
                user = new User({
                    _id: mongoose.Types.ObjectId(),
                    userID: message.author.id,
                    currency: 0,
                });
                user.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
                message.channel.send('You have been successfully registered');
            }
            else {
                message.channel.send("You have already made a player");
            }
        });
    }
};
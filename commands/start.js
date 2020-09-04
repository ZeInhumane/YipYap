const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const battle = require('./battle.js');

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
                    player: new Hero(message.member.user.tag.toString().split("#", user.length - 4)[0], 50, 5, 5, 5)
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
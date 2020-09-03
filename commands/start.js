const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "start",
    description: "Sets up a new player",
    execute(message, args) {
        user = User.findOne({ "userID": message.author.id });
        console.log("This is the user " + user);
        //if (err) {
            user = new User({
                _id: mongoose.Types.ObjectId(),
                userID: message.author.id,
                currency: 0,
            });
            user.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));
            console.log('user!' + message.author.id + 'registered');
        //}
        //else {
            message.channel.send("You have already made a player");
        //}
    }
};
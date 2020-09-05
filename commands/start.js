const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "start",
    description: "Sets up a new player",
    execute(message, args) {
        // Creates hero class
        class Hero {
            constructor(name, hp, attack, defense, speed) {
                this.name = name;
                this.hp = hp;
                this.attack = attack;
                this.defense = defense;
                this.speed = speed;
            }
        }
        User.findOne({ userID: message.author.id }, (err, user) => {
            if (err) console.log(err);
            if (user == null) {
                name = message.member.user.tag.toString();
                name = name.split("#", m.length - 4);
                name = name[0];
                user = new User({
                    _id: mongoose.Types.ObjectId(),
                    userID: message.author.id,
                    currency: 0,
                    player: new Hero(name, 50, 5, 5, 5)
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
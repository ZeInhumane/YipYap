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
            // Method to check for damage taken by hero
            takeDamage(damage) {
                let attMulti = damage / this.defense;
                if (attMulti < 0.4) {
                    attMulti = 0.4;
                }
                else if (attMulti > 1.5) {
                    attMulti = 1.5;
                }
                var damageTaken = Math.floor((damage + Math.floor((damage - this.defense) / 4)) * attMulti);
                console.log(playerAction);
                if (playerAction == "🛡️") {
                    // Change it later so higher level reduces damagetaken too
                    damageTaken *= (100 - this.defense) / 100;
                }
                // Ensures damage taken is not negative
                if (damageTaken < 0) {
                    damageTaken = 0;
                }
                damageTaken = Math.floor(damageTaken);
                this.hp -= damageTaken;
                return damageTaken;
            }
        }
        User.findOne({ userID: message.author.id }, (err, user) => {
            if (err) console.log(err);
            if (user == null) {
                user = new User({
                    _id: mongoose.Types.ObjectId(),
                    userID: message.author.id,
                    currency: 0,
                    player: new Hero((m = message.member.user.tag.toString()) => {return m.split("#", m.length - 4)[0]} , 50, 5, 5, 5)
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
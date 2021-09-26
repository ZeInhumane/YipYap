const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "start",
    description: "Sets up a new player. Maybe consider getting the starter pack",
    syntax: "",
    cooldown: 5,
    category: "Fun",
    execute(message, args) {
        // Creates hero class
        class Hero {
            constructor(name, hp, attack, defense, speed) {
                this.name = name;
                this.baseStats = { hp: hp, attack: attack, defense: defense, speed: speed }
                this.additionalStats = { hp: { flat: 0, multi: 0 }, attack: { flat: 0, multi: 0 }, defense: { flat: 0, multi: 0 }, speed: { flat: 0, multi: 0 } }
                this.helmet = {};
                this.leggings = {};
                this.chestplate = {};
                this.boots = {};
                this.weapon = {};
            }
        }
        
        User.findOne({ userID: message.author.id }, (err, user) => {
            if (err) console.log(err);
            if (user == null) {
                let name = message.member.user.tag.toString();
                name = name.split("#", name.length - 4);
                name = name[0];
                user = new User({
                    _id: mongoose.Types.ObjectId(),
                    userID: message.author.id,
                    username: message.member.user.tag,
                    currency: 0,
                    level: 1,
                    exp: 0,
                    sp: 0,
                    location: 1,
                    player: new Hero(name, 50, 5, 5, 5),
                    inv: { "Apple": { "quantity": 1, "emote": "🍎", "type": "fruit" } },
                });
                user.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
                message.channel.send('You have been successfully registered, get free items using starterpack command! Use help command to find useful commands.');
            }
            else {
                message.channel.send("You have already made a player");
            }
        });
    }
};
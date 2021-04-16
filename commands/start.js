const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "start",
    description: "Sets up a new player",
    syntax: "",
    category: "Fun",
    execute(message, args) {
        // Creates hero class
        class Hero {
            constructor(name, hp, attack, defense, speed) {
                this.name = name;
                this.hp = hp;
                this.attack = attack;
                this.defense = defense;
                this.speed = speed;
                this.helmet = {};
                this.leggings = {};
                this.chestplate = {};
                this.boots = {};
                this.weapon = {};
            }
        }
        // class Item {
        //     constructor(itemName, itemQuantity) {
        //         this.itemName = itemName;
        //         this.itemQuantity = itemQuantity;
        //      }
        // }
        User.findOne({ userID: message.author.id }, (err, user) => {
            if (err) console.log(err);
            if (user == null) {
                var name = message.member.user.tag.toString();
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
                    location:1,
                    player: new Hero(name, 50, 5, 5, 5),
                    inv: {"Apple": {"quantity": 1,"emote": "🍎","type": "fruit"}},
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
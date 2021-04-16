const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "starter",
    description: "For new players to claim and get some stuff",
    syntax: "",
    cooldown: 3,
    aliases: ['starter'],
    category: "Economy",
    execute(message, args) {
        const itemName = "Common Treasure Chest";
        const itemQuantity = 5;
        const type = "Chest";
        const commonTreasureChestEmote = "<:CommonChest:819856620572901387>"
        User.findOne({ userID: message.author.id }, (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
            }
            else if(user.currency > 0 || user.exp > 0 || user.level > 1 || Object.keys(user.inv).length != 1 || user.inv.Apple.quantity != 1){
                message.channel.send("This starter pack is for newbies, dont take their stuff u pig!")
            }
            else{
                let newbie = user.player.name;
                user.currency += 20;
                user.inv[itemName] = {"quantity": itemQuantity, "emote": commonTreasureChestEmote, "type": type};
                user.markModified('inv');
                user.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
                message.channel.send(`${newbie} has successfully claimed ${newbie}'s starter pack (only one per user)`+
                `\n ${newbie} gained 20 <:cash_24:751784973488357457>​`+
                `\n ${newbie} gained 5 <:CommonChest:819856620572901387>`)
            }
        });
    }
}
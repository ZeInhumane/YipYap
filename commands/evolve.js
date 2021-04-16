const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = {
    name: "evolve",
    description: "Upgrade lootboxes. Every 5 of previous tier gets the next tier upgrade, this also consumes the lootbox",
    aliases: ['ev'],
    syntax: "{evolution type}",
    category: "Fun",
    execute(message, args) {
        const evoType = args[0];
        const itemQuantity = 1;
        const usedForEvolution = 5;
        let itemName;
        let preEvolution;
        let chestEmote;
        const type = "Chest"
        switch (evoType) {
            case "common":
                itemName = "Uncommon Treasure Chest"
                preEvolution = "Common Treasure Chest"
                chestEmote = "<:UncommonChest:820272834348711976>"
                break;
            case "uncommon":
                itemName = "Rare Treasure Chest"
                preEvolution = "Uncommon Treasure Chest"
                chestEmote = "<:RareChest:820273250629582858>"
                break;
            case "rare":
                itemName = "Epic Treasure Chest"
                preEvolution = "Rare Treasure Chest"
                chestEmote = "<:EpicChest:820273750289023007>"
                break;
            case "epic":
                itemName = "Legendary Treasure Chest"
                preEvolution = "Epic Treasure Chest"
                chestEmote = "<:LegendaryChest:820274118817611777>"
                break;
            case "legendary":
                itemName = "Mythic Treasure Chest"
                preEvolution = "Legendary Treasure Chest"
                chestEmote = "<:MythicChest:820274344059994122>"
                break;
            default:
                message.channel.send("Please enter a valid rarity to evolve by")
                return
        }

        User.findOne({ userID: message.author.id }, (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
            }
            else {
                User.findOne({ userID: message.author.id }, (err, user) => {
                    function evolve() {
                        user.inv[preEvolution].quantity -= usedForEvolution;
                        if (user.inv[preEvolution].quantity == 0) {
                            delete user.inv[preEvolution];
                        }
                        message.channel.send(`:white_check_mark: You have evolved 5 ${preEvolution} into 1 ${itemName}!!`)
                    }
                    function errorMessage() {
                        message.channel.send(`You do currently have ${user.inv[preEvolution].quantity} ${preEvolution} but you need ${usedForEvolution} ${preEvolution} to evolve ${preEvolution} into a ${itemName} `)
                    }
                    if (user.inv[itemName]) {
                        if (user.inv[preEvolution].quantity < usedForEvolution) {
                            errorMessage()
                        } else {
                            user.inv[itemName].quantity += itemQuantity;
                            evolve();
                        }
                    }
                    else {
                        if (user.inv[preEvolution].quantity < usedForEvolution) {
                            errorMessage()
                        } else {
                            user.inv[itemName] = { "quantity": itemQuantity, "emote": chestEmote, "type": type };
                            evolve();
                        }
                    }
                    user.markModified('inv');
                    user.save()
                        .then(result => console.log(result))
                        .catch(err => console.error(err));
                });
            }
        });
    }
}
const Discord = require('discord.js');
module.exports = {
    execute(message, winner, loser,location) {
        async function async() {
            const User = require('../../models/user');
            const lvl_edit = require('./lvl_edit.js');
            
            let winEmbed = new Discord.MessageEmbed()
                .setTitle(`You Won!`)
                .setColor('#000001');
            //Lets the money earned be multiplied by gold
            let moneyEarned = Math.floor(loser.level * location.Level.Rewards.GoldMultiplier);
            let commonTreasureChest = false;
            let weaponPack = false;
            const itemName = ["Common Treasure Chest", 'Swords Pack'];
            const itemQuantity = 1;
            const type = ["Chest", 'Pack'];

            const commonTreasureChestEmote = "<:CommonChest:819856620572901387>"
            //This takes the experience multiplier from the location
            let experienceMultiplier = location.Level.Rewards.ExpMultiplier;
            // get embed text from lvl_edit
            const embedText = lvl_edit.execute(message, winner, loser, experienceMultiplier);
            // change this to change the chances of getting a lootbox currently set at 50%
            if (Math.floor(Math.random() * 1 + 1) == 1) {
                commonTreasureChest = true;
            }
            //change this to change the chances of getting a sword pack
            if (Math.floor(Math.random() * 1 + 1) == 1) {
                weaponPack = true;
            }
            User.findOne({ userID: winner.userID }, async (err, user) => {
                let isdrops = [commonTreasureChest, weaponPack];
                for (i = 0; i < isdrops.length; i++) {
                    if (isdrops[i] == true) {
                        if (user.inv[itemName[i]]) {
                            user.inv[itemName[i]].quantity += itemQuantity;
                        }
                        else {
                            user.inv[itemName[i]] = { "quantity": itemQuantity, "emote": commonTreasureChestEmote, "type": type[i] };

                        }
                        user.markModified('inv');
                    }
                }

                user.currency += moneyEarned;
                user.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
            });

            winEmbed.addField(`${winner.player.name} defeated ${(loser.name || loser.player.name)}!`,
                `${winner.player.name} earned ${moneyEarned}<:cash_24:751784973488357457>\n${embedText}`);
            if (commonTreasureChest == true) {
                winEmbed.addField(`You've gotten: ${itemQuantity} <:CommonChest:819856620572901387> ${itemName[0]}.`, "\u200b");
            }
            if (weaponPack == true) {
                winEmbed.addField(`You've gotten: ${itemQuantity} <:CommonChest:819856620572901387> ${itemName[1]}.`, "\u200b");
            }
            message.channel.send(winEmbed)
        }
        async()
    }
}
const Discord = require('discord.js');
const findItem = require('../../functions/findItem.js');
module.exports = {
    async execute(message, winner, loser, location) {
        const User = require('../../models/user.js');
        const userEffects = require('../../models/userEffects.js');
        const lvl_edit = require('./lvl_edit.js');

        const winEmbed = new Discord.MessageEmbed()
            .setTitle(`You Won!`)
            .setColor('#000001');
        // Lets the money earned be multiplied by gold
        const moneyEarned = Math.floor(loser.level * location.Rewards.GoldMultiplier);
        let goldMulti = 1;
        const drops = [];
        const chestName = ["Common Treasure Chest"];
        // const packNames = ['Swords', 'Boots'];
        const itemQuantity = 1;

        // this line useless for now.... reminder to chance emotes when there are different ones
        // const commonTreasureChestEmote = "<:CommonChest:819856620572901387>"
        // This takes the experience multiplier from the location
        const experienceMultiplier = location.Rewards.ExpMultiplier;
        // get embed text from lvl_edit
        const embedText = await lvl_edit.execute(message, winner, loser, experienceMultiplier);
        // change this to change the chances of getting a lootbox currently set at 25%
        if (Math.floor(Math.random() * 5 + 1) == 5) {
            // since only have 1 treasure chest after all
            drops.push(chestName[0]);
        }

        // const packChance = location.Rewards.Pack;

        // function sum(obj) {
        //     return Object.keys(obj).reduce((sum, key) => sum + parseFloat(obj[key] || 0), 0);
        // }
        // let totalChance = sum(packChance);

        // for (i = 0; i < packNames.length; i++) {
        //     let rng = Math.random()
        //     if (rng <= packChance[packNames[i]] / totalChance) {
        //         drops.push(`${packNames[i]} Pack`)
        //     }
        // }
        await userEffects.findOne({ userID: winner.userID }, async (err, effects) => {
            await User.findOne({ userID: winner.userID }, async (err, user) => {
                if (drops.length != 0) {
                    for (let i = 0; i < drops.length; i++) {
                        if (user.inv[drops[i]]) {
                            user.inv[drops[i]].quantity += itemQuantity;
                        } else {
                            user.inv[drops[i]] = await findItem(drops[i]);
                            user.inv[drops[i]].quantity = itemQuantity;
                        }
                        user.markModified('inv');
                    }
                }
                if (effects != null) {
                    const goldTicketName = Object.keys(effects.tickets).filter(key => key.includes('Gold'));
                    if (goldTicketName.length != 0) {
                        goldMulti = effects.tickets[goldTicketName[0]].multiplier;
                    }
                }

                user.currency += moneyEarned * goldMulti;
                user.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));

                winEmbed.addField(`${winner.player.name} defeated ${(loser.name || loser.player.name)}!`,
                    `${winner.player.name} earned ${moneyEarned * goldMulti}<:cash_24:751784973488357457>\n${embedText}`);

                for (let i = 0; i < drops.length; i++) {
                    // remember to change the emotes when there are different chest emotes available
                    winEmbed.addField(`You've gotten: ${itemQuantity} <:CommonChest:819856620572901387> ${drops[i]}.`, "\u200b");
                }
                message.channel.send({ embeds: [winEmbed] });
            });
        });
    },
};
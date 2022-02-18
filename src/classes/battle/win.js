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
        const lootboxInfo = location.Rewards.Lootbox;
        let goldMulti = 1;
        // const chestName = ["Common Treasure Chest", "Uncommon Treasure Chest", "Rare Treasure Chest", "Epic Treasure Chest", "Legendary Treasure Chest", "Mythic Treasure Chest"];
        // const chestEmote = ["<:CommonChest:819856620572901387>", "<:UncommonChest:820272834348711976>", "<:RareChest:820273250629582858>", "<:EpicChest:820273750289023007>", "<:LegendaryChest:820274118817611777>", "<:MythicChest:820274344059994122>"]

        // This takes the experience multiplier from the location
        const experienceMultiplier = location.Rewards.ExpMultiplier;
        // get embed text from lvl_edit
        const embedText = await lvl_edit.execute(message, winner, loser, experienceMultiplier);

        const drops = [];
        // Math.floor(Math.random() * 1 + 1) == 1  //for 100% chance when testing
        if (Math.random() < 0.2) {
            const dropInfo = Object.values(lootboxInfo);
            const dropNames = Object.keys(lootboxInfo);
            let totalChance = 0;
            for (let i = 0; i < dropInfo.length; i++) {
                totalChance += dropInfo[i].dropChance;
            }
            while (drops.length == 0) {
                for (let i = 0; i < dropNames.length; i++) {
                    const rng = Math.random();
                    if (rng <= dropInfo[i].dropChance / totalChance) {
                        const quantityDropped = Math.floor(Math.random() * dropInfo[i].maxQuantity + dropInfo[i].minQuantity);
                        drops.push([dropNames[i], quantityDropped, dropInfo[i].emote]);
                    }
                }
            }
        }
        await userEffects.findOne({ userID: winner.userID }, async (err, effects) => {
            await User.findOne({ userID: winner.userID }, async (err, user) => {

                if (effects != null) {
                    const goldTicketName = Object.keys(effects.tickets).filter(key => key.includes('Gold'));
                    if (goldTicketName.length != 0) {
                        goldMulti = effects.tickets[goldTicketName[0]].multiplier;
                    }
                }
                winEmbed.addField(`${winner.player.name} defeated ${(loser.name || loser.player.name)}!`,
                    `${winner.player.name} earned ${moneyEarned * goldMulti}<:cash_24:751784973488357457>\n${embedText}`);

                if (drops.length != 0) {
                    for (let i = 0; i < drops.length; i++) {
                        if (user.inv[drops[i][0]]) {
                            user.inv[drops[i][0]].quantity += drops[i][1];
                        } else {
                            user.inv[drops[i][0]] = await findItem(drops[i][0]);
                            user.inv[drops[i][0]].quantity = drops[i][1];
                        }
                        winEmbed.addField(`You've gotten: ${drops[i][1]} ${drops[i][2]} ${drops[i][0]}.`, "\u200b");
                    }
                    user.markModified('inv');
                }


                user.currency += moneyEarned * goldMulti;
                user.save()
                    .catch(err => console.error(err));


                message.channel.send({ embeds: [winEmbed] });
            });
        });
    },
};
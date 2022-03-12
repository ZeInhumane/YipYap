const Discord = require('discord.js');
const findItem = require('../../functions/findItem.js');
const giveWeaponID = require('../../functions/giveWeaponID.js');
const makeEquipment = require('../../functions/makeEquipment');
const User = require('../../models/user.js');
const userEffects = require('../../models/userEffects.js');
const lvl_edit = require('./lvl_edit.js');
module.exports = {
    async execute(message, winner, loser, location) {

        const winEmbed = new Discord.MessageEmbed()
            .setTitle(`You Won!`)
            .setColor('#000001');

        const floorID = location.selectedFloor;
        const floor = location.getFloor(floorID);

        // Lets the money earned be multiplied by gold
        const moneyEarned = Math.floor(loser.level * floor.multipliers.GoldMultiplier);
        const jerichoInfo = floor.rewards.jericho;
        const equipDropChance = floor.rewards.equipDropChance;
        const areaEquipmentInfo = floor.rewards.equipment;
        const lootboxInfo = floor.rewards.lootbox;
        let goldMulti = 1;

        // const chestName = ["Common Treasure Chest", "Uncommon Treasure Chest", "Rare Treasure Chest", "Epic Treasure Chest", "Legendary Treasure Chest", "Mythic Treasure Chest"];
        // const chestEmote = ["<:CommonChest:819856620572901387>", "<:UncommonChest:820272834348711976>", "<:RareChest:820273250629582858>", "<:EpicChest:820273750289023007>", "<:LegendaryChest:820274118817611777>", "<:MythicChest:820274344059994122>"]

        // Get experience multiplier from floor
        const experienceMultiplier = floor.multipliers.ExpMultiplier;

        // Get embed text from lvl_edit
        const embedText = await lvl_edit.execute(message, winner, loser, experienceMultiplier);

        const drops = [];

        // get jerichos from winning battles
        if (Math.random() < jerichoInfo.dropChance) {
            const quantityDropped = Math.floor(Math.random() * jerichoInfo.maxQuantity + jerichoInfo.minQuantity);
            drops.push(['Jericho Jehammad', quantityDropped, jerichoInfo.emote]);
        }


        // Math.floor(Math.random() * 1 + 1) == 1  //for 100% chance when testing
        if (Math.random() < 0.2) {
            const dropInfo = Object.values(lootboxInfo);
            const dropNames = Object.keys(lootboxInfo);
            let totalChance = 0;
            for (let i = 0; i < dropInfo.length; i++) {
                totalChance += dropInfo[i].dropChance;
            }
            const prevDropLen = drops.length;
            while (drops.length == prevDropLen) {
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
                    `${winner.player.name} earned ${moneyEarned * goldMulti} <:cash_24:751784973488357457>\n${embedText}`);

                let dropStr = '';
                // get area specific equipment
                if (equipDropChance > 0){
                    if (Math.random() < equipDropChance) {
                        const dropInfo = Object.values(areaEquipmentInfo);
                        const dropNames = Object.keys(areaEquipmentInfo);
                        let totalChance = 0;
                        for (let i = 0; i < dropInfo.length; i++) {
                            totalChance += dropInfo[i].dropChance;
                        }
                        let equipDroppped = false;
                        while (!equipDroppped) {
                            for (let i = 0; i < dropNames.length; i++) {
                                const rng = Math.random();
                                if (rng <= dropInfo[i].dropChance / totalChance) {
                                    const index = Math.floor(Math.random() * dropInfo[i].drops.length);
                                    let equipName = dropInfo[i].drops[index];
                                    const equipment = await makeEquipment(equipName);
                                    equipName = await giveWeaponID(equipName);
                                    user.inv[equipName] = equipment;
                                    if (dropStr.length != 0) {
                                        dropStr += '\n';
                                    }
                                    dropStr += `${equipName}!`;
                                    equipDroppped = true;
                                    break;
                                }
                            }
                        }
                        user.markModified('inv');
                    }
                }

                // get lootboxes
                if (drops.length != 0) {
                    for (let i = 0; i < drops.length; i++) {
                        if (user.inv[drops[i][0]]) {
                            user.inv[drops[i][0]].quantity += drops[i][1];
                        } else {
                            user.inv[drops[i][0]] = await findItem(drops[i][0]);
                            user.inv[drops[i][0]].quantity = drops[i][1];
                        }
                        if (dropStr.length != 0) {
                            dropStr += '\n';
                        }
                        dropStr += `${drops[i][1]} ${drops[i][2]} ${drops[i][0]}.`;
                    }
                    user.markModified('inv');
                }
                if (dropStr != '') {
                    winEmbed.addField("You have found:", dropStr);

                }

                user.currency += moneyEarned * goldMulti;
                user.save()
                    .catch(err => console.error(err));

                message.channel.send({ embeds: [winEmbed] });
            });
        });
    },
};
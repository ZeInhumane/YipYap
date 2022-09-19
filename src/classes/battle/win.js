const Discord = require("discord.js");
const findItem = require("../../functions/findItem.js");
const giveWeaponID = require("../../functions/giveWeaponID.js");
const makeEquipment = require("../../functions/makeEquipment");
const userEffects = require("../../models/userEffects.js");
const lvl_edit = require("./lvl_edit.js");
const { emote } = require("../../constants/emojis");

module.exports = {
    async execute(message, winner, loser, location) {
        // Putting emotes up here so it'll be easier to edit.
        const goldEmote = emote.Gold;

        const winEmbed = new Discord.MessageEmbed()
            .setTitle(`> ${loser.name || loser.player.name} was slain... `)
            .setColor("#000001")
            .setAuthor({
                name: `${message.author.username}'s battle`,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
            });

        const floorID = location.selectedFloor;
        const floor = location.getFloor(floorID);

        // Lets the money earned be multiplied by gold.
        const moneyEarned = Math.floor(
            loser.level * floor.multipliers.GoldMultiplier,
        );
        const jerichoInfo = floor.rewards.jericho;
        const equipDropChance = floor.rewards.equipDropChance;
        const areaEquipmentInfo = floor.rewards.equipment;
        const lootboxInfo = floor.rewards.lootbox;
        let goldMulti = 1;

        // Get experience multiplier from floor.
        const experienceMultiplier = floor.multipliers.ExpMultiplier;

        // Get embed text from lvl_edit.
        const levelDetails = await lvl_edit.execute(
            message,
            winner,
            loser,
            experienceMultiplier,
        );

        const drops = [];

        // Compute jerichos from winning battles.
        if (Math.random() < jerichoInfo.dropChance) {
            const quantityDropped = Math.floor(
                Math.random() * jerichoInfo.maxQuantity +
                    jerichoInfo.minQuantity,
            );
            drops.push([
                "Jericho Jehammad",
                quantityDropped,
                jerichoInfo.emote,
            ]);
        }

        // Math.floor(Math.random() * 1 + 1) == 1  //for 100% chance when testing.
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
                        const quantityDropped = Math.floor(
                            Math.random() * dropInfo[i].maxQuantity +
                                dropInfo[i].minQuantity,
                        );

                        drops.push([
                            dropNames[i],
                            quantityDropped,
                            dropInfo[i].emote,
                        ]);
                    }
                }
            }
        }

        await userEffects.findOne(
            { userID: winner.userID },
            async (_, effects) => {
                if (effects != null) {
                    const goldTicketName = Object.keys(effects.tickets).filter(
                        (key) => key.includes("Gold"),
                    );
                    if (goldTicketName.length != 0) {
                        goldMulti = effects.tickets[goldTicketName[0]].multiplier;
                    }
                }

                let dropStr = "";
                // get area specific equipment
                if (equipDropChance > 0) {
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
                                    const index = Math.floor(
                                        Math.random() *
                                            dropInfo[i].drops.length,
                                    );
                                    let equipName = dropInfo[i].drops[index];
                                    const equipment = await makeEquipment(equipName);
                                    equipName = await giveWeaponID(equipName);
                                    winner.inv[equipName] = equipment;
                                    if (dropStr.length != 0) {
                                        dropStr += "\n";
                                    }
                                    dropStr += `${equipName}!`;
                                    equipDroppped = true;
                                    break;
                                }
                            }
                        }
                        winner.markModified("inv");
                    }
                }

                // get lootboxes
                if (drops.length != 0) {
                    for (let i = 0; i < drops.length; i++) {
                        if (winner.inv[drops[i][0]]) {
                            winner.inv[drops[i][0]].quantity += drops[i][1];
                        } else {
                            winner.inv[drops[i][0]] = await findItem(
                                drops[i][0],
                            );
                            winner.inv[drops[i][0]].quantity = drops[i][1];
                        }
                        if (dropStr.length != 0) {
                            dropStr += "\n";
                        }
                        // Array indexes: [Name, Quantity,  Emote].
                        dropStr += `• ${drops[i][1]} **${drops[i][0]}** ${drops[i][2]}`;
                    }
                    winner.markModified("inv");
                }
                winEmbed.addField(
                    "\u200b",
                    `${levelDetails.embedText}${levelDetails.levelUpText ? `\n${levelDetails.levelUpText}` : ''}` + `\n\n**Rewards**\n• ${
                                moneyEarned * goldMulti
                            } Gold ${goldEmote}\n` + `${dropStr}`,
                );


                winner.currency += moneyEarned * goldMulti;
                winner.save().catch((err) => console.error(err));
                if (levelDetails.nextFloor) {
                    // winEmbed.footer = {
                    //     text:`Congratulations on reaching level ${levelDetails.newLevel}, you can now move to the next floor using the floor command!`,
                    // };
                }

                message.channel.send({ embeds: [winEmbed] });
            },
        );
    },
};

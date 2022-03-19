const Discord = require('discord.js');
const User = require('../../models/user');
const findItem = require('../../functions/findItem.js');
const findPrefix = require('../../functions/findPrefix');
const titleCase = require('../../functions/titleCase');

module.exports = {
    name: "ascend",
    description: "Ascend your stats equipment to boost its stats and allow further enhancement of that particular equipment. Only certain weapons can be ascended.",
    syntax: "{item name}",
    aliases: ['asc'],
    cooldown: 10,
    category: "Fun",
    async execute({ message, args }) {
        let currentColor = "#0099ff";
        let itemName = args.join(" ");
        itemName = titleCase(itemName);

        const rarityArr = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"];
        let playerAction = "nothing";
        const expRarityTable = {
            "Common": 1000,
            "Uncommon": 3000,
            "Rare": 9000,
            "Epic": 40000,
            "Legendary": 100000,
            "Mythic": 500000,
        };

        // is edited version of the one at the bottom of battle.js
        await User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                // Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }
            if (user.inv[itemName] == undefined) {
                message.channel.send(`You do not have that item!`);
                return;
            }
            if (user.inv[itemName].type != "equipment") {
                message.channel.send(`That item is not an equipment!`);
                return;
            }
            // For users who were created before weapon level was created
            if (user.inv[itemName].exp == null) {
                user.inv[itemName].level = 1;
                user.inv[itemName].exp = 0;
                user.inv[itemName].expToLevelUp = expRarityTable[user.inv[itemName].rarity];
                user.inv[itemName].ascension = 0;
                user.markModified('inv');
                user.save()
                    .then(() => console.log(`Saved ${itemName}`))
                    .catch(err => console.error(err));
                message.channel.send(`This equipment does not have enough levels to ascend.`);
                return;
            }
            // Check if at max ascension for weapon
            if (user.inv[itemName].ascension == rarityArr.indexOf(user.inv[itemName].rarity)) {
                message.channel.send(`This equipment is already at max ascension.`);
                return;
            }
            // Check if at max level for that ascension
            if (user.inv[itemName].level != (user.inv[itemName].ascension + 1) * 20) {
                message.channel.send(`Please enhance this equipment first!`);
                return;
            }

            const dbItemName = itemName.split("#")[0];
            const dbEquipment = await findItem(dbItemName, true);
            const userEquipment = user.inv[itemName];

            async function ascend(botEmbedMessage) {
                const filter = i => {
                    i.deferUpdate();
                    return i.user.id === message.author.id;
                };

                let isExpired = false;
                // awaits Player interaction
                await botEmbedMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                    .then(async i => {
                        playerAction = i.customId;
                    })
                    .catch(async () => {
                        currentColor = '#FF0000';
                        ascendEmbed.setColor(currentColor);
                        botEmbedMessage.edit({ embeds: [ascendEmbed], components: [] });
                        message.channel.send('Ascend expired. Your fatass took too long');
                        isExpired = true;
                    });

                // Check if interaction expired
                if (isExpired) {
                    return;
                }

                if (playerAction == 'no') {
                    currentColor = '#FF0000';
                    botEmbedMessage.edit(new Discord.MessageEmbed()
                        .setColor(currentColor)
                        .setTitle(itemName)
                        .setAuthor({ name: message.member.user.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setDescription(`Ascension cancelled`),
                    );
                    return;
                }

                let playerHasMaterials = true;
                // Finds if user has the items required for ascension
                for (let i = 0; i < ascensionRequirements.length; i++) {
                    // 0 is material name, 1 is num of materials needed
                    if (user.inv[ascensionRequirements[i][0]].quantity < ascensionRequirements[i][1]) {
                        playerHasMaterials = false;
                    }
                }

                // Check if user has enough materials to ascend
                if (!playerHasMaterials) {
                    // Not enough materials message
                    ascendEmbed.addField("Not enough materials", "\u200b");
                    botEmbedMessage.edit({ embeds: [ascendEmbed], components: [] });
                    return;
                }

                // Minus items used
                for (let i = 0; i < ascensionRequirements.length; i++) {
                    // 0 is material name, 1 is num of materials needed
                    user.inv[ascensionRequirements[i][0]].quantity -= ascensionRequirements[i][1];
                }

                // Ascend up
                userEquipment.ascension += 1;

                // Reset experience needed if still able to ascend
                if (userEquipment.ascension <= rarityArr.indexOf(userEquipment.rarity)) {
                    const expPercentageIncrease = 1.5;
                    userEquipment.expToLevelUp = expRarityTable[userEquipment.rarity] * expPercentageIncrease * userEquipment.ascension;
                }

                user.markModified('inv');
                user.save()
                    .then(() => console.log(`User ascended ${itemName}`))
                    .catch(err => console.error(err));

                // Ascended message
                const updatedAscendEmbed = new Discord.MessageEmbed()
                    .setColor(currentColor)
                    .setTitle(itemName)
                    .setAuthor({ name: message.member.user.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`✅ Ascended to Level **${userEquipment.ascension + 1}**!`);

                // Adds stats up text to embed
                for (const statName in dbEquipment.ascensionStatsUp) {
                    let multiText = "";
                    if (dbEquipment.ascensionStatsUp[statName].multi) {
                        multiText = `, Multi: ${dbEquipment.ascensionStatsUp[statName].multi}`;
                    }
                    updatedAscendEmbed.addField(`${statName} Increased!`, `Flat: ${dbEquipment.ascensionStatsUp[statName].flat}${multiText}`);
                }

                await botEmbedMessage.edit({ embeds: [updatedAscendEmbed], components: [] });
            }

            const ascensionRequirements = Object.entries(dbEquipment.ascensionRequirements[userEquipment.ascension]);
            const ascendEmbed = new Discord.MessageEmbed()
                .setColor(currentColor)
                .setTitle(`Ascending ${itemName}`)
                .setAuthor({ name: message.member.user.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setDescription(`** ${user.inv[itemName].ascension} → ${user.inv[itemName].ascension + 1}**`)
                .addField("Materials: ", ascensionRequirements.map(i => `${i[0]} x${i[1]}`).join("\n"));
            const row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('yes')
                        .setLabel('✔️')
                        .setStyle('SUCCESS'),
                    new Discord.MessageButton()
                        .setCustomId('no')
                        .setLabel('✖️')
                        .setStyle('DANGER'),
                );
            message.channel.send({ embeds: [ascendEmbed], components: [row] })
                .then(botMessage => {
                    ascend(botMessage);
                });
        });

    },
};
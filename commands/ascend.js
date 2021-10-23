const Discord = require('discord.js');
const User = require('../models/user');
const findItem = require('../functions/findItem.js');
const findPrefix = require('../functions/findPrefix');
const titleCase = require('../functions/titleCase');

module.exports = {
    name: "ascend",
    description: "Ascend your stats equipment to boost its stats and allow further enhancement of that particular equipment. Only certain weapons can be ascended.",
    syntax: "{item name}",
    cooldown: 10,
    category: "Fun",
    async execute(message, args) {
        let currentColor = "#0099ff";
        let itemName = args.join(" ");
        itemName = titleCase(itemName);

        let rarityArr = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"];
        let playerAction = "nothing";

        // is edited version of the one at the bottom of battle.js
        await User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                //Getting the prefix from db
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
            //For users who were created before weapon level was created
            if (user.inv[itemName].exp == null) {
                let expRarityTable = {
                    "Common": 1000,
                    "Uncommon": 3000,
                    "Rare": 9000,
                    "Epic": 40000,
                    "Legendary": 100000,
                    "Mythic": 500000
                }
                user.inv[itemName].level = 1;
                user.inv[itemName].exp = 0;
                user.inv[itemName].expToLevelUp = expRarityTable[user.inv[itemName].rarity];
                user.inv[itemName].ascension = 0;
                user.markModified('inv');
                user.save()
                    .then(result => console.log("ascended"))
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

            let dbItemName = itemName.split("#")[0]
            let dbEquipment = await findItem(dbItemName, true);
            let userEquipment = user.inv[itemName];

            async function ascend(user) {
                filter = i => {
                    i.deferUpdate();
                    return i.user.id === message.author.id;
                };

                let isExpired = false;
                // awaits Player interaction
                await botEmbedMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                    .then(async i => {
                        playerAction = i.customId;
                    })
                    .catch(async err => {
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
                        .setURL('https://discord.gg/CTMTtQV')
                        .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                        .setDescription(`Ascension cancelled`)
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

                userEquipment.ascension += 1;

                user.markModified('inv');
                user.save()
                    .then(result => console.log("ascended"))
                    .catch(err => console.error(err));

                // Ascended message
                const updatedAscendEmbed = new Discord.MessageEmbed()
                    .setColor(currentColor)
                    .setTitle(itemName)
                    .setURL('https://discord.gg/CTMTtQV')
                    .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                    .setDescription(`Ascended to Level ${userEquipment.ascension}`)

                // Adds stats up text to embed
                for (statName in dbEquipment.ascensionStatsUp) {
                    let multiText = "";
                    if (dbEquipment.ascensionStatsUp[statName].multi) {
                        multiText = `, Multi: ${dbEquipment.ascensionStatsUp[statName].multi}`
                    }
                    updatedAscendEmbed.setField(`${statName} Up`, `Flat: ${dbEquipment.ascensionStatsUp[statName].flat}${multiText}`);
                }

                botEmbedMessage.edit({ embeds: [updatedAscendEmbed], components: [] });
            }

            const ascendEmbed = new Discord.MessageEmbed()
                .setColor(currentColor)
                .setTitle(itemName)
                .setURL('https://discord.gg/CTMTtQV')
                .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                .setDescription(`Ascend ${user.inv[itemName].ascension} --> ${user.inv[itemName].ascension + 1}`)
                .addFields(
                    { name: `Materials needed: `, value: "\u200b", inline: true }
                )

            row = new Discord.MessageActionRow()
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

            let ascendEmotes = [];
            let ascensionRequirements = Object.entries(dbEquipment.ascensionRequirements[userEquipment.ascension])
            for (let i = 0; i < ascensionRequirements.length; i++) {
                let materialDBInfo = await findItem(ascensionRequirements[i][0]);
                ascendEmotes.push(materialDBInfo.emote);
                // 0 is material name, 1 is num of materials needed
                ascendEmbed.addField(`${materialDBInfo.emote} ${ascensionRequirements[i][0]}`, ascensionRequirements[i][1]);

            }
            message.channel.send({ embeds: [ascendEmbed], components: [row] })
                .then(botMessage => {
                    botEmbedMessage = botMessage;
                    ascend(user);
                });
        });

    }
}
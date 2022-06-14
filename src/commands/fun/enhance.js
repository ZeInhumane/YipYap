const Discord = require('discord.js');
const User = require('../../models/user');
const findPrefix = require('../../functions/findPrefix');
const titleCase = require('../../functions/titleCase');
const errorMessage = require('../../constants/errorMessage.js');

module.exports = {
    name: "enhance",
    description: "Enhance your equipment using materials to increase its stats. Enhancing equipment requires Jericho Jehammads",
    syntax: "{item name} {number of materials}",
    aliases: ['enh'],
    category: "Fun",
    async execute({ message, args }) {
        const currentColor = "#0099ff";
        const upgradeMaterial = "Jericho Jehammad";

        let materialUseCount = 1;
        // Finds arguments no matter the position
        const materialUseCountIndex = args.findIndex(arg => /^[1-9]\d*$/g.test(arg) || arg.toLowerCase() == 'all');
        if (materialUseCountIndex != -1) {
            materialUseCount = args[materialUseCountIndex];
            if (materialUseCount != 'all') {
                materialUseCount = parseInt(materialUseCount);
            }
            args.splice(materialUseCountIndex, 1);
        }

        let itemName = args.join(' ');
        itemName = titleCase(itemName);

        const expGivenPerMaterial = 500;
        const expPercentIncreasePerLevel = 10;
        const rarityArr = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"];

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
            if (user.inv[upgradeMaterial] == undefined) {
                message.channel.send(`You do not have ${upgradeMaterial}!`);
                return;
            }
            // Sets materialUseCount to all of the user's item count
            if (materialUseCount == 'all') {
                materialUseCount = user.inv[upgradeMaterial].quantity;
            }
            if (user.inv[upgradeMaterial].quantity < materialUseCount) {
                message.channel.send(`You do not have that much ${upgradeMaterial}s!`);
                return;
            }
            if (materialUseCount >
                user.inv[upgradeMaterial].quantity -
                (user.inv[upgradeMaterial].listed ? user.inv[upgradeMaterial].listed : 0)) {
                message.channel.send(errorMessage.marketErrorMessage.unableToEnhance);
                return;
            }
            // Check if at max level for weapon
            if (user.inv[itemName].level == (rarityArr.indexOf(user.inv[itemName].rarity) + 1) * 20) {
                message.channel.send(`This equipment is already at max level.`);
                return;
            }
            // Check if at max level for that ascension
            if (user.inv[itemName].level == (user.inv[itemName].ascension + 1) * 20) {
                message.channel.send(`Cannot enhance this equipment further. Please ascend this equipment!`);
                return;
            }

            const userEquipment = user.inv[itemName];

            // Add exp for current level
            let expNeedForNextLevel = userEquipment.expToLevelUp + userEquipment.exp;
            let expToAscension = userEquipment.expToLevelUp;
            // Add exp for subsequent levels til ascension
            for (let i = userEquipment.level + 1; i < (userEquipment.ascension + 1) * 20; i++) {
                expNeedForNextLevel = Math.floor(expNeedForNextLevel * (1 + expPercentIncreasePerLevel / 100));
                expToAscension += expNeedForNextLevel;
            }

            let levelsGained = 0;
            // Ensures user only uses as much materials as needed for ascension, to save thier resources
            const numMaterialNeededForAscension = Math.ceil(expToAscension / expGivenPerMaterial);
            // Upgrade straight to next ascension
            if (materialUseCount >= numMaterialNeededForAscension) {
                materialUseCount = numMaterialNeededForAscension;
                levelsGained = (userEquipment.ascension + 1) * 20 - userEquipment.level;
                userEquipment.level = (userEquipment.ascension + 1) * 20;
                userEquipment.exp = 0;
                if (userEquipment.level == (userEquipment.ascension + 1) * 20) {
                    userEquipment.expToLevelUp = 0;
                } else {
                    userEquipment.expToLevelUp = Math.floor(expNeedForNextLevel * (1 + expPercentIncreasePerLevel / 100));
                }
                // Normal upgrade
            } else {
                // Reset expNeedForNextLevel for level calulations
                expNeedForNextLevel = userEquipment.expToLevelUp + userEquipment.exp;
                // Add EXP to equipment
                userEquipment.exp += expGivenPerMaterial * materialUseCount;

                // Adds levels if there is enough EXP
                while (userEquipment.exp >= expNeedForNextLevel) {
                    levelsGained += 1;
                    userEquipment.exp -= expNeedForNextLevel;
                    expNeedForNextLevel = Math.floor(expNeedForNextLevel * (1 + expPercentIncreasePerLevel / 100));
                }
                userEquipment.expToLevelUp = expNeedForNextLevel - userEquipment.exp;
                userEquipment.level += levelsGained;
            }

            user.inv[upgradeMaterial].quantity -= materialUseCount;

            // Removes upgrade material from inv if it reaches 0
            if (user.inv[upgradeMaterial].quantity == 0) {
                delete user.inv[upgradeMaterial];
            }

            user.markModified('inv');
            user.markModified('player');
            user.save()
                .then(result => console.log(`Equipment enhanced ${result.userID}`))
                .catch(err => console.error(err));

            const enhanceEmbed = new Discord.MessageEmbed()
                .setColor(currentColor)
                .setTitle(`✅ ${itemName} enhanced `)
                .setAuthor({ name: message.member.user.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setDescription(`Level: ${userEquipment.level}/${(rarityArr.indexOf(user.inv[itemName].rarity) + 1) * 20} `)
                .addFields(
                    { name: `x${materialUseCount} Jericho Jehammad`, value: `+${expGivenPerMaterial * materialUseCount} EXP 📈`, inline: true },
                    { name: `EXP: `, value: `${(userEquipment.level == (rarityArr.indexOf(user.inv[itemName].rarity) + 1) * 20) ? 'MAX' : userEquipment.exp} / ${userEquipment.expToLevelUp + userEquipment.exp}`, inline: true },
                );

            if (levelsGained > 0) {
                enhanceEmbed.addField(`Levels gained: `, `${levelsGained}`, true);
            }

            message.channel.send({ embeds: [enhanceEmbed] });
        });

    },
};
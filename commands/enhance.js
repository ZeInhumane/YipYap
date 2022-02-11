const Discord = require('discord.js');
const User = require('../models/user');
const findPrefix = require('../functions/findPrefix');
const titleCase = require('../functions/titleCase');
const findItem = require('../functions/findItem.js');

module.exports = {
    name: "enhance",
    description: "Enhance your equipment using materials to increase its stats. Enhancing equipment requires Jericho Jehammads",
    syntax: "{item name} {number of materials}",
    category: "Fun",
    async execute(message, args) {
        let currentColor = "#0099ff";
        let upgradeMaterial = "Jericho Jehammad";

        let materialUseCount = 1;
        // Finds arguments no matter the position
        let materialUseCountIndex = args.findIndex(arg => /^[1-9]\d*$/g.test(arg) || arg.toLowerCase() == 'all')
        if (materialUseCountIndex != -1) {
            materialUseCount = args[materialUseCountIndex];
            if (materialUseCount != 'all') {
                materialUseCount = parseInt(materialUseCount)
            }
            args.splice(materialUseCountIndex, 1);
        }

        let itemName = args.join(' ');
        itemName = titleCase(itemName);

        let expGivenPerMaterial = 500;
        let expPercentIncreasePerLevel = 10;
        let rarityArr = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"];

        await User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                //Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return
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

            let userEquipment = user.inv[itemName];

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
            let numMaterialNeededForAscension = Math.ceil(expToAscension / expGivenPerMaterial);
            // Upgrade straight to next ascension
            if (materialUseCount >= numMaterialNeededForAscension) {
                materialUseCount = numMaterialNeededForAscension;
                levelsGained = (userEquipment.ascension + 1) * 20 - userEquipment.level;
                userEquipment.level = (userEquipment.ascension + 1) * 20;
                userEquipment.exp = 0;
                if (userEquipment.level == (userEquipment.ascension + 1) * 20) {
                    userEquipment.expToLevelUp = 0;
                }
                else {
                    userEquipment.expToLevelUp = Math.floor(expNeedForNextLevel * (1 + expPercentIncreasePerLevel / 100));
                }
            }
            // Normal upgrade
            else {
                // Reset expNeedForNextLevel for level calulations
                let expNeedForNextLevel = userEquipment.expToLevelUp + userEquipment.exp;
                // Add EXP to equipment
                userEquipment.exp += expGivenPerMaterial * materialUseCount;

                // Adds levels if there is enough EXP
                while (userEquipment.exp >= expNeedForNextLevel) {
                    levelsGained += 1;
                    userEquipment.exp -= expNeedForNextLevel;
                    expNeedForNextLevel = Math.floor(expNeedForNextLevel * (1 + expPercentIncreasePerLevel / 100));
                }
                userEquipment.expToLevelUp = expNeedForNextLevel - userEquipment.exp
                userEquipment.level += levelsGained;
            }

            user.inv[upgradeMaterial].quantity -= materialUseCount;

            // Removes upgrade material from inv if it reaches 0
            if (user.inv[upgradeMaterial].quantity == 0) {
                delete user.inv[upgradeMaterial];
            }

            // Checks if any equipped item leveled up
            if (userEquipment.equipped && levelsGained > 0){
                dbEquipment = await findItem(itemName.split("#")[0], true);
                for (statName in dbEquipment.statsUpPerLvl) {
                    user.player.additionalStats[statName].flat += dbEquipment.statsUpPerLvl[statName] * levelsGained;
                }
            }

            user.markModified('inv');
            user.markModified('player');
            user.save()
                .then(result => console.log('inv saved at enhance'))
                .catch(err => console.error(err));

            const enhanceEmbed = new Discord.MessageEmbed()
                .setColor(currentColor)
                .setTitle(itemName)
                .setURL('https://discord.gg/CTMTtQV')
                .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                .setDescription('Upgrade your equipment till it reaches the ascension mark!')
                .addFields(
                    { name: `<:Jericho:823551572029603840> Used: ${materialUseCount}`, value: "\u200b", inline: true },
                    { name: `EXP gained: ${expGivenPerMaterial * materialUseCount}`, value: "\u200b", inline: true },
                    { name: `EXP till level up: ${(userEquipment.level == (rarityArr.indexOf(user.inv[itemName].rarity) + 1) * 20) ? 'MAX' : userEquipment.expToLevelUp}`, value: "\u200b", inline: true },
                    { name: `Equipment Level: ${userEquipment.level}/${(rarityArr.indexOf(user.inv[itemName].rarity) + 1) * 20}`, value: "\u200b", inline: true },

                )

            if (levelsGained > 0) {
                enhanceEmbed.addField(`Levels gained: ${levelsGained}`, "\u200b", true);
            }

            message.channel.send({ embeds: [enhanceEmbed] });
        });

    }
}
const User = require('../../models/user');
const Discord = require('discord.js');
const findPrefix = require('../../functions/findPrefix');
const getFinalStats = require('../../functions/getFinalStats');
const findItem = require('../../functions/findItem');

module.exports = {
    name: "info",
    description: "Displays an items information. Want to know more about that particular item? This is the command to use.",
    syntax: "",
    cooldown: 5,
    category: "Fun",
    execute({ message, args }) {
        let itemName = args.join(" ");

        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                // Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }

            // Gets equipment info from db
            const [ searchItemName, equipmentID ] = itemName.split("#");
            const dbEquipment = await findItem(searchItemName, true);
            if (!dbEquipment){
                message.channel.send(`Invalid item name ${searchItemName}.`);
                return;
            }
            // Corrects item name to the one in the db
            itemName = dbEquipment.itemName;
            if (equipmentID){
                itemName = `${dbEquipment.itemName}#${equipmentID}`;
            }

            if (!user.inv[itemName]) {
                message.channel.send("You do not have that item.");
                return;
            }
            const stat_emote = {
                "hp": ":hearts:",
                "attack": ":crossed_swords:",
                "defense": ":shield:",
                "speed": ":dash:",
            };

            const embed = new Discord.MessageEmbed()
                .setColor('#000000');

            if (user.inv[itemName].type == "equipment") {
                if (dbEquipment.credits) {
                    embed.setFooter({ text: `Credits: ${dbEquipment.credits} ` });
                }
                const stats = await getFinalStats(user.inv[itemName], dbEquipment);
                embed.setTitle(`${dbEquipment.emote} ${itemName}`);
                embed.addField("Rarity", dbEquipment.rarity ? dbEquipment.rarity : "No rarity");
                embed.addField("Type", dbEquipment.type ? dbEquipment.type.charAt(0).toUpperCase() + dbEquipment.type.slice(1) : "No rarity");
                embed.addField("Description", dbEquipment.description ? dbEquipment.description : "No description");
                embed.setImage(dbEquipment.image ? dbEquipment.image : "https://cdn.discordapp.com/attachments/819860035281879040/886188751435472916/no-image-found-360x250.png");

                const statNames = Object.keys(stats);
                for (let i = 0; i < statNames.length; i++) {
                    let stat_text = `**Flat Modifier**: ${Object.values(stats)[i].flat}`;
                    if (Object.values(stats)[i].multi != 0) {
                        stat_text += `\n **Multiplier Modifier(%)**: ${Object.values(stats)[i].multi}`;
                    }

                    embed.addField(`${stat_emote[statNames[i]]} ${statNames[i].charAt(0).toUpperCase() + statNames[i].slice(1)}`, stat_text);
                }
                embed.addField(`Equipment Level:`, ` ${user.inv[itemName].level}`, true);
                embed.addField(`Equipment Ascension`, ` ${user.inv[itemName].ascension}`, true);
                embed.addField(`Equipment Experience`, user.inv[itemName].exp + "/" + (user.inv[itemName].exp + user.inv[itemName].expToLevelUp), true);
            } else {
                if (dbEquipment.credits) {
                    embed.setFooter({ text: `Credits: ${dbEquipment.credits} ` });
                }
                embed.setTitle(`${dbEquipment.emote} ${itemName}`);
                embed.addField("Rarity", dbEquipment.rarity ? dbEquipment.rarity.charAt(0).toUpperCase() + dbEquipment.rarity.slice(1) : "No rarity");
                embed.addField("Type", dbEquipment.type ? dbEquipment.type : "No type");
                if (dbEquipment.type == "consumable") {
                    embed.addField("Experience Gain", dbEquipment.experience.toString() ? dbEquipment.experience.toString() : "No description");
                }
                embed.addField("Description", dbEquipment.description ? dbEquipment.description : "No description");
                embed.setImage(dbEquipment.image ? dbEquipment.image : "https://cdn.discordapp.com/attachments/819860035281879040/886188751435472916/no-image-found-360x250.png");

            }
            message.channel.send({ embeds: [embed] });
        });
    },
};
const User = require('../../models/user');
const Discord = require('discord.js');
const is_lvlup = require('../../classes/battle/is_lvlup.js');
const findPartialItem = require('../../functions/findPartialItem');
const titleCase = require('../../functions/titleCase.js');
const findPrefix = require('../../functions/findPrefix');

module.exports = {
    name: "eat",
    description: "Eats a consumable to gain experience",
    syntax: "{Item to eat} {quantity}",
    cooldown: 5,
    aliases: ['e'],
    category: "Economy",
    async execute({ message, args }) {
        let toBeConsumed = 1;
        // Finds arguments no matter the position
        const toBeConsumedIndex = args.findIndex(arg => /^[1-9]\d*$/g.test(arg) || arg.toLowerCase() == 'all');
        if (toBeConsumedIndex != -1) {
            toBeConsumed = args[toBeConsumedIndex];
            if (toBeConsumed != 'all') {
                toBeConsumed = parseInt(toBeConsumed);
            }
            args.splice(toBeConsumedIndex, 1);
        }
        const itemName = titleCase(args.join(" "));

        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                // Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }
            if (!user.inv[itemName]) {
                message.channel.send("You do not have that item.");
                return;
            }
            // gets number of consumables to consume
            if (toBeConsumed == "all") {
                toBeConsumed = user.inv[itemName].quantity;
            }

            // Check if user has enough of the item
            if (user.inv[itemName].quantity < toBeConsumed) {
                message.channel.send(`You do not have a sufficient amount of ${itemName} to consume`);
                return;
            }

            let consumable = await findPartialItem(itemName);
            consumable = consumable[0];
            if (!consumable || consumable.type != "consumable") {
                message.channel.send("That item cannot be consumed");
                return;
            }

            const fruitExp = consumable.experience * toBeConsumed;
            // updating level, current exp and sp to database
            user.inv[itemName].quantity -= toBeConsumed;
            if (user.inv[itemName].quantity == 0) {
                delete user.inv[itemName];
            }
            user.exp += fruitExp;
            const update_winner = new is_lvlup(user.exp, user.level, user.player.name);

            const eatEmbed = new Discord.MessageEmbed()
                .setTitle(`Burp!!!`)
                .setColor('#000001')
                .addField("\u200b", `😋 You have eaten **${toBeConsumed} ${itemName}(s)** and gained ${fruitExp} experience and your current experience is ${user.exp} :level_slider:!!`);
            // congratulate those who level up
            const levelUpTxt = update_winner.level_up();
            const userLvl = update_winner.new_lvl();
            if (levelUpTxt) {
                eatEmbed.addField("\u200b", `\n${levelUpTxt}`);
                if (userLvl % 10 == 0) {
                    eatEmbed.addField("\u200b", `\nCongratulations on reaching **level ${userLvl}**, you can now move to the next floor using the floor command!`);
                }
            }
            message.channel.send({ embeds: [eatEmbed] });
            user.exp = update_winner.new_exp();
            user.level = userLvl;
            user.sp += update_winner.new_sp();
            user.markModified('inv');
            user.save()
                .then(result => console.log("eat", result))
                .catch(err => console.error(err));
        });
    },
};
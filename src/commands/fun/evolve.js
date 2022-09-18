const User = require('../../models/user');
const findPrefix = require('../../functions/findPrefix');
const findItem = require('../../functions/findItem.js');
const titleCase = require('../../functions/titleCase');

module.exports = {
    name: "evolve",
    description: "Evolve your lootboxes. Every 5 of previous tier gets the next tier upgrade, this also consumes the lootbox",
    aliases: ['ev'],
    cooldown: 5,
    syntax: "{evolution type}",
    category: "Fun",
    async execute({ message, args }) {
        if (args.length < 1) {
            message.channel.send('Enter the rarity of treasure chest that you want to evolve.');
            return;
        }
        const evoType = args[0];
        const itemQuantity = 1;
        const usedForEvolution = 5;
        const rarityArr = ["common", "uncommon", "rare", "epic", "legendary"];

        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                // Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }
            // Checks if user entered a vaild rarity
            const rarityIndex = rarityArr.findIndex(arg => arg == evoType.toLowerCase());
            if (rarityIndex == -1 || rarityArr.length <= rarityIndex + 1) {
                message.channel.send("Please enter a valid rarity to evolve by");
                return;
            }
            const itemName = `${titleCase(rarityArr[rarityIndex + 1])} Treasure Chest`;
            const preEvolution = `${titleCase(rarityArr[rarityIndex])} Treasure Chest`;

            // Checks if user has the items needed
            if (!user.inv[preEvolution]) {
                message.channel.send(`You do not have ${preEvolution}`);
                return;
            }
            if (user.inv[preEvolution].quantity < usedForEvolution) {
                message.channel.send(`You do currently have ${user.inv[preEvolution].quantity} ${preEvolution} but you need ${usedForEvolution} ${preEvolution} to evolve ${preEvolution} into a ${itemName}`);
                return;
            }
            if (user.inv[itemName]) {
                user.inv[itemName].quantity += itemQuantity;
            } else {
                const chest = await findItem(itemName)[0];
                chest.quantity = itemQuantity;
                user.inv[itemName] = chest;
            }
            // Evolves the Chest
            user.inv[preEvolution].quantity -= usedForEvolution;
            if (user.inv[preEvolution].quantity == 0) {
                delete user.inv[preEvolution];
            }
            message.channel.send(`:white_check_mark: You have evolved 5 ${preEvolution} into 1 ${itemName}!!`);

            user.markModified('inv');
            user.save()
                .then(result => console.log("evolve", result))
                .catch(err => console.error(err));
        });
    },
};
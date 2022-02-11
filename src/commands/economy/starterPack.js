const User = require('../../models/user');
const findPrefix = require('../../functions/findPrefix');
const findItem = require('../../functions/findItem.js');

module.exports = {
    name: "starterpack",
    description: "For new players to claim and get some stuff. Some stuff to get the body moving ykyk.",
    syntax: "",
    cooldown: 5,
    aliases: ['starter'],
    category: "Economy",
    execute(message) {
        const itemName = "Common Treasure Chest";
        const itemQuantity = 5;
        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                // Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }
            if (user.currency > 0 || user.exp > 0 || user.level > 1 || Object.keys(user.inv).length != 1 || user.inv.Apple.quantity != 1) {
                message.channel.send("This starter pack is for newbies, dont take their stuff u pig!");
                return;
            }
            const newbie = user.player.name;
            user.currency += 20;
            user.inv[itemName] = await findItem(itemName);
            user.inv[itemName].quantity = itemQuantity;
            user.markModified('inv');
            user.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));
            message.channel.send(`${newbie} has successfully claimed ${newbie}'s starter pack (only one per user)` +
                `\n ${newbie} gained 20 <:cash_24:751784973488357457>` +
                `\n ${newbie} gained 5 <:CommonChest:819856620572901387>`);
        });
    },
};
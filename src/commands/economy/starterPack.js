const User = require('../../models/user');
const findPrefix = require('../../functions/findPrefix');
const findItem = require('../../functions/findItem.js');
const giveWeaponID = require('../../functions/giveWeaponID.js');
const makeEquipment = require('../../functions/makeEquipment');

module.exports = {
    name: "starterpack",
    description: "For new players to claim and get some stuff. Some stuff to get the body moving ykyk.",
    syntax: "",
    cooldown: 5,
    aliases: ['starter'],
    category: "Economy",
    execute({ message }) {
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
            const uncommonWeapon = ['Long Sword', 'Heavy Sword', 'Axe', 'Bow', 'Staff'];
            let weaponName = uncommonWeapon[Math.floor(Math.random() * uncommonWeapon.length)];
            const newbie = user.player.name;
            user.currency += 20;
            user.inv["Common Treasure Chest"] = await findItem("Common Treasure Chest");
            user.inv["Common Treasure Chest"].quantity = 5;
            user.inv["X2 Experience Ticket (1 Hour)"] = await findItem("X2 Experience Ticket (1 Hour)");
            user.inv["X2 Experience Ticket (1 Hour)"].quantity = 1;
            const weapon = await makeEquipment(weaponName);
            weaponName = await giveWeaponID(weaponName);
            user.inv[weaponName] = weapon;
            user.markModified('inv');
            user.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));
            message.channel.send(`${newbie} has successfully claimed ${newbie}'s starter pack (only one per user)` +
                `\n ${newbie} gained 20 <:cash_24:751784973488357457>` +
                `\n ${newbie} gained 5 <:CommonChest:819856620572901387>` +
                `\n ${newbie} gained ${weaponName}`);
        });
    },
};
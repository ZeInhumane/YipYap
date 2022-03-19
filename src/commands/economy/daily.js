const User = require('../../models/user');
const findPrefix = require('../../functions/findPrefix');
const findItem = require('../../functions/findItem.js');
module.exports = {
    name: "daily",
    description: "Claim a daily reward :)",
    syntax: "",
    cooldown: 86400,
    aliases: ['dailies'],
    category: "Economy",
    execute({ message }) {
        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                // Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }
            // For event(chance for getting a ticket or sth :))

            const d = Math.random();
            if (d < 0.1) {
                if (user.inv["X2 Experience Ticket (1 Hour)"]) {
                    user.inv["X2 Experience Ticket (1 Hour)"].quantity += 1;
                    message.channel.send("Congratulations on playing during a major update, you have gotten a small token of appreciation from us :)");
                } else {
                    const addItem = await findItem("X2 Experience Ticket (1 Hour)");
                    user.inv["X2 Experience Ticket (1 Hour)"] = addItem;
                    user.inv["X2 Experience Ticket (1 Hour)"].quantity = 1;
                    message.channel.send("Congratulations on playing during a major update, you have gotten a small token of appreciation from us :)");
                }
            }


            const currencyReward = 100;
            user.currency += currencyReward;
            user.markModified('inv');
            user.save()
                .then(result => console.log(`${result._doc.userID} claimed daily reward`))
                .catch(err => console.error(err));
            message.channel.send(`You have successfully claimed your daily of ${currencyReward} <:cash_24:751784973488357457>`);
            message.channel.send("Claim everyday for a chance to get experience tickets!");
            message.channel.send(`You now have ${user.currency} <:cash_24:751784973488357457>`);
        });
    },
};
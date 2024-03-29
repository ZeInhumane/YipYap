const User = require('../../models/user');
const findPrefix = require('../../functions/findPrefix');
const { regex } = require('../../constants/regex');
const config = require('../../../config.json');

module.exports = {
    name: "removegold",
    description: "Give someone your money",
    syntax: "{Player giving money to} {Amount of money}",
    cooldown: 5,
    aliases: [''],
    category: "Admin",
    execute({ message, args }) {
        const transferAmount = parseInt(args.find(arg => !regex.anyInt.test(arg)));
        const transferTarget = message.mentions.users.first();
        if (config.admins.includes(message.author.id)) {
            User.findOne({ userID: message.author.id }, async (err, user) => {
                if (user == null) {
                    // Getting the prefix from db
                    const prefix = await findPrefix(message.guild.id);
                    message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                } else {
                    if (!transferAmount || isNaN(transferAmount)) {
                        message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
                        return;
                    }
                    if (transferAmount <= 0) {
                        message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);
                        return;
                    }
                }
                if (transferTarget == undefined) {
                    message.channel.send("invalid id");
                    return;
                }
                User.findOne({ userID: transferTarget.id }, (err, target) => {
                    if (target == null) {
                        message.channel.send("The person you are trying to give money to has not set up a player yet! Do =start to start.");
                    } else {
                        target.currency -= transferAmount;
                        user.save()
                            .then(result => console.log(result))
                            .catch(err => console.error(err));
                        target.save()
                            .then(result => console.log(result))
                            .catch(err => console.error(err));
                        message.channel.send(`Successfully removed ${transferAmount}<:cash_24:751784973488357457> to ${transferTarget.tag}. Their current balance is ${target.currency}<:cash_24:751784973488357457>`);
                    }
                });
            });
        } else {
            message.channel.send("You have to be a bot developer to use this command");
        }
    },
};

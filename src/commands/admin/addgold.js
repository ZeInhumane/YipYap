const User = require('../../models/user');
var config = require('../../../config.json');

module.exports = {
    name: "addgold",
    description: "Give someone money from the void",
    syntax: "{Player giving money to} {Amount of money}",
    cooldown: 5,
    aliases: [''],
    category: "Admin",
    async execute({ message, args, prefix }) {
        // Transfer amount
        let transferAmount = 1;
        const transferAmountIndex = args.findIndex(arg => /^[1-9]\d*$/g.test(arg));
        const transferTarget = message.mentions.users.first();

        // Check for admin ID
        if (config.admins.includes(message.author.id)) {
            if (transferTarget == undefined) {
                message.channel.send("Invalid id");
                return;
            }

            User.findOne({ userID: transferTarget.id }, async (err, target) => {
                if (target == null) {
                    message.channel.send(`The person you are trying to give money to has not set up a player yet! Do ${prefix}start to start.`);
                } else {
                    // Check if user entered a vaild transfer amount (else use default)
                    if (transferAmountIndex != -1) {
                        transferAmount = parseInt(args[transferAmountIndex]);
                    }
                    target.currency += transferAmount;
                    target.save()
                        .then(result => console.log(result))
                        .catch(err => console.error(err));
                    message.channel.send(`Successfully added ${transferAmount}<:cash_24:751784973488357457> to ${transferTarget.tag}. Their current balance is ${target.currency}<:cash_24:751784973488357457>`);
                }
            });
        } else {
            message.channel.send("You have to be a bot developer to use this command");
        }
    },
};

const User = require('../../models/user');
const findPrefix = require('../../functions/findPrefix');

module.exports = {
    name: "addgold",
    description: "Give someone money from the void",
    syntax: "{Player giving money to} {Amount of money}",
    cooldown: 5,
    aliases: [''],
    category: "Admin",
    async execute({ message, args }) {
        // Transfer amount
        let transferAmount = 1;
        const transferAmountIndex = args.findIndex(arg => /^[1-9]\d*$/g.test(arg));
        const transferTarget = message.mentions.users.first();

        // Check for admin ID
        switch (message.author.id) {
            case "752724534028795955":
            case "344431410360090625":
            case "223583120325083137":
            case "272202473827991557":
                if (transferTarget == undefined) {
                    message.channel.send("Invalid id");
                    return;
                }

                User.findOne({ userID: transferTarget.id }, async (err, target) => {
                    if (target == null) {
                        // Getting the prefix from db
                        const prefix = await findPrefix(message.guild.id);
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
                break;

            default:
                message.channel.send("You have to be a bot developer to use this command");
        }
    },
};

const User = require('../../models/user');
const findItem = require('../../functions/findItem.js');
const giveWeaponID = require('../../functions/giveWeaponID.js');
const makeEquipment = require('../../functions/makeEquipment');
const findPrefix = require('../../functions/findPrefix');
const titleCase = require('../../functions/titleCase');

module.exports = {
    name: "additem",
    description: "Give someone more of an item from the void",
    syntax: '{Player giving item to} {Name of item} {Amount of item}',
    cooldown: 5,
    aliases: [''],
    category: "Admin",
    async execute({ message, args }) {
        // regex to test for num with decimal (and a plus sign at the start for some reason?)
        //  /^[+]?\d+([.]\d+)?$/g.test(arg)

        // Finds arguments no matter the position
        let transferAmount = 1;
        const transferAmountIndex = args.findIndex(arg => /^[1-9]\d*$/g.test(arg));
        if (transferAmountIndex != -1) {
            // Extracts transferAmount
            transferAmount = parseInt(args[transferAmountIndex]);
            // Removes transferAmount from args list
            args.splice(transferAmountIndex, 1);
        }

        // Finds a mention in message
        const transferTarget = message.mentions.users.first();
        if (transferTarget == undefined) {
            message.channel.send("Invalid user id!");
            return;
        }
        // Finds the mention in args and removes it
        const transferTargetIndex = args.findIndex(arg => /<@!\d*>/g.test(arg));
        args.splice(transferTargetIndex, 1);

        // Rest of the args become the item name
        let itemName = args.join(" ");

        itemName = titleCase(itemName);
        // Check for admin ID
        switch (message.author.id) {
            case "752724534028795955":
            case "344431410360090625":
            case "272202473827991557":
                User.findOne({ userID: transferTarget.id }, async (err, target) => {
                    if (target == null) {
                        // Getting the prefix from db
                        const prefix = await findPrefix(message.guild.id);
                        message.channel.send(`The person you are trying to give money to has not set up a player yet! Do ${prefix}start to start.`);
                        return;
                    }
                    if (target.inv[itemName]) {
                        target.inv[itemName].quantity += transferAmount;
                    } else {
                        let addItem = await findItem(itemName);

                        if (addItem == null) {
                            message.channel.send(`${itemName} does not exist!`);
                            return;
                        }
                        if (addItem.type == 'equipment') {
                            addItem = await makeEquipment(itemName);
                            itemName = await giveWeaponID(itemName);
                            transferAmount = 1;
                        }

                        target.inv[itemName] = addItem;
                        target.inv[itemName].quantity = transferAmount;
                    }
                    target.markModified('inv');
                    target.save()
                        .then(result => console.log(result))
                        .catch(err => console.error(err));
                    message.channel.send(`Successfully added ${transferAmount} ${itemName} to ${transferTarget.tag}. Their current quantity of ${itemName} is ${target.inv[itemName].quantity}`);
                });

                break;

            default:
                message.channel.send("You have to be a bot developer to use this command");
        }
    },
};

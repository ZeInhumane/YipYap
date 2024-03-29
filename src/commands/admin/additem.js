const User = require('../../models/user');
const findItem = require('../../functions/findItem.js');
const giveWeaponID = require('../../functions/giveWeaponID.js');
const makeEquipment = require('../../functions/makeEquipment');
const { regex } = require('../../constants/regex.js');
const config = require('../../../config.json');

module.exports = {
    name: "additem",
    description: "Give someone more of an item from the void",
    syntax: '{Player giving item to} {Name of item} {Amount of item}',
    cooldown: 5,
    aliases: [''],
    category: "Admin",
    async execute({ message, args, prefix }) {
        // regex to test for num with decimal (and a plus sign at the start for some reason?)
        //  /^[+]?\d+([.]\d+)?$/g.test(arg)

        // Finds arguments no matter the position
        let transferAmount = 1;
        const transferAmountIndex = args.findIndex(arg => regex.anyInt.test(arg));
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
        const transferTargetIndex = args.findIndex(arg => regex.anyMention.test(arg));
        args.splice(transferTargetIndex, 1);

        // Rest of the args become the item name
        let itemName = args.join(" ");

        // Check for admin ID
        if (config.admins.includes(message.author.id)) {
            User.findOne({ userID: transferTarget.id }, async (err, target) => {
                if (target == null) {
                    message.channel.send(`The person you are trying to give money to has not set up a player yet! Do ${prefix}start to start.`);
                    return;
                }

                // Gets equipment info from db
        
                let addItem = await findItem(itemName, true);
                if (!addItem){
                    message.channel.send(`Invalid item name ${itemName}.`);
                    return;
                }
                // Corrects item name to the one in the db
                const correctName = addItem.itemName;
                if (itemName != correctName){
                    itemName = correctName;
                }

                if (target.inv[itemName]) {
                    target.inv[itemName].quantity += transferAmount;
                } else {
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
                    .then((result) => console.log(`${transferAmount} ${itemName} was added to ${result._doc.userID} by ${message.author.id}`))
                    .catch(err => console.error(err));
                message.channel.send(`Successfully added ${transferAmount} ${itemName} to ${transferTarget.tag}. Their current quantity of ${itemName} is ${target.inv[itemName].quantity}`);
            });
        } else {
            message.channel.send("You have to be a bot developer to use this command");
        }
    },
};

const User = require('../../models/user');
const UserEffects = require('../../models/userEffects');
const findPrefix = require('../../functions/findPrefix');

module.exports = {
    name: "changeauto",
    description: "Change auto use mode for tickets",
    syntax: "{ticket full name as shown in inventory} {auto/on (sets auto to true) off (sets auto to false) If argument is null, it will become the opposite of current status}",
    cooldown: 5,
    aliases: ['changeAuto'],
    category: "Fun",
    async execute(message, args) {
        // Gets multiplier (up to 1 dp)
        const multiplierIndex = args.findIndex(arg => /^x[^0|\D]\d{0,9}(\.\d)?$/gmi.test(arg));
        if (multiplierIndex == -1) {
            return message.channel.send("Specifiy ticket bonus multiplier!");
        }
        // Extracts multiplier
        const multiplier = parseFloat(args[multiplierIndex].replace(/x/gmi, ""));
        // Removes multiplier from args list
        args.splice(multiplierIndex, 1);

        // Gets ticketName
        const ticketNameIndex = args.findIndex(arg => /^(exp|experience|gold)$/gi.test(arg));
        if (ticketNameIndex == -1) {
            return message.channel.send("Specifiy ticket type!");
        }
        // Extracts ticketName
        let ticketName = args[ticketNameIndex].toLowerCase();
        // Just make the first letter uppercase
        ticketName = ticketName.charAt(0).toUpperCase() + ticketName.substring(1);
        // Can short form, change back
        if (ticketName == 'Exp') {
            ticketName = 'Experience';
        }
        // Removes ticketName from args list
        args.splice(ticketNameIndex, 1);

        // Gets ticketDuration
        const ticketDurationIndex = args.findIndex(arg => /\d/gi.test(arg));
        if (ticketDurationIndex == -1) {
            return message.channel.send("Specifiy ticket duration!");
        }
        // Extracts ticketDuration
        const ticketDuration = parseInt(args[ticketDurationIndex]);
        // Removes ticketDuration from args list
        args.splice(ticketDurationIndex, 1);

        // Gets isAuto
        const isAutoIndex = args.findIndex(arg => /^(on|off)$/gi.test(arg));
        // Removes isAuto from args list
        args.splice(isAutoIndex, 1);

        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                // Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }

            // get the full name of the ticket
            const ticket = `X${multiplier} ${ticketName} Ticket (${ticketDuration} Hour${(ticketDuration) > 1 ? "s" : ""})`;
            UserEffects.findOne({ userID: message.author.id }, async (err, effects) => {
                if (effects == null) {
                    message.channel.send('You have not used any tickets');
                    return;
                }

                // if effects has this ticket in the tickets object
                if (!effects.tickets[ticket]) {
                    message.channel.send(`You have not used any ${ticket}s.`);
                    return;
                }

                let isAuto;
                if (isAutoIndex != -1) {
                    // Extracts isAuto
                    isAuto = args[isAutoIndex] == "on";
                    // if not specified and its not true or false, then put the opposite of the current one, true => false, false => true
                } else {
                    isAuto = !effects.tickets[ticket].auto;
                }

                // change the db object
                effects.tickets[ticket].auto = isAuto;
                message.channel.send(`You have turned auto for ${ticket} ${effects.tickets[ticket].auto ? 'on' : 'off'}.`);
                effects.markModified('tickets');
                effects.save()
                    .then(result => console.log("changeauto", result))
                    .catch(err => console.error(err));
            });
        });
    },
};
const User = require('../../models/user');
const UserEffects = require('../../models/userEffects');
const mongoose = require('mongoose');
const findItem = require('../../functions/findItem.js');
const findPrefix = require('../../functions/findPrefix');

module.exports = {
    name: "use",
    description: "Tickets allow you to get bonus rewards like gold and experience.",
    syntax: "{ticket full name as shown in inventory (with spaces)} {auto (leave blank if not auto use)}",
    cooldown: 10,
    aliases: ['ticket', 'tickets', 'tix'],
    category: "Economy",
    execute({ message, args }) {
        // Gets multiplier (up to 1 dp)
        const multiplierIndex = args.findIndex(arg => /^x[^0|\D]\d{0,9}(\.\d)?$/gmi.test(arg));
        if (multiplierIndex == -1) {
            return message.channel.send("Specify ticket bonus multiplier!");
        }
        // Extracts multiplier
        const multiplier = parseFloat(args[multiplierIndex].replace(/x/gmi, ""));
        // Removes multiplier from args list
        args.splice(multiplierIndex, 1);

        // Gets ticketName
        const ticketNameIndex = args.findIndex(arg => /^(exp|experience|gold)$/gi.test(arg));
        if (ticketNameIndex == -1) {
            return message.channel.send("Specify ticket type!");
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
            return message.channel.send("Specify ticket duration!");
        }
        // Extracts ticketDuration
        const ticketDuration = parseInt(args[ticketDurationIndex].match(/\d+/)[0]);
        // Removes ticketDuration from args list
        args.splice(ticketDurationIndex, 1);

        // Gets isAuto
        const isAutoIndex = args.findIndex(arg => /^(on|off)$/gi.test(arg));
        let isAuto = false;
        if (isAutoIndex != -1) {
            // Extracts isAuto
            isAuto = args[isAutoIndex] == "on";
        }
        // Removes isAuto from args list
        args.splice(isAutoIndex, 1);

        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                // Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }

            const ticket = `X${multiplier} ${ticketName} Ticket (${ticketDuration} Hour${(ticketDuration) > 1 ? "s" : ""})`;
            UserEffects.findOne({ userID: message.author.id }, async (err, effects) => {
                const item = findItem(ticket);
                if (!item) {
                    message.channel.send(`${ticket} is not a valid ticket name.`);
                    return;
                }
                if (!user.inv[ticket]) {
                    message.channel.send(`Your inventory does not have any ${ticket}s!`);
                    return;
                }
                if (effects == null || Object.keys(effects._doc.tickets).filter(key => key.includes(ticketName)).length == 0) {
                    const today = new Date();
                    Date.prototype.addHours = function (h) {
                        this.setHours(this.getHours() + h);
                        return this;
                    };
                    const endDate = new Date().addHours(ticketDuration);
                    if (effects == null) {
                        effects = new UserEffects({
                            _id: mongoose.Types.ObjectId(),
                            userID: message.author.id,
                            tickets: { [ticket]: { 'duration': ticketDuration, 'multiplier': multiplier, 'auto': isAuto, 'startTime': today, 'endTime': endDate } },
                        });
                    } else {
                        effects.tickets[ticket] = { 'duration': ticketDuration, 'multiplier': multiplier, 'auto': isAuto, 'startTime': today, 'endTime': endDate };
                    }
                    user.inv[ticket].quantity -= 1;
                    if (user.inv[ticket].quantity == 0) {
                        delete user.inv[ticket];
                    }
                    message.channel.send(`You have used a ${ticket}! It will expire in ${ticketDuration} hours. Use the viewticket command to view current boosts.`);
                } else {
                    const today = new Date();
                    if (Object.keys(effects._doc.tickets).filter(key => key.includes(ticketName)).length != 0 || today >= effects.tickets[Object.keys(effects._doc.tickets).filter(key => key.includes(ticketName))[0]].endTime) {
                        console.log(Object.keys(effects._doc.tickets).filter(key => key.includes(ticketName)));
                        const usedticket = Object.keys(effects._doc.tickets).filter(key => key.includes(ticketName))[0];
                        if (effects.tickets[usedticket].auto == 'true') {

                            Date.prototype.addHours = function (h) {
                                this.setHours(this.getHours() + h);
                                return this;
                            };
                            const endDate = new Date().addHours(ticket.duration);
                            effects.tickets[usedticket].startTime = today;
                            effects.tickets[usedticket].endTime = endDate;

                            message.channel.send(`Your ${usedticket} ticket has been used up. Another ${usedticket} has been used. To stop automatically using tickets, use the changeauto command.`);
                        } else {
                            message.channel.send(`Your ${usedticket} ticket has been used up. Activate auto when using tickets to automatically use another after cooldown.`);
                            delete effects.tickets[usedticket];
                        }
                    } else {
                        message.channel.send(`You already have a ${ticketName} Ticket in use! Same types of tickets cannot be stacked. Use the viewticket command to view current boosts.`);
                        return;
                    }
                }
                effects.markModified('tickets');
                effects.save()
                    .then(result => console.log("ticket", result))
                    .catch(err => console.error(err));

                user.markModified('inv');
                user.save()
                    .then(result => console.log("ticket", result))
                    .catch(err => console.error(err));
            });
        });
    },
};
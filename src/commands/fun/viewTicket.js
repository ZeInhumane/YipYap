const User = require('../../models/user');
const userEffects = require('../../models/userEffects');
const Discord = require('discord.js');
const findPrefix = require('../../functions/findPrefix');

module.exports = {
    name: "viewticket",
    description: "Shows the active tickets and their status.",
    syntax: "",
    aliases: ['viewtickets', 'tickets'],
    cooldown: 5,
    category: "Fun",
    execute({ message }) {
        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                // Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }

            let name = message.member.user.tag.toString();
            name = name.split("#", name.length - 4);
            name = name[0];
            userEffects.findOne({ userID: message.author.id }, (err, effects) => {
                if (effects == null) {
                    message.channel.send('You have not used any ticekts before');
                    return;
                }
                const embed = new Discord.MessageEmbed()
                    .setTitle(name + `'s tickets in use`)
                    .setColor('#000000');
                const ticketTypes = ['Experience', 'Gold'];

                if (Object.keys(effects.tickets).length > 0) {
                    for (let i = 0; i < ticketTypes.length; i++) {
                        const ticketName = Object.keys(effects.tickets).filter(key => key.includes(ticketTypes[i]));
                        console.log(ticketName);
                        if (ticketName.length != 0) {
                            const ticket = effects.tickets[ticketName];
                            let today = new Date();
                            if (today >= ticket.endTime) {
                                if (ticket.auto == 'true') {
                                    if (user.inv[ticket]) {
                                        today = new Date();
                                        Date.prototype.addHours = function (h) {
                                            this.setHours(this.getHours() + h);
                                            return this;
                                        };
                                        const endDate = new Date().addHours(ticket.duration);
                                        const start = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + '/  ' + today.getHours() + ':' + today.getMinutes();
                                        const end = endDate.getFullYear() + '/' + (endDate.getMonth() + 1) + '/' + endDate.getDate() + '/  ' + endDate.getHours() + ':' + endDate.getMinutes();
                                        ticket.startTime = today;
                                        ticket.endTime = endDate;
                                        embed.addFields(
                                            { name: `${ticketTypes[i]} Ticket: `, value: `Your ${ticketTypes[i]} ticket has been used up. Another ${ticketName} has been used. To stop automatically using tickets, use the changeauto command.` },
                                            { name: 'Muliplier: ', value: `x ${ticket.multiplier}` },
                                            { name: 'Duration: ', value: `${ticket.duration} hour${(ticket.duration) > 1 ? "s" : ""}` },
                                            { name: 'Start time: ', value: `${start} UTC` },
                                            { name: 'End time: ', value: `${end} UTC` },
                                            { name: 'Auto: ', value: `${ticket.auto}` },
                                            { name: '\u200B', value: '\u200B' },
                                        );
                                        user.inv[ticket].quantity -= 1;
                                        if (user.inv[ticket].quantity == 0) {
                                            delete user.inv[ticket];
                                        }
                                    } else {
                                        embed.addField(`${ticketTypes[i]} Ticket:`, `Your ${ticketTypes[i]} ticket has been used up, but you do not have any more ${ticketName}s in your inventory. Auto will be deactivated`);
                                        delete effects.tickets[ticketName];
                                    }
                                } else {
                                    embed.addField(`${ticketTypes[i]} Ticket:`, `Your ${ticketTypes[i]} ticket has been used up. Activate auto when using tickets to automatically use another after cooldown.`);
                                    delete effects.tickets[ticketName];
                                }
                            } else {
                                const startTime = ticket.startTime;
                                const start = startTime.getFullYear() + '/' + (startTime.getMonth() + 1) + '/' + startTime.getDate() + '/  ' + startTime.getHours() + ':' + startTime.getMinutes();
                                const endTime = ticket.endTime;
                                const end = endTime.getFullYear() + '/' + (endTime.getMonth() + 1) + '/' + endTime.getDate() + '/  ' + endTime.getHours() + ':' + endTime.getMinutes();

                                embed.addFields(
                                    { name: `${ticketTypes[i]} Ticket: `, value: '\u200B' },
                                    { name: 'Muliplier: ', value: `x ${ticket.multiplier}` },
                                    { name: 'Duration: ', value: `${ticket.duration} hour${(ticket.duration) > 1 ? "s" : ""}` },
                                    { name: 'Start time: ', value: `${start} UTC` },
                                    { name: 'End time: ', value: `${end} UTC` },
                                    { name: 'Auto: ', value: `${ticket.auto}` },
                                    { name: '\u200B', value: '\u200B' },
                                );
                            }
                        } else {
                            embed.addField(`${ticketTypes[i]} Ticket:`, `No active ${ticketTypes[i]} tickets`);
                        }
                    }
                    effects.markModified('tickets');
                    effects.save()
                        .then(result => console.log(result))
                        .catch(err => console.error(err));
                } else {
                    embed.addField("You have no active tickets.​", '​');
                }

                message.channel.send({ embeds: [embed] });
            });
        });
    },
};
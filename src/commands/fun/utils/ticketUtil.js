const userEffects = require('../../../models/userEffects.js');

/**
 * Handles ticket effects
 * @param {string} userID
 * @param {User} user
 * @param {Message} message
 */

exports.ticketEffects = async function (userID, user, message) {

    let expMsg = 'No active EXP Ticket.';
    let goldMsg = 'No active Gold Ticket.';

    await userEffects.findOne({ userID: userID }, async (err, effects) => {
        // Check if user has any active effects
        if (!effects) return;

        // Check if user has any active tickets
        const tickets = Object.keys(effects.tickets);
        for (let i = 0; i < tickets.length; i++) {
            const ticketName = tickets[i];
            const ticket = effects.tickets[ticketName];
            const today = new Date();
            if (today >= ticket.endTime) {
                let msg = `You do not have auto active. Your ${ticketName} has been used up.`;
                if (ticket.auto == 'true') {
                    if (user.inv[ticketName]) {
                        msg = `Auto is active, another ${ticketName} has been activated.`;
                        user.inv[ticketName].quantity -= 1;
                        ticket.startTime = new Date();
                        Date.prototype.addHours = function (h) {
                            this.setHours(this.getHours() + h);
                            return this;
                        };
                        ticket.endTime = new Date().addHours(ticket.duration);
                        if (user.inv[ticketName].quantity == 0) {
                            msg += ` This is your last ${ticketName}.`;
                            delete user.inv[ticketName];
                        }

                    } else {
                        msg = `Your inventory does not have any more ${ticketName}. auto will be deactivated.`;
                        delete effects.tickets[ticketName];
                    }

                    user.markModified('inv');
                    user.save()
                        .then(result => console.log(result))
                        .catch(err => console.error(err));
                } else {
                    delete effects.tickets[ticketName];
                }
                message.channel.send(msg);
            }
        }

        const expTicketName = Object.keys(effects.tickets).filter(key => key.includes('Experience'))[0];
        const expTicketObject = effects.tickets[expTicketName];

        const goldTicketName = Object.keys(effects.tickets).filter(key => key.includes('Gold'))[0];
        const goldTicketObject = effects.tickets[goldTicketName];
        if (expTicketName) {
            expMsg = `${expTicketName} active: Boost Experience gained by ${expTicketObject.multiplier}`;
        }
        if (goldTicketName) {
            goldMsg = `${goldTicketName} active: Boost Gold gained by ${goldTicketObject.multiplier}`;
        }
        effects.markModified('tickets');
        effects.save()
            .then(result => console.log(`Edited ticket effects for ${result._doc.userID}`))
            .catch(err => console.error(err));
    });

    return { expMsg, goldMsg };
};
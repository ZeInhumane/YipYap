module.exports = {
    execute(message, winner, loser) {
        const User = require('../models/user');
        message.channel.send(winner.name + ' defeated ' + loser.name + '!');
        User.findOne({ userID: message.author.id }, (err, user) => {
            winner.currency += 1;
        });
    }
}
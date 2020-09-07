module.exports = {
    execute(message, winner, loser) {
        const User = require('../../models/user');
        message.channel.send(winner.name + ' defeated ' + loser.name + '!');
        var moneyEarned = 1;
        User.findOne({ userID: message.author.id }, (err, user) => {
            winner.currency += moneyEarned;
            winner.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
        });
        message.channel.send(winner.name + " got " + moneyEarned + "<:cash_24:751784973488357457>");
    }
}
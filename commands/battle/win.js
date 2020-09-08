module.exports = {
    execute(message, winner, loser) {
        const User = require('../../models/user');
        message.channel.send(winner.player.name + ' defeated ' + loser.name || loser.player.name + '!');
        console.log(loser.name || loser.player.name);
        var moneyEarned = 1;
        User.findOne({ userID: winner.userID }, (err, user) => {
            user.currency += moneyEarned;
            user.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
        });
        message.channel.send(winner.player.name + " got " + moneyEarned + "<:cash_24:751784973488357457>");
    }
}
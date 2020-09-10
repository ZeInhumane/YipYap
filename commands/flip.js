module.exports = {
    name: "flip",
    description: "Bet and flip a coin. Getting heads will double your bet, getting tails will lose it all.",
    cooldown: 10,
    execute(message, args) {
        const User = require('../models/user');
        const mongoose = require('mongoose');
        User.findOne({ userID: message.author.id }, (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
            }
            else {
                var bet = parseInt(args[0]);
                if(bet == undefined || isNaN(bet)){
                    message.channel.send("Invaild amount");
                }
                else if (bet > user.currency) {
                    message.channel.send("You do not have enough money for that bet");
                }
                else {
                    var rng = Math.floor(Math.random() * 1001);
                    if (rng == 451) {
                        user.currency += bet * 50;
                        message.channel.send("The coin landed upright! <:CoinStanding:753516348507815966> \nYou got " + bet * 50 + "<:cash_24:751784973488357457>");
                    }
                    else if (rng < 451) {
                        user.currency += bet;
                        message.channel.send("The coin landed on heads <:CoinHead:753518321214816297> .\nYou got " + bet + "<:cash_24:751784973488357457>");
                    }
                    else {
                        user.currency -= bet;
                        message.channel.send("The coin landed on tails <:CoinTail:753516329453092904>.\nYou lost " + bet + "<:cash_24:751784973488357457>");
                    }
                    user.save()
                        .then(result => console.log(result))
                        .catch(err => console.error(err));
                }
            }
        });
    }
}
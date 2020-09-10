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
                if(args[1] == undefined){
                    message.channel.send("Invaild syntax");
                    return;
                }
                var faceBetted = args[1].toLowerCase();
                if(faceBetted != "head" && faceBetted != "tail" && faceBetted != "heads" && faceBetted != "tails"){
                    message.channel.send("Invaild face of coin betted on");
                    return;
                }
                if(bet == undefined || isNaN(bet)){
                    message.channel.send("Invaild amount");
                }
                else if (bet > user.currency) {
                    message.channel.send("You do not have enough money for that bet");
                }
                else {
                    var rng = Math.floor(Math.random() * 10001);
                    var faceLanded, winLoseStatement;
                    if (rng == 5000) {
                        user.currency += bet * 100;
                        faceLanded = "upright! <:CoinStanding:753516348507815966>.";
                        winLoseStatement = "got";
                    }
                    else if (rng < 500) {
                        if(faceBetted == "head" || faceBetted == "heads"){
                            user.currency += bet;
                            winLoseStatement = "got";
                        }
                        else{
                            user.currency -= bet;
                            winLoseStatement = "lost";
                        }
                        faceLanded = "on heads <:CoinHead:753518321214816297>.";
                    }
                    else {
                        if(faceBetted == "tail" || faceBetted == "tails"){
                            user.currency += bet;
                            winLoseStatement = "got";
                        }
                        else{
                            user.currency -= bet;
                            winLoseStatement = "lost";
                        }
                        faceLanded = "on tails <:CoinTail:753516329453092904>.";
                    }
                    message.channel.send("The coin landed " + faceLanded + "\nYou " + winLoseStatement + " " + bet + "<:cash_24:751784973488357457>");
                    user.save()
                        .then(result => console.log(result))
                        .catch(err => console.error(err));
                }
            }
        });
    }
}
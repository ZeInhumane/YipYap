const User = require('../models/user');
const mongoose = require('mongoose');
const findPrefix = require('../functions/findPrefix');

module.exports = {
    name: "flip",
    description: "betAmount and flip a coin. Getting heads will double your betAmount, getting tails will lose it all.",
    syntax: "{Amount of money betted} {Face of coin to betAmount on}",
    cooldown: 10,
    category: "Gambling",
    execute(message, args) {
        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                //Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }

            // Finds arguments no matter the position
            let betAmount = 1;
            let betAmountIndex = args.findIndex(arg => /^[1-9]\d*$/g.test(arg));
            if (betAmountIndex != -1) {
                // Extracts betAmount
                betAmount = parseInt(args[betAmountIndex]);
                // Removes betAmount from args list
                args.splice(betAmountIndex, 1);
            }

            // Checks if betAmount is vaild
            if (betAmount > user.currency) {
                message.channel.send("You do not have enough money for that bet");
                return;
            }
            if (betAmount < 1) {
                message.channel.send("You cannot bet 0 or less money");
                return;
            }

            // Finds faceBetted
            let faceBettedIndex = args.findIndex(arg => /^(heads?|tails?)$/gi.test(arg));
            if (faceBettedIndex == -1) {
                message.channel.send("Invalid face of coin betted on");
                return;
            }
            // Gets faceBetted and formats it so it is only either head or tail
            let faceBetted = args[faceBettedIndex].toLowerCase().replace(/s$/g, "");

            let rng = Math.floor(Math.random() * 10002);
            let faceLanded, winLoseStatement;
            function win(isWin, multi = 1) {
                if (isWin) {
                    user.currency += betAmount * multi;
                    winLoseStatement = "got";
                    return;
                }
                user.currency -= betAmount * multi;
                winLoseStatement = "lost";
            }

            if (rng == 5000) {
                win(true, 100);
                faceLanded = "upright! <:CoinStanding:753516348507815966>.";
            }
            else if (rng < 5000) {
                let isWin = faceBetted == "head";
                win(isWin);
                faceLanded = "on heads <:CoinHead:753518321214816297>.";
            }
            else {
                let isWin = faceBetted == "tail";
                win(isWin);
                faceLanded = "on tails <:CoinTail:753516329453092904>.";
            }
            message.channel.send(`The coin landed ${faceLanded}\nYou ${winLoseStatement} ${betAmount} <:cash_24:751784973488357457>`);
            user.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));
        });
    }
}
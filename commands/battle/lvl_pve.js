module.exports = {
    execute(message, winner, loser) {
        // const Discord = require('../discord.js');
        const User = require('../../models/user');
        const is_lvlup = require('./is_lvlup')
        // level diff to calculate exp multiplier

        if (winner.level > loser.level) {
            let lvl_diff = winner.level - loser.level;
        }
        else {
            let lvl_diff = loser.level - winner.level;
        }

        // calculating actual exp characters get
        let exp_gain = Math.ceil(lvl_diff * 3 + 5);

        // adding exp
        let winner_exp = winner.exp + exp_gain;

        // message gain exp
        message.channel.send(winner.player.name + ' has gained ' + exp_gain + ' exp!');
        // updating level and current exp to database
        let update_winner = new is_lvlup(winner_exp, winner.level, winner.player.name);
        User.findOne({ userID: winner.userID }, (err, user) => {
            user.exp = update_winner.new_exp();
            user.level = update_winner.new_lvl();
            user.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));
        });
        // apply a check to check for level up
        // congratulate those who level up
        if (update_winner.level_up()) {
            message.channel.send(update_winner.level_up());
        }
    }
}

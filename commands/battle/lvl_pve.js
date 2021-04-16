module.exports = {
    execute(message, winner, loser) {
        // const Discord = require('../discord.js');
        const User = require('../../models/user');

        // level diff to calculate exp multiplier

        if (winner.level > loser.level) {
            var lvl_diff = winner.level - loser.level;
        }
        else {
            var lvl_diff = loser.level - winner.level;
        }

        // calculating actual exp characters get
        var exp_gain = Math.ceil(lvl_diff * 3 + 5);

        // adding exp
        var winner_exp = winner.exp + exp_gain;

        // message gain exp
        message.channel.send(winner.player.name + ' has gained ' + exp_gain + ' exp!');

        // calculating if user lvl up or not
        class is_lvlup {
            constructor(current_exp, user_lvl, user_name) {
                var total_lvls = 0;
                var next_lvl = Math.floor(user_lvl * (user_lvl / 10 * 21));
                while (current_exp >= next_lvl) {
                    current_exp = current_exp - next_lvl;
                    total_lvls++;
                    user_lvl++;
                    next_lvl = Math.floor(user_lvl * (user_lvl / 10 * 21));
                }
                this.total_lvls = total_lvls;
                this.current_exp = current_exp;
                this.next_lvl = next_lvl;
                this.user_name = user_name;
                this.user_lvl = user_lvl;
            }
            level_up() {
                if (this.total_lvls > 0) {
                    return 'Congratulations! ' + this.user_name + ' has gained ' + this.total_lvls + ' levels!\n ' + this.user_name + ' is now at level ' + this.user_lvl + ' !';
                }
                return '';
            }
            new_exp() {
                return this.current_exp;
            }
            new_lvl() {
                return this.user_lvl;
            }
        }

        // updating level and current exp to database
        var update_winner = new is_lvlup(winner_exp, winner.level, winner.player.name);
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

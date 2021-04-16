module.exports = {
    execute(message, winner, loser,experienceMultiplier) {
        // const Discord = require('../discord.js');
        const User = require('../../models/user');
        // level diff to calculate exp multiplier
        var lvl_diff = winner.level - loser.level;
        var winner_higher = true;
        if (lvl_diff <= 0) {
            winner_higher = false;
            lvl_diff *= -1;
        }

        // calculating actual exp characters get
        function winning_exp(user_level, winner_higher, lvl_diff,experienceMultiplier) {
            var exp_gain;
            if (winner_higher) {
                exp_gain = Math.ceil((lvl_diff * -0.8 + user_level * 0.5) * experienceMultiplier);
                if (exp_gain <= 0) {
                    console.log('exp_gain is neg')
                    exp_gain = 1;
                }
            }
            else {
                if (lvl_diff == 0) {
                    exp_gain = Math.ceil((user_level * 0.5) * experienceMultiplier )
                }
                else {
                    exp_gain = Math.ceil((lvl_diff * 4 + user_level * 0.5) * experienceMultiplier);
                }

            }
            console.log(exp_gain)
            return exp_gain;
        }

        var exp_gain = winning_exp(winner.level, winner_higher, lvl_diff,experienceMultiplier);

        // adding exp
        var winner_exp = winner.exp + exp_gain;

        // message gain exp
        let embedText = `${winner.player.name} has gained ${exp_gain} exp!`;

        // calculating if user lvl up or not
        class is_lvlup {
            constructor(current_exp, user_lvl, user_name) {
                var total_lvls = 0;
                var next_lvl = Math.floor(user_lvl * (user_lvl / 10 * 15));
                console.log(next_lvl)
                while (current_exp >= next_lvl) {
                    current_exp -= next_lvl;
                    total_lvls++;
                    user_lvl++;
                    next_lvl = Math.floor(user_lvl * (user_lvl / 10 * 15));
                    console.log(next_lvl)
                }
                this.total_lvls = total_lvls;
                this.current_exp = current_exp;
                this.next_lvl = next_lvl;
                this.user_name = user_name;
                this.user_lvl = user_lvl;
            }
            level_up() {
                if (this.total_lvls > 0) {
                    return `Congratulations! ${this.user_name} has gained ${this.total_lvls} levels!\n${this.user_name} is now at level ${this.user_lvl}!\n${this.user_name} has gained ${5 * this.total_lvls} SP!`;
                }
                return '';
            }
            new_exp() {
                return this.current_exp;
            }
            new_lvl() {
                return this.user_lvl;
            }
            new_sp() {
                var add_sp = 0;
                if (this.total_lvls > 0) {
                    add_sp = this.total_lvls * 5;
                }
                return add_sp;
            }
        }

        // updating level, current exp and sp to database
        var update_winner = new is_lvlup(winner_exp, winner.level, winner.player.name);
        User.findOne({ userID: winner.userID }, (err, user) => {
            user.exp = update_winner.new_exp();
            user.level = update_winner.new_lvl();
            user.sp += update_winner.new_sp();
            user.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));
        });

        // congratulate those who level up
        if (update_winner.level_up()) {
            embedText += `\n${update_winner.level_up()}`;
        }
        return embedText;
    }
}

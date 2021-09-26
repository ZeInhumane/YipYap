module.exports = {
    execute(message, winner, loser) {
        // const Discord = require('../discord.js');
        const User = require('../../models/user');


        // level diff to calculate exp multiplier
        if (winner.level > loser.level) {
            let lvl_diff = winner.level - loser.level;
            let winner_higher = true;
        }
        else {
            let lvl_diff = loser.level - winner.level;
            let winner_higher = false;
        }

        // calculating actual exp characters get
        function winning_exp(winner_higher, lvl_diff) {
            let exp_gain;
            if (winner_higher) {
                exp_gain = Math.ceil(1 / lvl_diff * 10);
            }
            else {
                exp_gain = Math.ceil(lvl_diff * 3);
            }
            return exp_gain;
        }

        function losing_exp(winner_higher, lvl_diff) {
            let exp_gain;
            if (winner_higher) {
                exp_gain = Math.ceil(lvl_diff + lvl_diff * 0.5 + 3);
            }
            else {
                exp_gain = Math.ceil(lvl_diff * 0.5 + 3);
            }
            return exp_gain;
        }

        let winner_exp = winning_exp(winner_higher, lvl_diff);
        let loser_exp = losing_exp(winner_higher, lvl_diff);

        // adding exp
        winner.player.exp += winner_exp;
        loser.player.exp += loser_exp;

        // message gain exp
        message.channel.send(winner.player.name + ' has gained' + winner_exp + 'exp!\n' + (loser.name || loser.player.name) + 'has gained ' + loser_exp + '!');

        // calculating if user lvl up or not
        class is_lvlup {
            constructor(current_exp, user_lvl, user_name) {
                let total_lvls = 0;
                let next_lvl = Math.floor(user_lvl * (user_lvl / 10 * 21));
                while (current_exp >= next_lvl) {
                    current_exp -= next_lvl;
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
                    return 'Congratulations! ' + this.user_name + ' has gained ' + this.next_lvl + 's!\n ' + this.user_name + 'is now at level ' + this.user_lvl + ' !';
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
        let update_winner = new is_lvlup(winner.exp, winner.level, winner.userID);
        let update_loser = new is_lvlup(loser.exp, loser.level, loser.userID);
        User.findOne({ userID: winner.userID }, (err, user) => {
            user.exp = update_winner.new_exp();
            user.lvl = update_winner.new_lvl();
            user.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));
        });
        User.findOne({ userID: loser.userID }, (err, user) => {
            user.exp = update_loser.new_exp();
            user.lvl = update_loser.new_lvl();
            user.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));
        });

        // congratulate those who level up
        message.channel.send(update_winner.level_up() + '\n' + update_loser.level_up());
    }
}

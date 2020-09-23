module.exports = {
    execute(message, winner, loser) {
        // const Discord = require('../discord.js');
        const User = require('../../models/user');


        // level diff to calculate exp multiplier
        var lvl_diff = winner.level - loser.level;
        var winner_higher = true;
        if (lvl_diff < 0) {
            winner_higher = false;
            lvl_diff = lvl_diff * -1;
        }

        // calculating actual exp characters get
        function winning_exp(winner_higher, lvl_diff) {
            var exp_gain;
            if (winner_higher) {
                exp_gain = Math.ceil(1 / lvl_diff * 10);
            }
            else {
                exp_gain = Math.ceil(lvl_diff * 5 + 5);
            }
            return exp_gain;
        }

        var exp_gain = winning_exp(winner_higher, lvl_diff);

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
                    return 'Congratulations! ' + this.user_name + ' has gained ' + this.total_lvls + ' levels!\n' + this.user_name + ' is now at level ' + this.user_lvl + ' !' + '\nYou have gained 5 sp with each level up!';
                }
                return '';
            }
            new_exp() {
                return this.current_exp;
            }
            new_lvl() {
                return this.user_lvl;
            }
            new_sp(){
                var add_sp = 0;
                if(this.total_lvls > 0){
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
        message.channel.send(update_winner.level_up());
    }
}

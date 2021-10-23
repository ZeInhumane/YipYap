module.exports = {
    async execute(message, winner, loser, experienceMultiplier) {
        // const Discord = require('../discord.js');
        const User = require('../../models/user');
        const userEffects = require('../../models/userEffects.js')
        // level diff to calculate exp multiplier
        const is_lvlup = require('./is_lvlup')
        let lvl_diff = winner.level - loser.level;
        let winner_higher = true;
        if (lvl_diff <= 0) {
            winner_higher = false;
            lvl_diff *= -1;
        }

        let exp_gain;
        let expMulti = 1;
        let user_level = winner.level

        if (winner_higher) {
            exp_gain = Math.ceil((lvl_diff * -0.8 + user_level * 0.5) * experienceMultiplier);
            if (exp_gain <= 0) {
                exp_gain = 1;
            }
        }
        else {
            if (lvl_diff == 0) {
                exp_gain = Math.ceil((user_level * 0.5) * experienceMultiplier)
            }
            else {
                exp_gain = Math.ceil((lvl_diff * 4 + user_level * 0.5) * experienceMultiplier);
            }
        }
        let effects = await userEffects.findOne({ userID: winner.userID }).exec()
        if (effects != null) {
            let expTicketName = Object.keys(effects.tickets).filter(key => key.includes('Experience'))
            if (expTicketName.length != 0) {
                expMulti = effects.tickets[expTicketName[0]].multiplier
            }
        }

        // adding exp
        let winner_exp = winner.exp + exp_gain * expMulti;

        // message gain exp
        let embedText = `${winner.player.name} has gained ${exp_gain} exp!`;

        // updating level, current exp and sp to database
        let update_winner = new is_lvlup(winner_exp, winner.level, winner.player.name);
        User.findOne({ userID: winner.userID }, (err, user) => {
            user.exp = update_winner.new_exp();
            user.level = update_winner.new_lvl();
            user.sp += update_winner.new_sp();
            user.save()
                .then(result => console.log("lvl edit"))
                .catch(err => console.error(err));
        });

        // congratulate those who level up
        if (update_winner.level_up()) {
            embedText += `\n${update_winner.level_up()}`;
            if (update_winner.new_lvl() % 10 == 0) {
                embedText += `\n**Congratulations on reaching level ${update_winner.new_lvl()}, you can now move to the next floor using the floor command!**`
            }
        }
        return embedText;
    }
}

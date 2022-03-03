// const Discord = require('../discord.js');
const User = require('../../models/user');
const Clan = require('../../models/clan');
const userEffects = require('../../models/userEffects.js');
// level diff to calculate exp multiplier
const is_lvlup = require('./is_lvlup');
const clanExp = require('./clanLvlup');

module.exports = {
    async execute(message, winner, loser, experienceMultiplier) {
        let lvl_diff = winner.level - loser.level;
        let winner_higher = true;
        if (lvl_diff <= 0) {
            winner_higher = false;
            lvl_diff *= -1;
        }

        let exp_gain;
        let expMulti = 1;
        const user_level = winner.level;

        if (winner_higher) {
            exp_gain = Math.ceil((lvl_diff * -0.8 + user_level * 0.5) * experienceMultiplier);
            if (exp_gain <= 0) {
                exp_gain = 1;
            }
        } else if (lvl_diff == 0) {
            exp_gain = Math.ceil((user_level * 0.5) * experienceMultiplier);
        } else {
            exp_gain = Math.ceil((lvl_diff * 4 + user_level * 0.5) * experienceMultiplier);
        }
        const effects = await userEffects.findOne({ userID: winner.userID }).exec();
        if (effects != null) {
            const expTicketName = Object.keys(effects.tickets).filter(key => key.includes('Experience'));
            if (expTicketName.length != 0) {
                expMulti = effects.tickets[expTicketName[0]].multiplier;
            }
        }

        // adding exp
        const winner_exp = winner.exp + exp_gain * expMulti;

        // message gain exp
        let embedText = `${winner.player.name} has gained ${exp_gain} exp!`;

        // Updating level for users
        const updateWinner = new is_lvlup(winner_exp, winner.level, winner.player.name);

        // Clan levels up based on users
        const updateClan = new clanExp(winner.player.clanID, exp_gain);

        // Update user with new experience
        await User.findOne({ userID: winner.userID }, (err, user) => {
            user.exp = updateWinner.new_exp();
            user.level = updateWinner.new_lvl();
            user.sp += updateWinner.new_sp();
            user.save()
                .then(result => console.log("lvl edit", result))
                .catch(err => console.error(err));
        });
        // Checks if player has a clan
        if (winner.player.clanID) {
            await Clan.findOne({ clanID: winner.player.clanID }, (err, clan) => {
                // Update clan with new experience
                clan.clanCurrentExp = updateClan.getCurrentExp();
                clan.clanLevel = updateClan.getClanLevel();
                clan.sp += updateClan.getClanSP();
                clan.clanMaxMembers += updateClan.getMaxMembers();
                // Checks if contribution list includes the user
                if (`${winner.userID}` in clan.contribution){
                    clan.contribition.winner.userID += exp_gain;
                } else {
                    clan.contribution[winner.userID] = {
                        userID: winner.userID,
                        exp: exp_gain,
                    };
                }
                clan.clanTotalEXP += exp_gain;
                clan.save()
                    .then(result => console.log("lvl edit", result))
                    .catch(err => console.error(err));
            });
        }
        // congratulate those who level up
        if (updateWinner.level_up()) {
            embedText += `\n${updateWinner.level_up()}`;
            if (updateWinner.new_lvl() % 10 == 0) {
                embedText += `\n**Congratulations on reaching level ${updateWinner.new_lvl()}, you can now move to the next floor using the floor command!**`;
            }
        }
        return embedText;
    },
};

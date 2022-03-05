// const Discord = require('../discord.js');
const User = require('../../models/user');
const Clan = require('../../models/clan');
const userEffects = require('../../models/userEffects.js');
// level diff to calculate exp multiplier
const is_lvlup = require('./is_lvlup');
const clanExp = require('./clanLvlup');

module.exports = {
    async execute(message, winner, loser, experienceMultiplier) {
        let levelDifference = winner.level - loser.level;
        let winner_higher = true;
        if (levelDifference <= 0) {
            winner_higher = false;
            levelDifference *= -1;
        }

        let expGain;
        let expMulti = 1;
        const userLevel = winner.level;

        if (winner_higher) {
            expGain = Math.ceil((levelDifference * -0.8 + userLevel * 0.5) * experienceMultiplier);
            if (expGain <= 0) {
                expGain = 1;
            }
        } else if (levelDifference == 0) {
            expGain = Math.ceil((userLevel * 0.5) * experienceMultiplier);
        } else {
            expGain = Math.ceil((levelDifference * 4 + userLevel * 0.5) * experienceMultiplier);
        }
        const effects = await userEffects.findOne({ userID: winner.userID }).exec();
        if (effects != null) {
            const expTicketName = Object.keys(effects.tickets).filter(key => key.includes('Experience'));
            if (expTicketName.length != 0) {
                expMulti = effects.tickets[expTicketName[0]].multiplier;
            }
        }

        // Checks if player has a clan and add the exp to the clan, if they do not have a clan, it will not do anything
        if (winner.clanID) {
            await Clan.findOne({ clanID: winner.clanID }, (err, clan) => {
                expGain = Math.floor(expGain * ((100 + clan.stats.exp) / 100));
                const winnerExp = winner.exp + expGain * expMulti;
                // Clan levels up based on users
                const updateClan = new clanExp(winnerExp, clan.clanLevel);
                // Update clan with new experience
                clan.clanCurrentExp = updateClan.getCurrentExp();
                clan.clanLevel = updateClan.getClanLevel();
                clan.sp += updateClan.getClanSP();
                clan.clanMaxMembers += updateClan.getMaxMembers();
                // Checks if contribution list includes the user
                if (clan.contribution[winner.userID]) {
                    clan.contribution[winner.userID].exp += expGain;
                } else {
                    clan.contribution[winner.userID] = {
                        "exp": expGain,
                    };
                }
                clan.clanTotalExp += expGain;
                clan.markModified('contribution');
                clan.save()
                    .then(() => console.log("clan lvl edit"))
                    .catch(err => console.error(err));
            });
        }
        // adding exp
        const winnerExp = winner.exp + expGain * expMulti;

        // message gain exp
        let embedText = `${winner.player.name} has gained ${expGain} exp!`;

        // Updating level for users
        const updateWinner = new is_lvlup(winnerExp, winner.level, winner.player.name);

        // Update user with new experience
        await User.findOne({ userID: winner.userID }, (err, user) => {
            user.exp = updateWinner.new_exp();
            user.level = updateWinner.new_lvl();
            user.sp += updateWinner.new_sp();
            user.save()
                .then(() => console.log("lvl edit"))
                .catch(err => console.error(err));
        });

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

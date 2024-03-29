const User = require("../../models/user");
const Clan = require("../../models/clan");
const userEffects = require("../../models/userEffects.js");
// level diff to calculate exp multiplier
const is_lvlup = require("./is_lvlup");
const clanLvlUp = require("./clanLvlUp");

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
            expGain = Math.ceil(
                (levelDifference * -0.8 + userLevel * 0.5) *
                    experienceMultiplier,
            );
            if (expGain <= 0) {
                expGain = 1;
            }
        } else if (levelDifference == 0) {
            expGain = Math.ceil(userLevel * 0.5 * experienceMultiplier);
        } else {
            expGain = Math.ceil(
                (levelDifference * 4 + userLevel * 0.5) * experienceMultiplier,
            );
        }
        const effects = await userEffects
            .findOne({ userID: winner.userID })
            .exec();
        if (effects != null) {
            const expTicketName = Object.keys(effects.tickets).filter((key) =>
                key.includes("Experience"),
            );
            if (expTicketName.length != 0) {
                expMulti = effects.tickets[expTicketName[0]].multiplier;
            }
        }

        // Checks if player has a clan and add the exp to the clan, if they do not have a clan, it will not do anything
        if (winner.clanID) {
            await Clan.findOne({ clanID: winner.clanID }, (err, clan) => {
                if (clan) {
                    expGain = Math.floor(
                        expGain * ((100 + clan.stats.exp) / 100),
                    );
                    console.log(expGain);
                    const winnerExp = clan.clanCurrentExp + expGain * expMulti;
                    // Clan levels up based on users
                    const updateClan = new clanLvlUp(winnerExp, clan.clanLevel);
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
                            exp: expGain,
                        };
                    }
                    clan.clanTotalExp += expGain;
                    clan.markModified("contribution");
                    clan.save()
                        .then(() => console.log("clan lvl edit"))
                        .catch((err) => console.error(err));
                }
            });
        }
        // adding exp
        const winnerExp = winner.exp + expGain * expMulti;

        // message gain exp
        const embedText = `**+${expGain} EXP** 📈`;

        // Updating level for users
        const updateWinner = new is_lvlup(
            winnerExp,
            winner.level,
            winner.player.name,
        );

        // Update user with new experience
        const originalLevel = winner.level;
        await User.findOne({ userID: winner.userID }, (err, user) => {
            user.exp = updateWinner.new_exp();
            user.level = updateWinner.new_lvl();
            user.sp += updateWinner.new_sp();
            user.save()
                .then(result => console.log(`Edited level for ${result._doc.userID}`))
                .catch((err) => console.error(err));
        });

        // congratulate those who level up
        let nextFloor = false;
        const newLevel = updateWinner.new_lvl();
        let levelUpText;
        if (updateWinner.level_up()) {
            levelUpText = `**Levelled up!**\nLevel: ${originalLevel} → ${updateWinner.new_lvl()}`;
            if (updateWinner.new_lvl() % 10 == 0) {
                nextFloor = true;
            }
        }
        return { embedText, nextFloor, newLevel, levelUpText };
    },
};

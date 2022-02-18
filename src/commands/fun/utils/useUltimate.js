const ultimateBase = require('../interface/ultimateBase');

module.exports = async function (player, enemy, user) {
    // If out of range or user has no rune, default to rune 3 (lifesteal)
    if (!user.rune || user.rune > ultimateBase.ultimates.length) { user.rune = 3; }

    const ultimate = new ultimateBase.ultimates[user.rune](player, enemy, user);
    const results = ultimate.ultimate(player, enemy, user);
    const message = ultimate.displayMessage(player, results[0], results[1]);

    return message;
};
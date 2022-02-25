const ultimateBase = require('../interface/ultimateBase');

module.exports = async function (player, enemy, user, originalStats) {

    // If out of range or user has no rune, default to rune 1
    if (!user.rune || user.rune > ultimateBase.ultimates.length) { user.rune = 1; }

    // Create new ultimate class
    const ultimate = new ultimateBase.ultimates[user.rune](player, enemy, user, originalStats);

    // Get results
    const results = ultimate.ultimate(player, enemy, user, originalStats);

    // Display message
    const message = ultimate.displayMessage(player, results[0], results[1], results[2]);

    return message;
};
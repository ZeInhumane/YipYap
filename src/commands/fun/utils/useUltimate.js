const ultimateBase = require('../interface/ultimateBase');

module.exports = async function (player, enemy, user) {

    // If out of range or user has no rune, default to rune 1
    if (!user.rune || user.rune > ultimateBase.ultimates.length) { user.rune = 1; }

    // Create new ultimate class
    const ultimate = new ultimateBase.ultimates[user.rune](player, enemy, user);

    // Get results
    try {
        const results = ultimate.ultimate(player, enemy, user);

        // Display message

        const message = ultimate.displayMessage(player, results[0], results[1], results[2]);

        console.log(message, 'ok');
        return message;
    } catch (err) {
        console.error(err, 'error');
        return;
    }
};
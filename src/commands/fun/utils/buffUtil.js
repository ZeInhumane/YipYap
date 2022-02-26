const buffInterface = require('../interface/buffInterface');

module.exports = async function (player, enemy, buffID) {

    // If no buff, noting
    if (player.buffs) { return; }

    // Create new ultimate class
    const ultimate = new buffInterface.ultimates[buffID](player, enemy);

    // Get results
    const results = ultimate.ultimate(player, enemy);

    // Display message
    const message = ultimate.displayMessage(player, results[0], results[1], results[2]);

    return message;
};
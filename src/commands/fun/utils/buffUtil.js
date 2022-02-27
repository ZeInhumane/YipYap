const buffInterface = require('../interface/buffInterface');

module.exports = async function (player, enemy, buffID) {
    console.log("it is entering the buff interface");
    console.log("player" + player);
    console.log(player.buffs);
    console.log(player.buffs);
    console.log("buffID: " + buffID);
    // Create new ultimate class
    const buff = new buffInterface.buffs[buffID](player, enemy, buffID);

    // Get results
    const results = buff.buff(player, enemy);

    // Display message
    const message = buff.displayMessage(player, results[0], results[1], results[2]);
    return message;
};
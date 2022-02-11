const lifesteal = require('./lifesteal.js');
module.exports = async function (player, enemy, user) {
    console.log("it enters use ultimate function")
    let newlifesteal = new lifesteal(player, enemy, user);
    let results = newlifesteal.lifesteal(player, enemy, user);
    let message = newlifesteal.displayMessage(player, results[0], results[1]);

    return message;

}
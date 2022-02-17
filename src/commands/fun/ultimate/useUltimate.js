const lifesteal = require('./lifesteal.js');
const bigbang = require('./bigbang.js');
const buffup = require('./buffup.js');
module.exports = async function (player, enemy, user) {
    let message;
    console.log(user.rune);
    // if (user.rune) { user.rune = 1; }

    switch (user.rune) {
        case 1: {
            // Big Bang
            console.log('Big Bang');
            const newbigbang = new bigbang(player, enemy, user);
            const results = newbigbang.bigbang(player, enemy, user);
            message = newbigbang.displayMessage(player, results[0], results[1]);
            break;
        }
        case 2: {
            // Buff up
            console.log('Buff up');
            const newbuffup = new buffup(player, enemy, user);
            const results = newbuffup.buffup(player, enemy, user);
            message = newbuffup.displayMessage(player, results[0], results[1]);
            break;
        }
        case 3: {
            // Placeholder
            const newlifesteal = new buffup(player, enemy, user);
            const results = newlifesteal.buffup(player, enemy, user);
            message = newlifesteal.displayMessage(player, results[0], results[1]);
            break;
        }
        case 4: {
            // Life Steal
            const newlifesteal = new lifesteal(player, enemy, user);
            const results = newlifesteal.lifesteal(player, enemy, user);
            message = newlifesteal.displayMessage(player, results[0], results[1]);
            break;
        }
        default: {
            console.log(`out of range`);
            const newlifesteal = new lifesteal(player, enemy, user);
            const results = newlifesteal.lifesteal(player, enemy, user);
            message = newlifesteal.displayMessage(player, results[0], results[1]);
        }
    }
    console.log(message);
    return message;
};
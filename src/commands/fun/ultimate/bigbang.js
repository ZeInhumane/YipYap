const ultimateBase = require('./ultimateBase');
module.exports = class bigbang extends ultimateBase {
    constructor(player, enemy, user) {
        super(player, enemy, user);
    }

    displayMessage(player, damageTaken, additionalDamage) {
        return player.name + '\'s turn!\n' + player.name + ' uses their **ULTIMATE** and does ' +
            +damageTaken + ' damage but **BIG BANG** amplifies the damage to ' + additionalDamage + ' damage!';
    }

    bigbang(player, enemy) {
        const damage = player.attack;
        let attMulti = damage / enemy.defense;
        if (attMulti < 0.4) {
            attMulti = 0.4;
        } else if (attMulti > 1.5) {
            attMulti = 1.5;
        }

        let damageTaken = Math.floor((damage + Math.floor((damage - enemy.defense) / 4)) * attMulti);
        if (damageTaken < 1) { damageTaken = 1; }
        // change in accordance to user stats
        const additionalDamage = Math.floor(damageTaken * 1.5);
        enemy.hp -= additionalDamage;
        return [damageTaken, additionalDamage];
    }
};
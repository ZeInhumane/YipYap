const ultimateBase = require('./ultimateBase');
module.exports = class lifesteal extends ultimateBase {
    constructor(player, enemy, user) {
        super(player, enemy, user);
    }

    displayMessage(player, damageTaken, calculateLifesteal) {
        return player.name + '\'s turn!\n' + player.name + ' uses their **ULTIMATE** and does ' +
            +damageTaken + ' **Damage** with lifesteal while **Healing** for ' + calculateLifesteal + ' **Health**!';
    }

    lifesteal(player, enemy) {
        const damage = player.attack;
        let attMulti = damage / enemy.defense;
        if (attMulti < 0.4) {
            attMulti = 0.4;
        } else if (attMulti > 1.5) {
            attMulti = 1.5;
        }

        let damageTaken = Math.floor((damage + Math.floor((damage - enemy.defense) / 4)) * attMulti);
        if (damageTaken < 1) { damageTaken = 1; }
        enemy.hp -= damageTaken;
        // change in accordance to user stats
        const calculateLifesteal = Math.floor(damageTaken / 2);
        player.hp += calculateLifesteal;
        return [damageTaken, calculateLifesteal];
    }
};
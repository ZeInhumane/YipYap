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
        const damageTaken = super.calculateDamage(player, enemy);
        enemy.hp -= damageTaken;
        // change in accordance to user stats
        const calculateLifesteal = Math.floor(damageTaken / 2);
        player.hp += calculateLifesteal;
        return [damageTaken, calculateLifesteal];
    }
};
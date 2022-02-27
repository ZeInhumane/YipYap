const ultimateBase = require('../interface/ultimateBase');
module.exports = class bigbang extends ultimateBase {
    constructor(player, enemy, user) {
        super(player, enemy, user);

        this.name = 'Big Bang';
        this.id = 1;
    }

    displayMessage(player, damageTaken, additionalDamage) {
        return `${player.name}'s turn!\n ${player.name} uses their **ULTIMATE** and does ${damageTaken}
        but **BIG BANG** amplifies the damage to ${additionalDamage} additional damage!`;
    }

    ultimate(player, enemy) {
        const damageTaken = super.calculateDamage(player, enemy);
        // change in accordance to user stats
        const additionalDamage = Math.floor(damageTaken * 1.5);
        enemy.hp -= additionalDamage;
        return [damageTaken, additionalDamage];
    }
};
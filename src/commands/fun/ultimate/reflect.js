const ultimateBase = require('../interface/ultimateBase');
module.exports = class reflect extends ultimateBase {
    constructor(player, enemy, user) {
        super(player, enemy, user);

        this.name = 'Reflect';
        this.id = 5;
    }

    displayMessage(player, reflectedAttack, damageTaken, reflectedAttackTaken) {
        return `${player.name}'\'s turn!\n ${player.name} uses their **ULTIMATE** to **Reflect** to reflect
            ${reflectedAttack} **Attack** to their oppponent and instead of taking ${damageTaken} damage, they take ${reflectedAttackTaken} damage!`;
    }

    ultimate(player, enemy) {
        // Reflects 75% of the enemy's attack, swaps the stats to retrieve the reflected attack
        const damageTaken = super.calculateDamage(enemy, player);
        const reflectedAttack = Math.floor(damageTaken * 0.75);
        const reflectedAttackTaken = Math.floor(damageTaken * 0.25);
        enemy.hp -= reflectedAttack;
        player.hp += damageTaken;
        player.hp -= reflectedAttackTaken;
        return [reflectedAttack, damageTaken, reflectedAttackTaken];
    }
};
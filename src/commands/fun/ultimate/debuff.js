const ultimateBase = require('../interface/ultimateBase');
module.exports = class debuff extends ultimateBase {
    constructor(player, enemy, user) {
        super(player, enemy, user);

        this.name = 'Debuff';
        this.id = 3;
    }

    displayMessage(player, deBuffedAttack, deBuffedSpeed) {
        return player.name + '\'s turn!\n' + player.name + ` uses their **ULTIMATE** to **Debuff** the Opponent and decreases their Enemy's Attack by 25% to ` +
            +deBuffedAttack + ' **Attack** And ' + deBuffedSpeed + ' **Speed**!';
    }

    ultimate(player, enemy) {
        const deBuffedAttack = Math.ceil(enemy.attack * 0.75);
        const deBuffedSpeed = Math.ceil(enemy.speed * 0.75);
        enemy.attack = deBuffedAttack;
        enemy.speed = deBuffedSpeed;
        return [deBuffedAttack, deBuffedSpeed];
    }
};
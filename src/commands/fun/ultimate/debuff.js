const ultimateBase = require('../interface/ultimateBase');
module.exports = class debuff extends ultimateBase {
    constructor(player, enemy, user) {
        super(player, enemy, user);

        this.name = 'Debuff';
        this.id = 3;
    }

    displayMessage(player, deBuffedAttack, deBuffedSpeed) {
        return player.name + '\'s turn!\n' + player.name + ` uses their **ULTIMATE** and decreases their Enemy's Attack by 50% to ` +
            +deBuffedAttack + ' **Attack** And ' + deBuffedSpeed + ' **Speed**!';
    }

    ultimate(enemy) {
        const deBuffedAttack = Math.floor(enemy.attack * 0.5);
        const deBuffedSpeed = Math.floor(enemy.speed * 0.5);
        enemy.attack = deBuffedAttack;
        enemy.speed = deBuffedSpeed;
        return [deBuffedAttack, deBuffedSpeed];
    }
};
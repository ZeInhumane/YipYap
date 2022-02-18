const ultimateBase = require('../interface/ultimateBase');
module.exports = class buffup extends ultimateBase {
    constructor(player, enemy, user) {
        super(player, enemy, user);

        this.name = 'Buff Up';
        this.id = 2;
    }

    displayMessage(player, buffedAttack, buffedSpeed) {
        return player.name + '\'s turn!\n' + player.name + ' uses their **ULTIMATE** and increases their Attack and Speed by 50% to ' +
            +buffedAttack + ' **Attack** And ' + buffedSpeed + ' **Speed**!';
    }

    ultimate(player) {
        const buffedAttack = Math.floor(player.attack * 1.5);
        const buffedSpeed = Math.floor(player.speed * 1.5);
        player.attack = buffedAttack;
        player.speed = buffedSpeed;
        return [buffedAttack, buffedSpeed];
    }
};
const ultimateBase = require('./ultimateBase');
module.exports = class buffup extends ultimateBase {
    constructor(player, enemy, user) {
        super(player, enemy, user);
    }

    displayMessage(player, buffedAttack, buffedSpeed) {
        return player.name + '\'s turn!\n' + player.name + ' uses their **ULTIMATE** and increases their Attack and Speed by 50% to ' +
            +buffedAttack + ' **Attack** And ' + buffedSpeed + ' **Speed**!';
    }

    buffup(player) {
        const buffedAttack = Math.floor(player.attack * 1.5);
        const buffedSpeed = Math.floor(player.speed * 1.5);
        player.attack = buffedAttack;
        player.speed = buffedSpeed;
        return [buffedAttack, buffedSpeed];
    }
};
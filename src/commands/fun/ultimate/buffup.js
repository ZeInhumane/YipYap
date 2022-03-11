const ultimateInterface = require('../interface/ultimateInterface');
module.exports = class buffup extends ultimateInterface {
    constructor(player, enemy, user) {
        super(player, enemy, user);

        this.name = 'Buff Up';
        this.id = 2;
    }

    displayMessage(player, buffedAttack, buffedSpeed) {
        return `${player.name}'s turn!\n ${player.name} uses their **ULTIMATE** to **Buff Up** their **Attack** and **Speed** by 
        ${buffedAttack} and ${buffedSpeed}!`;
    }

    ultimate(player) {
        const buffedAttack = Math.floor(player.attack * 1.5);
        const buffedSpeed = Math.floor(player.speed * 1.5);
        player.attack = buffedAttack;
        player.speed = buffedSpeed;
        return [buffedAttack, buffedSpeed];
    }
};
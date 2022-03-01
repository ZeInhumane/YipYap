const ultimateBase = require('../interface/ultimateBase');
module.exports = class healing extends ultimateBase {
    constructor(player, enemy, user, originalStats) {
        super(player, enemy, user, originalStats);

        this.name = 'Healing';
        this.id = 6;
    }

    displayMessage(player, originalHP, healingDone) {
        return `${player.name}'s turn!\n ${player.name} uses their **ULTIMATE** 
        and heals for ${healingDone} **Health** bringing their total health to ${originalHP + healingDone}!`;
    }

    ultimate(player) {
        const healingDone = Math.floor(player.hpMax * 0.25);

        if (player.hp + healingDone >= player.hpMax) {
            player.hp = player.hpMax;
        } else {
            player.hp += healingDone;
        }
        return [player.hpMax, healingDone];
    }
};
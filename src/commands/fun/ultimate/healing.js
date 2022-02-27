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
        const healingDone = Math.floor(player.originalStats.hp * 0.25);

        if (player.hp + healingDone >= player.originalStats.hp) {
            player.hp = player.originalStats.hp;
        } else {
            player.hp += healingDone;
        }
        return [player.originalStats.hp, healingDone];
    }
};
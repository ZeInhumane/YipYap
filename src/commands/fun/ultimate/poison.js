// call buff interface
const buffInterface = require('../interface/buffInterface');
const ultimateBase = require('../interface/ultimateBase');
module.exports = class lifesteal extends ultimateBase {
    constructor(player, enemy, user) {
        super(player, enemy, user);

        this.name = 'Poison';
        this.id = 7;
    }

    displayMessage(player, poisonDuration) {
        return `${player.name}'s turn!\n ${player.name} uses their **ULTIMATE** and poisons their enemy for
        ${poisonDuration}.`;

    }

    ultimate(player, enemy) {
        // Sets poison duration
        const poisonDuration = 3;
        // Create new poison class and bind to player
        const newBuff = new buffInterface.buffs[1](player, enemy);
        // Binds duration of 3 rounds
        newBuff.bind(player, poisonDuration);
        return [poisonDuration];
    }
};
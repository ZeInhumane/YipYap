const BuffInterface = require('../BuffInterface.js');

module.exports = class Poison extends BuffInterface {

    init() {
        this.id = 1;
        this.name = "Poison";
        this.debuff = true;
        this.emoji = "";
        this.statDesc = "poison your enemies for a painful death";
    }

    // Override
    bind(player, duration) {
        for (const i in player.buffs) {
            if (player.buffs[i].id == this.id) {
                player.buffs[i].duration += duration;
                return;
            }
        }

        super.bind(player, duration);
    }

    postTurn(animal) {
        if (!this.from) return;
        if (animal.stats.hp[0] <= 0) return;

        super.postTurn(animal);
    }

};
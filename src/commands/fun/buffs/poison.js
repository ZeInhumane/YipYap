const BuffInterface = require('../interface/buffInterface.js');

module.exports = class Poison extends BuffInterface {

    init() {
        this.id = 1;
        this.name = "Poison";
        this.debuff = true;
        this.emoji = "";
        this.statDesc = "poison your enemies for a painful death";
    }

    displayMessage(player, poisonDamage, duration) {
        return `Your enemy is **poisoned**! They took ${poisonDamage} in **DAMAGE** and the **poison** 
        will wear off after ${duration} more round(s)!\n`;
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

    buff(player, enemy) {
        // Sets poison damage to 20% of enemy's max hp
        const poisonDamage = Math.floor(enemy.hp * 0.20);
        enemy.hp -= (poisonDamage);

        const duration = super.postTurn(player, this.id);
        return [poisonDamage, duration];
    }

};
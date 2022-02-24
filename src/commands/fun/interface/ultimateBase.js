const requireDir = require('require-dir');

module.exports = class ultimate {
    constructor(player, enemy, user) {
        this.player = player;
        this.enemy = enemy;
        this.user = user;
    }

    displayMessage() {
        return "";
    }

    calculateDamage(attacker, defender) {
        const damage = attacker.attack;
        let attMulti = damage / defender.defense;
        if (attMulti < 0.4) {
            attMulti = 0.4;
        } else if (attMulti > 1.5) {
            attMulti = 1.5;
        }
        let damageTaken = Math.floor((damage + Math.floor((damage - defender.defense) / 4)) * attMulti);
        if (damageTaken < 1) { damageTaken = 1; }
        return damageTaken;
    }

    alterStats() {
        return;
    }

    static get getID() { return new this(null, null, null).id; }
    static get getName() { return new this(null, null, null).name; }
    static get ultimates() { return ultimates; }
    static get ultimateDir() { return ultimateDir; }
};
// Requires all files in the directory
const ultimateDir = requireDir('./../ultimate');
const ultimates = {};
// Key retrieves the file in said directory
for (const key in ultimateDir) {
    const ultimate = ultimateDir[key];
    ultimates[ultimate.getID] = ultimate;
}
module.exports = class ultimate {
    constructor() {
    }

    displayMessage() {
        return "";
    }

    calculateDamage(player, enemy) {
        const damage = player.attack;
        let attMulti = damage / enemy.defense;
        if (attMulti < 0.4) {
            attMulti = 0.4;
        } else if (attMulti > 1.5) {
            attMulti = 1.5;
        }
        let damageTaken = Math.floor((damage + Math.floor((damage - enemy.defense) / 4)) * attMulti);
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
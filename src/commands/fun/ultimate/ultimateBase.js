module.exports = class ultimate {
    constructor(player, enemy, user) {
        this.player = player;
        this.enemy = enemy;
        this.user = user;
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
};

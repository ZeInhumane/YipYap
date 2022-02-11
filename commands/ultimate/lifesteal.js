const ultimateBase = require('./ultimateBase');
module.exports = class lifesteal extends ultimateBase {
    constructor(player, enemy, user) {
        super(player, enemy, user);
    }

    displayMessage(player, damageTaken, calculateLifesteal) {
        console.log("player")
        console.log(player)
        return player.name + '\'s turn!\n' + player.name + ' does ' +
            + damageTaken + ' damage with their life steal ultimate while healing for ' + calculateLifesteal + ' health!';
    }

    lifesteal(player, enemy, user) {
        let damage = player.attack;
        let attMulti = damage / enemy.defense;
        if (attMulti < 0.4) {
            attMulti = 0.4;
        }
        else if (attMulti > 1.5) {
            attMulti = 1.5;
        }

        let damageTaken = Math.floor((damage + Math.floor((damage - enemy.defense) / 4)) * attMulti);
        enemy.hp -= damageTaken;
        // change in accordance to user stats
        let calculateLifesteal = Math.floor(damageTaken/2);
        player.hp += calculateLifesteal;
        return [damageTaken, calculateLifesteal];
    }

}
const ultimateBase = require('./ultimateBase');
module.exports = class lifesteal extends ultimateBase {
    constructor(player, enemy, user) {
        super(player, enemy, user);
    }

    displayMessage() {
        console.log(this.player)
        return "";
    }

    lifesteal(user) {
        
        console.log("hiiiiii")
    }

}
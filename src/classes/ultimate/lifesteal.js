const ultimateBase = require('./ultimateBase.js');
module.exports = class lifesteal extends ultimateBase {
    constructor(player, enemy, user) {
        super(player, enemy, user);
    }

    displayMessage() {
        console.log(this.player);
        return "";
    }

    lifesteal() {

        console.log("hiiiiii");
    }

};
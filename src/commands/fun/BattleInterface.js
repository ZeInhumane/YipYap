const Discord = require('discord.js');

module.exports = class BattleInterface {

    /* Constructor */
    constructor() {
        this.init();
    }

    static get getID() { return new this().id; }
    static get getlevelRequired() { return new this().levelRequired; }
    static get getName() { return new this().name; }
    static get getDesc() { return new this().desc; }
};

const requireDir = require('require-dir');

module.exports = class BuffInterface {
    constructor(player, enemy, user) {

        this.init();
        this.player = player;
        this.enemy = enemy;
        this.user = user;
    }

    displayMessage() {
        return "";
    }

    /* Bind this buff to a user */
    bind(user, duration) {
        if (duration) this.duration = duration;
        user.buffs.push(this);
        this.justCreated = true;
    }

    /* End of turn. Descrease duration by one */
    postTurn(animal) {
        this.duration -= 1;
        if (this.duration <= 0) {
            for (let i = 0; i < animal.buffs.length; i++) {
                if (animal.buffs[i].id == this.id) {
                    animal.buffs[i].markedForDeath = true;
                }
            }
        }
        if (this.justCreated) this.justCreated = false;
    }

    alterStats() {
        return;
    }

    static get getID() { return new this(null, null, null).id; }
    static get getName() { return new this(null, null, null).name; }
    static get buffs() { return buffs; }
    static get buffDir() { return buffDir; }
};

const buffDir = requireDir('./../buffs');
const buffs = {};
for (const key in buffDir) {
    const buff = buffDir[key];
    buffs[buff.getID] = buff;
}
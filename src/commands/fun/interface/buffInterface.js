const requireDir = require('require-dir');

module.exports = class BuffInterface {
    constructor(player, enemy, buffID) {

        this.init();
        this.player = player;
        this.enemy = enemy;
        this.buffID = buffID;
    }

    displayMessage() {
        return "";
    }

    /* Bind this buff to a user */
    bind(player, duration) {
        if (duration) this.duration = duration;
        // Push buffs
        player.buffs.push({ id: this.id, duration: duration });
    }

    /* End of turn. Descrease duration by one */
    postTurn(player, id) {
        let duration;
        // Decreases duration, if duration is 0, remove buff
        player.buffs.find((o, i) => {
            if (o.id === id) {
                duration = o.duration - 1;
                player.buffs[i] = { id: id, duration: duration };
                if (duration <= 0) {
                    player.buffs.splice(i, 1);
                }
                return true;
            }
        });
        return duration;
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
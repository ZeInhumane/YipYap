const requireDir = require('require-dir');

module.exports = class AreaInterface {

    /* Constructor */
    constructor(noCreate) {
        this.init();

        if (noCreate) {
            return;
        }
    }

    getRandomEnemy(floor) {
        return makeNewEnemy(floor);
    }

    getFloor(floor) {
        return this.floors[floor];
    }

    selectFloor(floor) {
        this.selectedFloor = floor;
        return this.selectedFloor;
    }

    static get areas() { return areas; }
    static get getID() { return new this(true).id; }
    static get getlevelRequired() { return new this(true).levelRequired; }
    static get getName() { return new this(true).name; }
    static get getDesc() { return new this(true).desc; }
    static get getImageURL() { return new this(true).imageURL; }
    static get area() { return new this(true); }
    static get getFloors() { return new this(true).floors; }
};

const areaDir = requireDir('./areas');
const areas = {};
for (const key in areaDir) {
    const area = areaDir[key];
    areas[area.getID] = area;
}

// Creates Enemy class
class Enemy {
    constructor(name, hp, attack, defense, speed, type, lvl) {
        this.name = name;
        this.hp = hp;
        this.attack = attack;
        this.defense = defense;
        this.speed = speed;
        this.type = type;
        this.level = lvl;
    }
}

/**
 * Makes a new random enemy based on user stats and location info
 * @param {User} user
 * @param {*} locationInfo
 * @returns {Enemy}
 */
function makeNewEnemy(floor) {
    // Create enemy level based on user level
    let enemyLvl = Math.floor(Math.random() * 11) - 5 + floor.requirement;
    if (enemyLvl < 1) enemyLvl = 1;

    // Create enemy stats based on user stats
    const baseStat = enemyLvl / 2 < 1 ? Math.floor(enemyLvl / 2) : 1;
    const minStat = 5;

    // Enemy name
    const enemyName = floor.enemies[Math.floor(Math.random() * floor.enemies.length)];

    // Takes the buff from the db and applies it to the enemies
    const { hp: hpMulti, attack: attackMulti, defense: defenseMulti, speed: speedMulti } = floor.buffs;
    const enemyHP = Math.floor((Math.random() * (Math.exp(enemyLvl) ** (1 / 20)) + minStat * 5 + enemyLvl * 5) * hpMulti);
    const enemyAttack = Math.floor((Math.random() * enemyLvl + minStat + baseStat) * attackMulti);
    const enemyDefense = Math.floor((Math.random() * enemyLvl + minStat + baseStat) * defenseMulti);
    const enemySpeed = Math.floor((Math.random() * enemyLvl + minStat + baseStat) * speedMulti);
    const enemyType = "undead";
    const enemy = new Enemy(enemyName, enemyHP, enemyAttack, enemyDefense, enemySpeed, enemyType, enemyLvl);
    return enemy;
}


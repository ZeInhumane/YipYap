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
exports.makeNewEnemy = function (user, locationInfo) {
    // Create enemy level based on user level
    let enemyLvl = Math.floor(Math.random() * 11) - 5 + user.level;
    if (enemyLvl < 1) enemyLvl = 1;

    // Create enemy stats based on user stats
    const baseStat = enemyLvl / 2 < 1 ? Math.floor(enemyLvl / 2) : 1;
    const minStat = 5;

    // Enemy name
    const enemyName = locationInfo.Enemy[Math.floor(Math.random() * locationInfo.Enemy.length)];

    // Takes the buff from the db and applies it to the enemies
    const { hp: hpMulti, attack: attackMulti, defense: defenseMulti, speed: speedMulti } = locationInfo.Buff;
    const enemyHP = Math.floor((Math.random() * (Math.exp(enemyLvl) ** (1 / 20)) + minStat * 5 + enemyLvl * 5) * hpMulti);
    const enemyAttack = Math.floor((Math.random() * enemyLvl + minStat + baseStat) * attackMulti);
    const enemyDefense = Math.floor((Math.random() * enemyLvl + minStat + baseStat) * defenseMulti);
    const enemySpeed = Math.floor((Math.random() * enemyLvl + minStat + baseStat) * speedMulti);
    const enemyType = "undead";
    const enemy = new Enemy(enemyName, enemyHP, enemyAttack, enemyDefense, enemySpeed, enemyType, enemyLvl);
    return enemy;
};

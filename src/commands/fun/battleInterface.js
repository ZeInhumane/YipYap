const Discord = require('discord.js');

module.exports = class BattleInterface {

    /**
     * Constructor
     * @param {User} user
     * @param {Enemy} enemy
     * @param {Discord.Message} message
     */
    constructor(user, enemy, message) {
        this.user = user;
        this.player = this.user.player;
        this.enemy = enemy;
        this.message = message;

        this.displayUltimateString = `<:Yeet:829267937784627200>${BattleInterface.emptyUltimateEmote.repeat(10)}<:Yeet2:829270362516488212>`;
        this.currentColor = '#0099ff';

        this.ultimate = 0;
        this.locationInfo;
        this.originalPlayerHP;
        this.originalEnemyHP;
        this.playerAction;

        this.playerTurnAction;
        this.enemyTurnAction;

        this.active = true;
    }

    /**
     * Method to check for damage taken by hero
     * @param {number} damage
     * @param {User} defender
     * @param {boolean} isHero
     * @returns {number}
     */
    takeDamage(damage, defender, isHero) {
        let attMulti = damage / defender.defense;
        if (attMulti < 0.4) {
            attMulti = 0.4;
        } else if (attMulti > 1.5) {
            attMulti = 1.5;
        }

        let damageTaken = Math.floor((damage + Math.floor((damage - defender.defense) / 4)) * attMulti);
        // Ensures damage taken is at least 1
        if (damageTaken < 1) {
            damageTaken = 1;
            if (isHero) {
                this.ultimate += 18;
            }
        }

        if (isHero) {
            if (playerAction == "defend") {
                // Change it later so higher level reduces damage taken too
                if (defender.defense > 99) {
                    damageTaken *= 1 / 100;
                    this.ultimate += 24;
                } else {
                    damageTaken *= (100 - defender.defense) / 100;
                    this.ultimate += 20;
                }
            } else {
                this.ultimate += 20;
            }
            // Ensures ultimate charge does not pass 100(max)
            if (this.ultimate > 100) {
                this.ultimate = 100;
            }
            this.displayUltimateString = `<:Yeet:829267937784627200>${BattleInterface.ultimateEmoteArray.slice(0, Math.floor((this.ultimate) / 10)).join("")}${BattleInterface.emptyUltimateEmote.repeat(Math.ceil((100 - this.ultimate) / 10))}<:Yeet2:829270362516488212>`;
        }
        damageTaken = Math.floor(damageTaken);
        defender.hp -= damageTaken;
        return damageTaken;
    }

    /**
     * Makes new random enemy
     * @param {User} user
     * @param {*} locationInfo
     * @returns {Enemy}
     */
    makeNewEnemy(user, locationInfo) {
        // Create enemy level based on user level, set to minimum of 1
        let enemyLvl = Math.floor(Math.random() * 11) - 5 + user.level;
        if (enemyLvl < 1) enemyLvl = 1;

        // Create enemy base stats
        const baseStat = enemyLvl / 2 < 1 ? Math.floor(enemyLvl / 2) : 1;
        const minStat = 5;

        // Takes the buff from the db and applies it to the enemies
        const { hp: hpMulti, attack: attackMulti, defense: defenseMulti, speed: speedMulti } = locationInfo.Buff;
        const enemyHP = Math.floor((Math.random() * (Math.exp(enemyLvl) ** (1 / 20)) + minStat * 5 + enemyLvl * 5) * hpMulti);
        const enemyAttack = Math.floor((Math.random() * enemyLvl + minStat + baseStat) * attackMulti);
        const enemyDefense = Math.floor((Math.random() * enemyLvl + minStat + baseStat) * defenseMulti);
        const enemySpeed = Math.floor((Math.random() * enemyLvl + minStat + baseStat) * speedMulti);
        const enemyType = "undead";
        const enemy = new Enemy(locationInfo.Enemy, enemyHP, enemyAttack, enemyDefense, enemySpeed, enemyType, enemyLvl);
        return enemy;
    }

    /**
     * Check if defender dodges attack
     * @param {(user|Enemy)} attacker
     * @param {(user|Enemy)} defender
     * @returns {boolean}
     */
    dodgeAttack(attacker, defender) {
        if (defender.speed > attacker.speed) {
            const speedDifference = defender.speed - attacker.speed;
            let rng = speedDifference / attacker.speed;
            if (rng > 0.2) {
                rng = 0.2;
            }
            const dodge = Math.random() <= rng;
            return dodge;
        }
        return false;
    }

    // Emotes
    static ultimateEmote = ":Ultimate:822042890955128872";
    static emptyUltimateEmote = "<:blank:829270386986319882>";
    static ultimateEmoteArray = ["<:1:829267948127649792>", "<:2:829267958836101130>", "<:3_:829267967392088134>", "<:4:829267977559867412>", "<:5:829271937548419093>",
        "<:6:829271966161567774>", "<:7:829271980397166612>", "<:8:829271994205208597>", "<:9:829272014946697246>", "<:10:829272027604713523>"];

    // Buttons
    static row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setCustomId('attack')
                .setLabel('⚔️')
                .setStyle('PRIMARY'),
            new Discord.MessageButton()
                .setCustomId('defend')
                .setLabel('🛡️')
                .setStyle('PRIMARY'),
            new Discord.MessageButton()
                .setCustomId('ultimate')
                .setLabel('')
                .setStyle('DANGER')
                .setEmoji(BattleInterface.ultimateEmote),
        );
};

// Creates Enemy class
class Enemy {
    /**
     * Creates an enemy
     * @param {string} name
     * @param {number} hp
     * @param {number} attack
     * @param {number} defense
     * @param {number} speed
     * @param {string} type
     * @param {number} lvl
     */
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

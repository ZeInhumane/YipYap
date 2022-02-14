const Discord = require('discord.js');
const botLevel = require('../../models/botLevel');
const User = require('../../models/user');
const win = require('../../classes/battle/win.js');
const findPrefix = require('../../functions/findPrefix');
const useUltimate = require('../../classes/ultimate/useUltimate.js');
const BattleInterface = require('./battleInterface.js');
const ticketUtil = require('./utils/ticketUtil.js');

module.exports = {
    name: "test",
    description: "Battling is the primary means of war. 'The war of war is very pog' -Sun Tzu",
    syntax: "",
    cooldown: 20,
    aliases: ['t'],
    category: "Fun",
    async execute({ message }) {
        // Find user
        const user = await User.findOne({ userID: message.author.id }, async (err, _user) => {
            // If user doesn't exist, prompt user to create new user
            if (_user == null) {
                // Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }
            return _user;
        });

        // Get experience and gold message from tickets to display
        const { expMsg, goldMsg } = await ticketUtil.ticketEffects(message.author.id, user, message);

        const locationInfo = await botLevel.findOne({ 'Location': user.location }, (err, result) => result._doc);
        const enemy = await makeNewEnemy(user, locationInfo);

        // Initialize player and stats
        const player = { name: user.player.name };

        for (const stat in user.player.baseStats) {
            player[stat] = Math.round(user.player.baseStats[stat] * (1 + user.player.additionalStats[stat].multi / 100) + user.player.additionalStats[stat].flat);
        }

        // Store original hp
        const originalPlayerHP = player.hp;
        const originalEnemyHP = enemy.hp;

        // Makes battle embed
        const battleEmbed = new Discord.MessageEmbed()
            .setColor(currentColor)
            .setTitle(user.player.name + '\'s ultimate charge: ' + ultimate + "/100")
            .setAuthor({ name: message.member.user.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription(displayUltimateString)
            .addFields(
                { name: 'Experience Ticket', value: expMsg, inline: true },
                { name: 'Gold Ticket', value: goldMsg, inline: true },
                { name: 'Player HP', value: `Lvl ${user.level} **${player.name}**'s **HP**: ${player.hp}/${originalPlayerHP}` },
                { name: 'Enemy HP', value: `Lvl ${enemy.level} **${enemy.name}**'s **HP**: ${enemy.hp}/${originalEnemyHP}` },
            )
            .setImage(locationInfo.LocationImage)
            .setFooter({ text: `${locationInfo.Description}` });

        message.channel.send({ embeds: [battleEmbed], components: [BattleInterface.row] });
    },
};

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

// Makes new random enemy
async function makeNewEnemy(user, locationInfo) {
    let enemyLvl = Math.floor(Math.random() * 11) - 5 + user.level;
    if (enemyLvl < 1) enemyLvl = 1;
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

function dodgeAttack(attacker, defender) {
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

async function playerTurn(action, player, enemy, playerTurnAction, ultimate, displayUltimateString) {
    if (action == "attack") {
        if (dodgeAttack(player, enemy)) {
            playerTurnAction = `${player.name}'s turn!\n${player.name} attacked but ${enemy.name} dodged!\n`;
        } else {
            playerTurnAction = `${player.name}'s turn!\n${player.name} does ${takeDamage(player.attack, enemy, false)} damage!\n`;
        }
    } else if (action == "defend") {
        playerTurnAction = "You shield yourself, it works";
    } else if (action == "ultimate") {
        if (ultimate == 100) {
            // set ultimate charge
            ultimate = 0;

            // Change ult button to red
            row.components[2].setStyle('DANGER');

            playerTurnAction = await useUltimate(player, enemy, user);
            displayUltimateString = `<:Yeet:829267937784627200>${emptyUltimateEmote.repeat(10)}<:Yeet2:829270362516488212>`;
        } else {
            playerTurnAction = `You only have ${ultimate} ultimate charge, you need 100 to use your ultimate.`;
        }
    } else {
        playerTurnAction = "Nothing happened";
    }

}
// Gives an Enemy (Probably add shielding here)
function enemyTurn() {
    if (dodgeAttack(enemy, player)) {
        enemyTurnAction = `${enemy.name}'s turn!\n${enemy.name} attacked but ${player.name} dodged!\n`;
    } else {
        enemyTurnAction = `${enemy.name}'s turn!\n${enemy.name} does ${takeDamage(enemy.attack, player, true)} damage!\n`;
    }
}

// Updates battle embed to display ongoing input
async function createUpdatedMessage(currentColor, user, player, ultimate, message, displayUltimateString, expMsg, goldMsg, playerTurnAction, enemyTurnAction, locationInfo, originalEnemyHP, originalPlayerHP, enemy) {
    const updatedBattleEmbed = new Discord.MessageEmbed()
        .setColor(currentColor)
        .setTitle(user.player.name + '\'s ultimate charge: ' + ultimate + "/100")
        .setAuthor({ name: message.member.user.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setDescription(displayUltimateString)
        .addFields(
            { name: 'Experience Ticket', value: expMsg, inline: true },
            { name: 'Gold Ticket', value: goldMsg, inline: true },
            { name: 'Player HP', value: `Lvl ${user.level} **${player.name}**'s **HP**: ${player.hp}/${originalPlayerHP}` },
            { name: 'Enemy HP', value: `Lvl ${enemy.level} **${enemy.name}**'s **HP**: ${enemy.hp}/${originalEnemyHP}` },
            { name: 'Turn', value: playerTurnAction },
            { name: '​', value: enemyTurnAction },
        )
        .setImage(locationInfo.LocationImage)
        .setFooter({ text: `${locationInfo.Description}` });
    return updatedBattleEmbed;
}
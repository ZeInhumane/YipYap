// Method to check for damage taken by hero
exports.takeDamage = function (damage, defender, isHero) {
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
            ultimate += 18;
        }
    }

    if (isHero) {
        if (playerAction == "defend") {
            // Change it later so higher level reduces damagetaken too
            if (defender.defense > 99) {
                damageTaken *= 1 / 100;
                ultimate += 24;
            } else {
                damageTaken *= (100 - defender.defense) / 100;
                ultimate += 20;
            }
        } else {
            ultimate += 20;
        }
        // Ensures ultimate charge does not pass 100(max)
        if (ultimate > 100) {
            ultimate = 100;
        }
        displayUltimateString = `<:Yeet:829267937784627200>${ultimateEmoteArray.slice(0, Math.floor((ultimate) / 10)).join("")}${emptyUltimateEmote.repeat(Math.ceil((100 - ultimate) / 10))}<:Yeet2:829270362516488212>`;
    }
    damageTaken = Math.floor(damageTaken);
    defender.hp -= damageTaken;
    return damageTaken;
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


exports.dodgeAttack = function (attacker, defender) {
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
};

// Updates battle embed to display ongoing input
exports.createUpdatedMessage = async function () {
    const updatedBattleEmbed = new Discord.MessageEmbed()
        .setColor(currentColor)
        .setTitle(user.player.name + '\'s ultimate charge: ' + ultimate + "/100")
        .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
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
        .setFooter(`${locationInfo.Description}`);
    return updatedBattleEmbed;
};

exports.playerTurn = async function (action) {
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

};
// Gives an Enemy (Probably add shielding here)
exports.enemyTurn = function () {
    if (dodgeAttack(enemy, player)) {
        enemyTurnAction = `${enemy.name}'s turn!\n${enemy.name} attacked but ${player.name} dodged!\n`;
    } else {
        enemyTurnAction = `${enemy.name}'s turn!\n${enemy.name} does ${takeDamage(enemy.attack, player, true)} damage!\n`;
    }
};


/**
 * Makes a new random enemy based on user stats and location info
 * @param {User} user
 * @param {*} locationInfo
 * @returns {Enemy}
 */
exports.makeNewEnemy = async function (user, locationInfo) {
    // Create enemy level based on user level
    let enemyLvl = Math.floor(Math.random() * 11) - 5 + user.level;
    if (enemyLvl < 1) enemyLvl = 1;

    // Create enemy stats based on user stats
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
};


// Battle function
exports.battle = async function (user, player, enemy, expMsg, goldMsg, botEmbedMessage) {
    const playerTurnAction = "nothing";
    let enemyTurnAction = "nothing";


    // Battle goes on when Player and Enemy is still alive
    let isExpired = false;
    // Filter so only user can interact with the buttons
    const filter = i => {
        i.deferUpdate();
        return i.user.id === message.author.id;
    };
    while (player.hp > 0 && enemy.hp > 0 && !isExpired) {
        // awaits Player reaction
        await botEmbedMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
            .then(async i => {
                currentColor = '#0099ff';
                playerAction = i.customId;

                // Checks for who has first turn
                if (player.speed > enemy.speed) {
                    playerTurn(playerAction);
                    if (enemy.hp > 0) {
                        enemyTurn();
                    } else {
                        enemyTurnAction = 'Enemy has been defeated!';
                    }
                } else {
                    enemyTurn();
                    if (player.hp > 0) playerTurn(playerAction);
                }
                if (enemy.hp < 0) {
                    enemy.hp = 0;
                    currentColor = '#FF0000';
                }
                if (player.hp < 0) {
                    player.hp = 0;
                    currentColor = '#FF0000';
                }
                if (ultimate == 100) {
                    // Change ult button to green
                    row.components[2].setStyle('SUCCESS');
                }
                botEmbedMessage.edit({ embeds: [await createUpdatedMessage(expMsg, goldMsg)], components: [row] });
            })
            .catch(async () => {
                currentColor = '#FF0000';
                botEmbedMessage.edit({ embeds: [await createUpdatedMessage(expMsg, goldMsg)], components: [] });
                message.channel.send('Battle expired. Your fatass took too long');
                isExpired = true;
            });
    }
    // Removes buttons
    botEmbedMessage.edit({ embeds: [await createUpdatedMessage(expMsg, goldMsg)], components: [] });

    if (!isExpired) {
        // Checks for who won
        if (player.hp > 0) {
            win.execute(message, user, enemy, locationInfo);
        } else {
            message.channel.send(`${player.name} has been defeated by ${enemy.name}!`);
        }
    }
};
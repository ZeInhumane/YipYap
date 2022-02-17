const Discord = require('discord.js');
const useUltimate = require('./../ultimate/useUltimate.js');

const ultimateEmote = ":Ultimate:822042890955128872";
const emptyUltimateEmote = "<:blank:829270386986319882>";
const ultimateEmoteArray = ["<:1:829267948127649792>", "<:2:829267958836101130>", "<:3_:829267967392088134>", "<:4:829267977559867412>", "<:5:829271937548419093>",
    "<:6:829271966161567774>", "<:7:829271980397166612>", "<:8:829271994205208597>", "<:9:829272014946697246>", "<:10:829272027604713523>"];
const ultimateStart = "<:Yeet:829267937784627200>";
const ultimateEnd = "<:Yeet2:829270362516488212>";

const row = new Discord.MessageActionRow()
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
            .setEmoji(ultimateEmote),
    );

module.exports = class Battle {
    /**
     * Creates a new battle between 2 players
     * @param {User} user
     * @param {Enemy} enemy
     * @param {*} locationInfo
     */
    constructor(user, enemy, locationInfo) {
        // Register user and enemy
        this.user = user;
        this.enemy = enemy;

        // Set starting embed colour
        this.currentColor = '#0099ff';

        // Set location info
        this.locationInfo = locationInfo;

        // Game states
        this.expired;
        this.round = 1;
        this.turnActions = { player: null, enemy: null };

        // Inactive
        this.playerTurnAction = `You stared at ${this.enemy.name}`;
        this.enemyTurnAction = `${this.enemy.name} stares back at you.`;

        // Retrieve player name and stats from discord user
        this.player = { name: user.player.name };
        for (const stat in user.player.baseStats) {
            this.player[stat] = Math.round(user.player.baseStats[stat] * (1 + user.player.additionalStats[stat].multi / 100) + user.player.additionalStats[stat].flat);
        }

        // Copy original hp to display in battle
        this.originalPlayerHP = this.player.hp;
        this.originalEnemyHP = this.enemy.hp;

        // Reset ultimate
        this.resetUltimate(this.enemy);
        this.resetUltimate(this.player);
    }

    /**
     * Create battle embed
     * @param {Discord.Message} message
     * @param {String} expMsg
     * @param {String} goldMsg
     * @returns {Boolean}
     */
    async initBattle(message, expMsg, goldMsg) {
        // Makes battle embed
        const battleEmbed = new Discord.MessageEmbed()
            .setColor(this.currentColor)
            .setTitle(this.player.name + '\'s ultimate charge: ' + this.player.ultimate + "/100")
            .setAuthor({ name: message.member.user.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription(this.player.ultimateString)
            .addFields(
                { name: 'Experience Ticket', value: expMsg, inline: true },
                { name: 'Gold Ticket', value: goldMsg, inline: true },
                { name: 'Player HP', value: `Lvl ${this.user.level} **${this.player.name}**'s **HP**: ${this.player.hp}/${this.originalPlayerHP}` },
                { name: 'Enemy HP', value: `Lvl ${this.enemy.level} **${this.enemy.name}**'s **HP**: ${this.enemy.hp}/${this.originalEnemyHP}` },
            )
            .setImage(this.locationInfo.LocationImage)
            .setFooter({ text: `${this.locationInfo.Description}` });

        // Create and send battle message with buttons
        const battleMessage = await message.channel.send({ embeds: [battleEmbed], components: [row] });

        // Store stuff
        this.message = message;
        this.expMsg = expMsg;
        this.goldMsg = goldMsg;
        this.battleMessage = battleMessage;

        // Create interaction filter based on command message sender
        const filter = i => {
            i.deferUpdate();
            return i.user.id === message.author.id;
        };

        // Start game loop, get results
        const playerWin = await this.gameLoop(battleMessage, filter);

        // Return to battle.js to handle results
        return playerWin;
    }

    /**
     * Starts game loop to handle turns and return winner
     * @param {Discord.Message} battleMessage
     * @param {*} filter
     * @returns {Boolean}
     */
    async gameLoop(battleMessage, filter) {
        while (this.player.hp > 0 && this.enemy.hp > 0 && !this.expired) {
            // awaits Player reaction
            await battleMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                .then(async i => {
                    const playerAction = i.customId;
                    this.turnActions.player = playerAction;

                    // Checks for who has first turn
                    if (playerIsFirst(this.player, this.enemy)) {
                        await this.playerTurn(playerAction);
                        if (this.enemy.hp > 0) {
                            await this.enemyTurn();
                        } else {
                            this.enemyTurnAction = 'Enemy has been defeated!';
                        }
                    } else {
                        await this.enemyTurn();
                        if (this.player.hp > 0) {
                            await this.playerTurn(playerAction);
                        } else {
                            this.playerTurnAction = 'You died lmfao';
                        }
                    }
                    if (this.player.ultimate == 100) {
                        // Change ult button to green
                        row.components[2].setStyle('SUCCESS');
                    }
                    // Reset turn actions after each turn
                    this.turnActions = { player: null, enemy: null };
                    this.round++;

                    battleMessage.edit({ embeds: [await this.createUpdatedMessage()], components: [row] });
                })
                // Battle expired
                .catch(async () => {
                    this.currentColor = '#FF0000';
                    battleMessage.edit({ embeds: [await this.createUpdatedMessage()], components: [] });
                    battleMessage.channel.send('Battle expired. Your fatass took too long');
                    this.expired = true;
                });
        }
        // Results //
        // Remove buttons
        battleMessage.edit({ embeds: [await this.createUpdatedMessage()], components: [] });

        if (!this.expired) {
            // Checks for who won
            return this.player.hp > 0;
        }
    }

    /**
     * Handle player action
     * @param {String} action
     */
    async playerTurn(action) {
        const invalidInput = true;
        while (invalidInput) {
            if (action == "attack") {
                if (this.dodgeAttack(this.player, this.enemy)) {
                    this.playerTurnAction = `${this.player.name}'s turn!\n${this.player.name} attacked but ${this.enemy.name} dodged!\n`;
                    return;
                } else {
                    const damageTaken = this.calculateDamage(this.player, this.enemy);
                    this.takeDamage(this.enemy, damageTaken);
                    this.playerTurnAction = `${this.player.name}'s turn!\n${this.player.name} does ${damageTaken} damage!\n`;
                    return;
                }
            } else if (action == "defend") {
                this.playerTurnAction = "You shield yourself, it works.";
                return;
            } else if (action == "ultimate") {

                // /////////
                // Broken //
                // /////////
                if (this.player.ultimate == 100) {
                    // Reset ultimate
                    this.resetUltimate(this.player);
                    this.playerTurnAction = await useUltimate(this.player, this.enemy, this.user);
                    return;
                } else {
                    await this.message.channel.send(`You only have ${this.player.ultimate} ultimate charge, you need 100 to use your ultimate.`);
                    return;
                }
            } else {
                this.playerTurnAction = "Nothing happened";
                return;
            }
        }
    }
    // Gives an Enemy (Probably add shielding here)
    async enemyTurn() {
        if (this.dodgeAttack(this.enemy, this.player)) {
            this.enemyTurnAction = `${this.enemy.name}'s turn!\n${this.enemy.name} attacked but ${this.player.name} dodged!\n`;
        } else {
            const damageTaken = this.calculateDamage(this.enemy, this.player, this.turnActions.player == 'defend');
            this.takeDamage(this.player, damageTaken);
            this.enemyTurnAction = `${this.enemy.name}'s turn!\n${this.enemy.name} does ${damageTaken} damage!\n`;
        }
    }

    // Updates battle embed to display ongoing input
    async createUpdatedMessage() {
        const updatedBattleEmbed = new Discord.MessageEmbed()
            .setColor(this.currentColor)
            .setTitle(this.player.name + '\'s ultimate charge: ' + this.player.ultimate + "/100")
            .setAuthor({ name: this.message.author.tag, iconURL: this.message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription(this.player.ultimateString)
            .addFields(
                { name: 'Experience Ticket', value: this.expMsg, inline: true },
                { name: 'Gold Ticket', value: this.goldMsg, inline: true },
                { name: 'Player HP', value: `Lvl ${this.user.level} **${this.player.name}**'s **HP**: ${this.player.hp}/${this.originalPlayerHP}` },
                { name: 'Enemy HP', value: `Lvl ${this.enemy.level} **${this.enemy.name}**'s **HP**: ${this.enemy.hp}/${this.originalEnemyHP}` },
                { name: `Round ${this.round}`, value: this.playerTurnAction },
                { name: '​', value: this.enemyTurnAction },
            )
            .setImage(this.locationInfo.LocationImage)
            .setFooter({ text: `${this.locationInfo.Description}` });
        return updatedBattleEmbed;
    }

    /**
     * Reset ultimate charge
     * @param {User.player} player
     */
    resetUltimate(player) {
        player.ultimate = 0;
        player.ultimateString = generateUltimateString(player.ultimate);
        row.components[2].setStyle('DANGER');
    }

    /**
     * Returns dodge success
     * @param {User.player|Enemy} attacker
     * @param {User.player|Enemy} defender
     * @returns {Boolean}
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

    /**
     * Check for damage taken
     * @param {User.player|Enemy} attacker
     * @param {User.player|Enemy} defender
     * @param {Boolean} shield
     * @returns {Number}
     */
    calculateDamage(attacker, defender, shield = false) {
        // Just for clarity
        const damage = attacker.attack;

        // Multiplier stuff
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
        }

        // If user shielded (probably will change logic sometime later)
        if (shield) {
            // Change it later so higher level reduces damagetaken too
            if (defender.defense > 99) {
                damageTaken *= 1 / 100;
                this.chargeUltimate(defender, 24);
            } else {
                damageTaken *= (100 - defender.defense) / 100;
                this.chargeUltimate(defender, 20);
            }
        }

        // Charge ultimate
        this.chargeUltimate(attacker, 20);

        // Floor to int
        damageTaken = Math.floor(damageTaken);

        // Return damage for use
        return damageTaken;
    }

    /**
     * Deducts hp from target
     * @param {User.player|Enemy} user
     * @param {Number} amount
     * @returns {Number}
     */
    takeDamage(user, amount) {
        user.hp -= amount;
        user.hp < 0 ? user.hp = 0 : user.hp;
        if (user.hp == 0) {
            this.currentColor = '#FF0000';
        }
        return user.hp;
    }

    /**
     * Charge ultimate and update display string
     * @param {User.player|Enemy} user
     * @param {Number} amount
     * @returns {Number}
     */
    chargeUltimate(user, amount) {
        user.ultimate += amount;
        user.ultimate > 100 ? user.ultimate = 100 : user.ultimate;
        user.ultimateString = generateUltimateString(user.ultimate);
        return user.ultimate;
    }
};

/**
 * Generate ultimate string to display
 * @param {Number} ultimate
 * @returns {String}
 */
function generateUltimateString(ultimate) {
    return `${ultimateStart}${ultimateEmoteArray.slice(0, Math.floor((ultimate) / 10)).join("")}${emptyUltimateEmote.repeat(Math.ceil((100 - ultimate) / 10))}${ultimateEnd}`;
}

/**
 * Returns a boolean of whether player goes first
 * @param {*} player
 * @param {Enemy} enemy
 * @returns {boolean}
 */
function playerIsFirst(player, enemy) {
    if (player.speed > enemy.speed) {
        return true;
    } else if (player.speed < enemy.speed) {
        return false;
    } else {
        return Math.random() < 0.5;
    }
}
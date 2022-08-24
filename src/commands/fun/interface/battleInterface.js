const Discord = require('discord.js');
const useUltimate = require('../utils/ultimateUtil.js');
const applyBuffs = require('../utils/buffUtil.js');
const { emote } = require("../../../constants/emojis");
const { color } = require("../../../constants/colors");

const row = new Discord.MessageActionRow()
    .addComponents(
        new Discord.MessageButton()
            .setCustomId('attack')
            .setLabel(emote.Sword)
            .setStyle('PRIMARY'),
        new Discord.MessageButton()
            .setCustomId('defend')
            .setLabel(emote.Shield)
            .setStyle('PRIMARY'),
        new Discord.MessageButton()
            .setCustomId('ultimate')
            .setLabel('')
            .setStyle('DANGER')
            .setEmoji(emote.UltimateIcon),
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
        this.currentColor = color.Active;

        // Set location info
        this.locationInfo = locationInfo;

        // Game states
        this.expired;
        this.round = 1;
        this.turnActions = { player: null, enemy: null };
        this.playerShielding = false;

        // Inactive
        this.playerTurnAction = `You stared at ${this.enemy.name}`;
        this.enemyTurnAction = `${this.enemy.name} stares back at you.`;
        this.playerPreTurnAction = ``;
        // Retrieve player name and stats from discord user
        this.player = { name: user.player.name };
        Object.assign(this.player, user.player);
        this.player.buffs = [];

        // Copy original hp to display in battle
        this.originalPlayerHP = this.player.hp;
        this.originalEnemyHP = this.enemy.hp;

        // Copy original stats
        this.player.originalPlayerStats = this.player;

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
            .setImage(this.locationInfo.imageURL)
            .setFooter({ text: `Area ${this.locationInfo.id} - ${this.locationInfo.selectedFloor} | ${this.locationInfo.desc}` });


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
            // Player pre turn action is set to null if no buffs are applied
            if (this.player.buffs.length <= 0) { this.playerPreTurnAction = ''; }
            // Apply buffs before first turn
            for (const i in this.player.buffs) {
                this.playerPreTurnAction = await applyBuffs(this.player, this.enemy, this.player.buffs[i].id);
            }

            // awaits Player reaction
            await battleMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                .then(async i => {
                    // Get player action
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
                    this.currentColor = color.Expired;
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
     * @param {String} action - attack/defend/ultimate
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
                if (this.playerShielding) {
                    this.playerTurnAction = "You shield yourself again, increasing your charge by a further 10!";
                    this.chargeUltimate(this.player, 10);
                    return;
                }
                this.playerTurnAction = "You shield yourself, bracing for the next attack.";
                this.playerShielding = true;
                return;
            } else if (action == "ultimate") {
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
            const damageTaken = this.calculateDamage(this.enemy, this.player, this.playerShielding);
            this.enemyTurnAction = `${this.enemy.name}'s turn!\n${this.enemy.name} does ${damageTaken} damage!\n`;
            if (this.playerShielding) {
                const fullDamageTaken = this.calculateDamage(this.enemy, this.player);
                this.enemyTurnAction += `${this.player.name}'s shield absorbed ${fullDamageTaken - damageTaken} damage!\n`;
                this.playerShielding = false;
            }
            this.takeDamage(this.player, damageTaken);
        }
    }

    // Updates battle embed to display ongoing input
    async createUpdatedMessage() {
        // Order turns correctly for player and enemy
        const turns = [`${this.playerPreTurnAction} \n ${this.playerTurnAction}`, this.enemyTurnAction];
        if (!playerIsFirst(this.player, this.enemy)) {
            [turns[0], turns[1]] = [turns[1], turns[0]];
        }

        const updatedBattleEmbed = new Discord.MessageEmbed()
            .setColor(this.currentColor)
            .setTitle(this.player.name + '\'s ultimate charge: ' + this.player.ultimate + "/100")
            .setAuthor({ name: this.message.author.tag, iconURL: this.message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription(this.player.ultimateString)
            .addFields(
                { name: 'Experience Ticket', value: this.expMsg, inline: true },
                { name: 'Gold Ticket', value: this.goldMsg, inline: true },
                { name: 'Player HP', value: `Lvl ${this.user.level} **${this.player.name}**'s **HP**: ${this.player.hp}/${this.originalPlayerHP} ${this.playerShielding ? emote.Shield : ""}` },
                { name: 'Enemy HP', value: `Lvl ${this.enemy.level} **${this.enemy.name}**'s **HP**: ${this.enemy.hp}/${this.originalEnemyHP}` },
                { name: `Round ${this.round}`, value: turns[0] },
                { name: '​', value: turns[1] },
            )
            .setImage(this.locationInfo.imageURL)
            .setFooter({ text: `Area ${this.locationInfo.id} - ${this.locationInfo.selectedFloor} | ${this.locationInfo.desc}` }); return updatedBattleEmbed;
    }

    /**
     * Reset ultimate charge
     * @param {User.player} player - Object
     */
    resetUltimate(player) {
        player.ultimate = 0;
        player.ultimateString = generateUltimateString(player.ultimate);
        row.components[2].setStyle('DANGER');
    }

    /**
     * Returns dodge success
     * @param {User.player|Enemy} attacker - Object
     * @param {User.player|Enemy} defender - Object
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
     * @param {User.player|Enemy} attacker - Object
     * @param {User.player|Enemy} defender - Object
     * @param {Boolean} shield - true/false
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
            damageTaken -= defender.defense;
            // Change it later so higher level reduces damagetaken too
            if (defender.defense > 99) {
                damageTaken *= 1 / 100;
                this.chargeUltimate(defender, 40);
            } else {
                damageTaken *= (100 - defender.defense) / 100;
                console.log(defender);
                this.chargeUltimate(defender, 30);
            }
        }

        // Charge ultimate
        this.chargeUltimate(attacker, 20);

        // Floor to int
        damageTaken = Math.floor(damageTaken);

        // Ensures damage taken is not negative
        if (damageTaken < 0) {
            damageTaken = 0;
        }

        // Return damage for use
        return damageTaken;
    }

    /**
     * Deducts hp from target
     * @param {User.player|Enemy} user - Object
     * @param {Number} amount - Damage taken
     * @returns {Number} Current HP - After taking damage
     */
    takeDamage(user, amount) {
        user.hp -= amount;
        user.hp < 0 ? user.hp = 0 : user.hp;
        if (user.hp == 0) {
            this.currentColor = color.Expired;
        }
        return user.hp;
    }

    /**
     * Charge ultimate and update display string
     * @param {User.player|Enemy} user - Object
     * @param {Number} amount - Amount to charge
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
 * @param {Number} ultimate - Current ultimate charge
 * @returns {String}
 */
function generateUltimateString(ultimate) {
    return `${emote.UltimateStart}${emote.UltimateBar.slice(0, Math.floor((ultimate) / 10)).join("")}${emote.EmptyUltimate.repeat(Math.ceil((100 - ultimate) / 10))}${emote.UltimateEnd}`;
}

/**
 * Returns a boolean of whether player goes first
 * @param {*} player - Object
 * @param {Enemy} enemy - Object
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
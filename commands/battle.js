const Discord = require('discord.js');
const botLevel = require('../models/botLevel');
const User = require('../models/user');
const win = require('./battle/win.js');
const userEffects = require('../models/userEffects.js');

module.exports = {
    name: "battle",
    description: "Battling is the primary means of war. 'The war of war is very pog' -Sun Tzu",
    syntax: "",
    cooldown: 20,
    aliases: ['b'],
    category: "Fun",
    // change timing in main bot
    async execute(message, args) {
        const ultimateEmote = ":Ultimate:822042890955128872"
        const emptyUltimateEmote = "<:blank:829270386986319882>"
        const ultimateEmoteArray = ["<:1:829267948127649792>", "<:2:829267958836101130>", "<:3_:829267967392088134>", "<:4:829267977559867412>", "<:5:829271937548419093>"
            , "<:6:829271966161567774>", "<:7:829271980397166612>", "<:8:829271994205208597>", "<:9:829272014946697246>", "<:10:829272027604713523>"]
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
        let displayUltimateString = `<:Yeet:829267937784627200>${emptyUltimateEmote.repeat(10)}<:Yeet2:829270362516488212>`;

        let currentColor = '#0099ff';
        let ultimate = 0;
        let playerTurnAction;
        let location;
        let originalPlayerHP, originalEnemyHP;

        // Method to check for damage taken by hero
        function takeDamage(damage, defender, isHero) {
            let attMulti = damage / defender.defense;
            if (attMulti < 0.4) {
                attMulti = 0.4;
            }
            else if (attMulti > 1.5) {
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
                    }
                    else {
                        damageTaken *= (100 - defender.defense) / 100;
                        ultimate += 20;
                    }
                }
                else {
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
        }
        // Matthew do later (he say he lazy now)
        function ultimateMove(damage, defender) {
            let damageDone;
            return damageDone;
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

        // Battle function
        async function battle(user, player, enemy, expMsg, goldMsg, botEmbedMessage) {
            let playerTurnAction = "nothing";
            let enemyTurnAction = "nothing";

            function dodgeAttack(attacker, defender) {
                if (defender.speed > attacker.speed) {
                    speedDifference = defender.speed - attacker.speed;
                    rng = speedDifference / attacker.speed;
                    if (rng > 0.2) {
                        rng = 0.2;
                    }
                    dodge = Math.random() <= rng;
                    return dodge;
                }
                return false;
            }

            function playerTurn(action) {
                if (action == "attack") {
                    if (dodgeAttack(player, enemy)) {
                        playerTurnAction = `${player.name}'s turn!\n${player.name} attacked but ${enemy.name} dodged!\n`
                    }
                    else {
                        playerTurnAction = `${player.name}'s turn!\n${player.name} does ${takeDamage(player.attack, enemy, false)} damage!\n`;
                    }
                }
                else if (action == "defend") {
                    playerTurnAction = "You shield yourself, it works";
                }
                else if (action == "ultimate") {
                    if (ultimate == 100) {
                        ultimate = 0;
                        // Change ult button to red
                        row.components[2].setStyle('DANGER');

                        playerTurnAction = player.name + '\'s turn!\n' + player.name + ' does ' + takeDamage(player.attack * 2.5, enemy, false)
                            + ' damage with his super saiyann ultimate!!\n';
                        displayUltimateString = `<:Yeet:829267937784627200>${emptyUltimateEmote.repeat(10)}<:Yeet2:829270362516488212>`;
                    }
                    else {
                        playerTurnAction = `You only have ${ultimate} ultimate charge, you need 100 to use your ultimate.`;
                    }
                }
                else {
                    playerTurnAction = "Nothing happened";
                }

            }
            // Gives an Enemy (Probably add shielding here)
            function enemyTurn() {
                if (dodgeAttack(enemy, player)) {
                    enemyTurnAction = `${enemy.name}'s turn!\n${enemy.name} attacked but ${player.name} dodged!\n`
                }
                else {
                    enemyTurnAction = `${enemy.name}'s turn!\n${enemy.name} does ${takeDamage(enemy.attack, player, true)} damage!\n`;
                }
            }

            // Updates battle embed to display ongoing input
            async function createUpdatedMessage(expMsg, goldMsg) {
                let updatedBattleEmbed = new Discord.MessageEmbed()
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
                    .setImage(locationInfo._doc.LocationImage)
                    .setFooter(`${locationInfo._doc.Description}`);
                return updatedBattleEmbed;
            }

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
                            }
                            else {
                                enemyTurnAction = 'Enemy has been defeated!'
                            }
                        }
                        else {
                            enemyTurn();
                            if (player.hp > 0) playerTurn(playerAction);
                        }
                        if (enemy.hp < 0) {
                            enemy.hp = 0;
                            currentColor = '#FF0000';
                        };
                        if (player.hp < 0) {
                            player.hp = 0;
                            currentColor = '#FF0000';
                        };
                        if (ultimate == 100) {
                            // Change ult button to green
                            row.components[2].setStyle('SUCCESS');
                        }
                        botEmbedMessage.edit({ embeds: [await createUpdatedMessage(expMsg, goldMsg)], components: [row] });
                    })
                    .catch(async err => {
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
                    win.execute(message, user, enemy, locationInfo._doc);
                }
                else {
                    message.channel.send(`${player.name} has been defeated by ${enemy.name}!`);
                }
            }
        }
        async function generateEnemyName() {
            let locationInfo;
            let enemyName;
            locationInfo = await botLevel.findOne({ 'Location': location }, (err, enemy) => {
            });
            enemyName = locationInfo._doc.Enemy;
            return enemyName[Math.floor(Math.random() * enemyName.length)];
        }

        // Makes new random enemy
        async function makeNewEnemy(user) {
            locationInfo = await botLevel.findOne({ 'Location': location }, (err, enemy) => {
            });
            let enemyLvl = Math.floor(Math.random() * 11) - 5 + user.level;
            if (enemyLvl < 1) enemyLvl = 1;

            let baseStat = enemyLvl / 2 < 1 ? Math.floor(enemyLvl / 2) : 1;
            let minStat = 5;
            // Takes the buff from the db and applies it to the enemies
            const { hp: hpMulti, attack: attackMulti, defense: defenseMulti, speed: speedMulti } = locationInfo._doc.Buff;
            let enemyHP = Math.floor((Math.random() * (Math.exp(enemyLvl) ** (1 / 20)) + minStat * 5 + enemyLvl * 5) * hpMulti);
            let enemyAttack = Math.floor((Math.random() * enemyLvl + minStat + baseStat) * attackMulti);
            let enemyDefense = Math.floor((Math.random() * enemyLvl + minStat + baseStat) * defenseMulti);
            let enemySpeed = Math.floor((Math.random() * enemyLvl + minStat + baseStat) * speedMulti);
            let enemyType = "undead";
            let enemy = new Enemy(await generateEnemyName(), enemyHP, enemyAttack, enemyDefense, enemySpeed, enemyType, enemyLvl);
            return enemy;
        }

        let playerAction;
        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
            }
            else {
                let expMsg = 'No active EXP Ticket.';
                let goldMsg = 'No active Gold Ticket.';
                await userEffects.findOne({ userID: message.author.id }, async (err, effects) => {

                    if (effects != null) {
                        let tickets = Object.keys(effects.tickets)
                        for (i = 0; i < tickets.length; i++) {
                            let ticketName = tickets[i]
                            let ticket = effects.tickets[ticketName];
                            let today = new Date();
                            if (today >= ticket.endTime) {
                                let msg = `You do not have auto active. Your ${ticketName} has been used up.`;
                                if (ticket.auto == 'true') {
                                    await User.findOne({ userID: message.author.id }, async (err, user) => {
                                        if (user.inv[ticketName]) {
                                            msg = `Auto is active, another ${ticketName} has been activated.`
                                            user.inv[ticketName].quantity -= 1;
                                            ticket.startTime = new Date()
                                            Date.prototype.addHours = function (h) {
                                                this.setHours(this.getHours() + h);
                                                return this;
                                            }
                                            ticket.endTime = new Date().addHours(ticket.duration)
                                            if (user.inv[ticketName].quantity == 0) {
                                                msg += ` This is your last ${ticketName}.`
                                                delete user.inv[ticketName]
                                            }

                                        }
                                        else {
                                            msg = `Your inventory does not have any more ${ticketName}. auto will be deactivated.`
                                            delete effects.tickets[ticketName];
                                        }
                                        user.markModified('inv');
                                        user.save()
                                            .then(result => console.log(result))
                                            .catch(err => console.error(err));
                                    })
                                }
                                else {
                                    delete effects.tickets[ticketName];
                                }
                                message.channel.send(msg)
                            }
                        }
                        let expTicketName = Object.keys(effects.tickets).filter(key => key.includes('Experience'))[0]
                        let expTicketObject = effects.tickets[expTicketName]
                        let goldTicketName = Object.keys(effects.tickets).filter(key => key.includes('Gold'))[0]
                        let goldTicketObject = effects.tickets[goldTicketName]
                        if (expTicketName) {
                            expMsg = `${expTicketName} active: Boost Experience gained by ${expTicketObject.multiplier}`
                        }
                        if (goldTicketName) {
                            goldMsg = `${goldTicketName} active: Boost Gold gained by ${goldTicketObject.multiplier}`
                        }
                        effects.markModified('tickets');
                        effects.save()
                            .then(result => console.log(result))
                            .catch(err => console.error(err));
                    }
                });
                location = user.location;
                let enemy = await makeNewEnemy(user);


                // user.player
                let player = { name: user.player.name };

                for (stat in user.player.baseStats) {
                    player[stat] = Math.round(user.player.baseStats[stat] * (1 + user.player.additionalStats[stat].multi / 100) + user.player.additionalStats[stat].flat)
                }

                originalPlayerHP = player.hp;
                originalEnemyHP = enemy.hp;
                // Makes battle embed
                const battleEmbed = new Discord.MessageEmbed()
                    .setColor(currentColor)
                    .setTitle(user.player.name + '\'s ultimate charge: ' + ultimate + "/100")
                    .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                    .setDescription(displayUltimateString)
                    .addFields(
                        { name: 'Experience Ticket', value: expMsg, inline: true },
                        { name: 'Gold Ticket', value: goldMsg, inline: true },
                        { name: 'Player HP', value: `Lvl ${user.level} **${player.name}**'s **HP**: ${player.hp}/${originalPlayerHP}` },
                        { name: 'Enemy HP', value: `Lvl ${enemy.level} **${enemy.name}**'s **HP**: ${enemy.hp}/${originalEnemyHP}` },
                    )
                    .setImage(locationInfo._doc.LocationImage)
                    .setFooter(`${locationInfo._doc.Description}`);



                message.channel.send({ embeds: [battleEmbed], components: [row] })
                    .then(botMessage => {
                        battle(user, player, enemy, expMsg, goldMsg, botMessage);
                    });
            }
        });


    }


}
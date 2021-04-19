module.exports = {
    name: "battle",
    description: "Battle allows you to engage enemies and gain gold and experience as a result of your engagement",
    syntax: "",
    aliases: ['b'],
    category: "Fun",
    // change timing in main bot
    cooldown: 60,
    execute(message, args) {

        const Discord = require('discord.js');
        const botLevel = require('../models/botLevel');
        const User = require('../models/user');
        const win = require('./battle/win.js');
        const ultimateEmote = ":Ultimate:822042890955128872"
        const emptyUltimateEmote = "<:blank:829270386986319882>"
        const ultimateEmoteArray = ["<:1:829267948127649792>", "<:2:829267958836101130>", "<:3_:829267967392088134>", "<:4:829267977559867412>", "<:5:829271937548419093>"
            , "<:6:829271966161567774>", "<:7:829271980397166612>", "<:8:829271994205208597>", "<:9:829272014946697246>", "<:10:829272027604713523>"]

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
                if (playerAction == "🛡️") {
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
        async function battle(user, enemy) {
            let turn, playerTurnAction, enemyTurnAction, collectorExpireTime;
            let player = user.player;
            function playerTurn(action) {
                if (action == "⚔️") {
                    playerTurnAction = player.name + '\'s turn!\n' + player.name + ' does ' + takeDamage(player.attack, enemy, false) + ' damage!\n';
                }
                else if (action == "🛡️") {
                    playerTurnAction = "You shield yourself, it works";
                }
                else if (action == "Ultimate") {
                    if (ultimate == 100) {
                        ultimate = 0;
                        playerTurnAction = player.name + '\'s turn!\n' + player.name + ' does ' + takeDamage(player.attack * 2.5, enemy, false)
                            + ' damage with his super saiyann ultimate!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n';
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
                enemyTurnAction = `${enemy.name}'s turn!\n${enemy.name} does ${takeDamage(enemy.attack, player, true)} damage!\n`;
            }

            // Updates battle embed to display ongoing input
            function createUpdatedMessage() {
                let updatedBattleEmbed = new Discord.MessageEmbed()
                    .setColor(currentColor)
                    .setTitle(user.player.name + '\'s ultimate charge: ' + ultimate + "/100")
                    .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                    .setDescription(displayUltimateString)
                    .addFields(
                        { name: 'Player HP', value: `${user.player.name}'s **HP**: ${user.player.hp}/${originalPlayerHP}` },
                        { name: 'Player Lvl', value: user.level },
                        { name: 'Enemy HP', value: `${enemy.name}'s **HP**: ${enemy.hp}/${originalEnemyHP}` },
                        { name: 'Enemy Lvl', value: enemy.level },
                        { name: '\u200B', value: '\u200B' },
                        { name: 'Turn', value: playerTurnAction },
                        { name: '​', value: enemyTurnAction },
                    )
                    .addField(`Location Name: \n${locationInfo.Level.LocationName}`, `Applied modifiers from ${locationInfo.Level.LocationName}\n${locationInfo.Level.Description}`, true)
                    .setImage(locationInfo.Level.LocationImage)
                    .setTimestamp()
                    .setFooter('Fight', 'https://tinyurl.com/y4yl2xaa');
                return updatedBattleEmbed;
            }
            // Battle goes on when Player and Enemy is still alive
            while (!(player.hp <= 0) && !(enemy.hp <= 0)) {

                // awaits Player reaction
                await new Promise((resolve, reject) => {
                    const collector = botEmbedMessage.createReactionCollector(filter, { max: 1, time: 60000 });
                    collector.on('collect', r => {
                        currentColor = '#0099ff';
                        collector.time = 60000;
                        timea = collector.time;
                        // Cheap fix to display battle run out time(may change)
                        clearInterval(collectorExpireTime);
                        collectorExpireTime = setInterval(function () {
                            timea -= 1000;
                        }, 1000);
                        playerAction = r.emoji.name;
                        resolve();
                    });
                    // Continued cheap fix
                    collector.on('end', () => {
                        botEmbedMessage.edit(createUpdatedMessage());
                        if (timea <= 1000) {
                            message.channel.send('Battle expired. Your fatass took too long');
                            clearInterval(collectorExpireTime);
                        }
                    });
                });
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
                botEmbedMessage.edit(createUpdatedMessage());
            }
            // Checks for who won
            if (player.hp > 0) {
                win.execute(message, user, enemy, location);
                clearInterval(collectorExpireTime);
            }
            else {
                message.channel.send(`${player.name} has been defeated by ${enemy.name}!`);
                clearInterval(collectorExpireTime);
            }
        }
        async function generateEnemyName() {
            let locationInfo;
            let enemyName;
            locationInfo = await botLevel.findOne({ 'Level.Location': location }, (err, enemy) => {
            });
            enemyName = locationInfo.Level.Enemy;
            return enemyName[Math.floor(Math.random() * enemyName.length)];
        }

        // Makes new random enemy
        async function makeNewEnemy(user) {
            locationInfo = await botLevel.findOne({ 'Level.Location': location }, (err, enemy) => {
            });
            let enemyLvl = Math.floor(Math.random() * 11) - 5 + user.level;
            if (enemyLvl < 1) enemyLvl = 1;
            // Takes the buff from the db and applies it to the enemies
            const { hp: hpMulti, attack: attackMulti, defense: defenseMulti, speed: speedMulti } = locationInfo.Level.Buff;
            let enemyHP = Math.floor((Math.random() * 51 + enemyLvl) * hpMulti);
            let enemyAttack = Math.floor((Math.random() * enemyLvl + 1) * attackMulti);
            let enemyDefense = Math.floor((Math.random() * enemyLvl + 1) * defenseMulti);
            let enemySpeed = Math.floor((Math.random() * enemyLvl + 1) * speedMulti);
            let enemyType = "undead";
            let enemy = new Enemy(await generateEnemyName(), enemyHP, enemyAttack, enemyDefense, enemySpeed, enemyType, enemyLvl);
            return enemy;
        }

        async function getDescription() {
            location = await botLevel.findOne({ 'Level.Location': location });
            return location.Level.Description;
        }

        let botEmbedMessage, playerAction, filter, timea, description;
        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
            }
            else {
                location = user.location;
                let enemy = await makeNewEnemy(user);
                // Filter for which emojis the reaction collector will accept 
                filter = (reaction, user) => {
                    if ((reaction.emoji.name === '⚔️' || reaction.emoji.name === '🛡️' || reaction.emoji.name === 'Ultimate') && user == message.author.id) {
                        return reaction;
                    }
                };

                description = await getDescription();
                // Makes battle embed probably need to add more things like speed
                originalPlayerHP = user.player.hp;
                originalEnemyHP = enemy.hp;
                const battleEmbed = new Discord.MessageEmbed()
                    .setColor(currentColor)
                    .setTitle(user.player.name + '\'s ultimate charge: ' + ultimate + "/100")
                    .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                    .setDescription(displayUltimateString)
                    .addFields(
                        { name: 'Player HP', value: `${user.player.name}'s **HP**: ${user.player.hp}/${originalPlayerHP}` },
                        { name: 'Player Lvl', value: user.level },
                        { name: 'Enemy HP', value: `${enemy.name}'s **HP**: ${enemy.hp}/${originalEnemyHP}` },
                        { name: 'Enemy Lvl', value: enemy.level },
                        { name: '\u200B', value: '\u200B' }
                    )
                    .addField(`Location Name: \n${locationInfo.Level.LocationName}`, `Applied \n${locationInfo.Level.Description}`, true)
                    .setImage(locationInfo.Level.LocationImage)
                    .setFooter('Fight', 'https://tinyurl.com/y4yl2xaa');

                message.channel.send(battleEmbed)
                    .then(botMessage => {
                        botEmbedMessage = botMessage;
                        botMessage.react("⚔️");
                        botMessage.react("🛡️");
                        botMessage.react(ultimateEmote);
                        // Replace matthew with the message author
                        battle(user, enemy);
                    });
            }
        });


    }

}

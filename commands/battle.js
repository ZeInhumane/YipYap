module.exports = {
    name: "battle",
    description: "Battle allows you to engage enemies and gain gold and experience as a result of your engagement",
    syntax: "",
    category: "Fun",
    execute(message, args) {
        const Discord = require('discord.js');
        const User = require('../models/user');
        const win = require('./battle/win.js');
        const lvl_edit = require('./battle/lvl_edit.js');
        var currentColor = '#0099ff';
        // Method to check for damage taken by hero
        function takeDamage(damage, defender, isHero) {
            let attMulti = damage / defender.defense;
            if (attMulti < 0.4) {
                attMulti = 0.4;
            }
            else if (attMulti > 1.5) {
                attMulti = 1.5;
            }
            var damageTaken = Math.floor((damage + Math.floor((damage - defender.defense) / 4)) * attMulti);
            if (playerAction == "🛡️" && isHero) {
                // Change it later so higher level reduces damagetaken too
                if (defender.defense > 99) {
                    damageTaken *= 1 / 100;
                }
                else{
                    damageTaken *= (100 - defender.defense) / 100;
                }
            }
            // Ensures damage taken is at least 1
            if (damageTaken < 1) {
                damageTaken = 1;
            }
            damageTaken = Math.floor(damageTaken);
            defender.hp -= damageTaken;
            return damageTaken;
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
            var player = user.player;
            function playerTurn(action) {
                if (action == "⚔️") {
                    playerTurnAction = player.name + '\'s turn!\n' + player.name + ' does ' + takeDamage(player.attack, enemy, false) + ' damage!\n';
                }
                else if (action == "🛡️") {
                    playerTurnAction = "You shield yourself, it works";
                }
                else {
                    playerTurnAction = "Nothing happened";
                }

            }
            // Gives an Enemy (Probably add shielding here)
            function enemyTurn() {
                enemyTurnAction = enemy.name + '\'s turn!\n' + enemy.name + ' does ' + takeDamage(enemy.attack, player, true) + ' damage!\n';
            }
            // Updates battle embed to display ongoing input
            function createUpdatedMessage() {
                var updatedBattleEmbed = new Discord.MessageEmbed()
                    .setColor(currentColor)
                    .setTitle('Battle Start! :crossed_swords:')
                    .setURL('https://discord.gg/CTMTtQV')
                    .setAuthor('Inhumane', 'https://vignette.wikia.nocookie.net/hunter-x-hunter-fanon/images/a/a9/BABC6A23-98EF-498E-9D0E-3EBFC7ED8626.jpeg/revision/latest?cb=20170930221652', 'https://discord.js.org')
                    .setDescription('Absolute best')
                    .setThumbnail('https://i.pinimg.com/564x/49/7c/22/497c226576e8684e4dfddb4a923a6282.jpg')
                    .addFields(
                        { name: 'Player HP', value: player.name + '\'s HP: ' + player.hp },
                        { name: 'Player Lvl', value: user.level },
                        { name: 'Enemy HP', value: enemy.name + '\'s HP: ' + enemy.hp },
                        { name: 'Enemy Lvl', value: enemy.level },
                        { name: '\u200B', value: '\u200B' },
                        { name: 'Turn', value: playerTurnAction },
                        { name: '​', value: enemyTurnAction },
                    )
                    .addField('Bloody battlefield', '10% Less speed debuff', true)
                    .setImage('https://i.pinimg.com/564x/49/7c/22/497c226576e8684e4dfddb4a923a6282.jpg')
                    .setTimestamp()
                    .setFooter('Fight', 'https://tinyurl.com/y4yl2xaa');
                return updatedBattleEmbed;
            }
            // Battle goes on when Player and Enemy is still alive
            while (!(player.hp <= 0) && !(enemy.hp <= 0)) {
                console.log(player.hp, enemy.hp);
                var turn, playerTurnAction, enemyTurnAction, collectorExpireTime;
                // awaits Player reaction
                await new Promise((resolve, reject) => {
                    const collector = botEmbedMessage.createReactionCollector(filter, { max: 1, time: 60000 });
                    collector.on('collect', r => {
                        collector.time = 60000;
                        timea = collector.time;
                        // Cheap fix to display battle run out time(may change)
                        clearInterval(collectorExpireTime);
                        collectorExpireTime = setInterval(function () {
                            timea -= 1000;
                            console.log(timea);
                        }, 1000);
                        console.log(r.emoji.name);
                        playerAction = r.emoji.name;
                        resolve();
                    });
                    // Continued cheap fix
                    collector.on('end', () => {
                        console.log("Collecter Ended: " + timea);
                        currentColor = '#FF0000';
                        botEmbedMessage.edit(createUpdatedMessage());
                        if (timea <= 1000) {
                            message.channel.send('Battle expired. Your fatass took too long');
                            clearInterval(collectorExpireTime);
                        }
                    });
                });
                console.log("BATTLE STARTS");
                console.log(playerAction);
                // Checks for who has first turn
                if (player.speed > enemy.speed) {
                    playerTurn(playerAction);
                    if (enemy.hp > 0) {
                        enemyTurn();
                    }
                }
                else {
                    enemyTurn();
                    if (player.hp > 0) {
                        playerTurn(playerAction);
                    }
                }
                if (enemy.hp < 0) {
                    enemy.hp = 0;
                }
                if (player.hp < 0) {
                    player.hp = 0;
                }

                botEmbedMessage.edit(createUpdatedMessage());
            }
            // Checks for who won
            if (player.hp > 0) {
                win.execute(message, user, enemy);
                lvl_edit.execute(message, user, enemy);
                clearInterval(collectorExpireTime);
            }
            else {
                message.channel.send(player.name + ' has been defeated by ' + enemy.name + '!');
                clearInterval(collectorExpireTime);
            }
        }


        // Makes new random enemy
        function makeNewEnemy(user) {
            var enemyLvl = Math.floor(Math.random() * 11) -5 + user.level;
            if (enemyLvl < 1){
                enemyLvl = 1;
            }
            var enemyHP = Math.floor(Math.random() * 51 + enemyLvl);
            var enemyAttack = Math.floor(Math.random() * enemyLvl + 1);
            var enemyDefense = Math.floor(Math.random() * enemyLvl + 1);
            var enemySpeed = Math.floor(Math.random() * enemyLvl + 1);
            var enemyType = "undead";
            var enemy = new Enemy("Skele Man", enemyHP, enemyAttack, enemyDefense, enemySpeed, enemyType, enemyLvl);
            return enemy;
        }
        var botEmbedMessage, playerAction, filter, timea;
        User.findOne({ userID: message.author.id }, (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
            }
            else {
                var enemy = makeNewEnemy(user);
                console.log(message.author.id);
                // Filter for which emojis the reaction collector will accept 
                filter = (reaction, user) => {
                    console.log("Check " + reaction.emoji.name);
                    if ((reaction.emoji.name === '⚔️' || reaction.emoji.name === '🛡️') && user == message.author.id) {
                        console.log(reaction.emoji.name + " passed");
                        return reaction;
                    }
                };
                // Makes battle embed probably need to add more things like speed
                const battleEmbed = new Discord.MessageEmbed()
                    .setColor(currentColor)
                    .setTitle('Battle Start! :crossed_swords:')
                    .setURL('https://discord.gg/CTMTtQV')
                    .setAuthor('Inhumane', 'https://vignette.wikia.nocookie.net/hunter-x-hunter-fanon/images/a/a9/BABC6A23-98EF-498E-9D0E-3EBFC7ED8626.jpeg/revision/latest?cb=20170930221652', 'https://discord.js.org')
                    .setDescription('Absolute best')
                    .setThumbnail('https://i.pinimg.com/564x/49/7c/22/497c226576e8684e4dfddb4a923a6282.jpg')
                    .addFields(
                        { name: 'Player HP', value: user.player.name + '\'s HP: ' + user.player.hp },
                        { name: 'Player Lvl', value: user.level },
                        { name: 'Enemy HP', value: enemy.name + '\'s HP: ' + enemy.hp },
                        { name: 'Enemy Lvl', value: enemy.level },
                        { name: '\u200B', value: '\u200B' }
                    )
                    .addField('Bloody battlefield', '10% Less speed debuff', true)
                    .setImage('https://i.pinimg.com/564x/49/7c/22/497c226576e8684e4dfddb4a923a6282.jpg')
                    .setTimestamp()
                    .setFooter('Fight', 'https://tinyurl.com/y4yl2xaa');

                message.channel.send(battleEmbed)
                    .then(botMessage => {
                        botEmbedMessage = botMessage;
                        botMessage.react("⚔️");
                        botMessage.react("🛡️");
                        // Replace matthew with the message author
                        battle(user, enemy);
                    });
            }
        });
    }
}
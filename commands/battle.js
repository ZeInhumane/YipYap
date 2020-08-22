module.exports = {
    name: "battle",
    description: "Battles an enemy",
    execute(message, args) {
        const Discord = require('discord.js');
        class Hero {
            constructor(name, hp, attack, defense, speed) {
                this.name = name;
                this.hp = hp;
                this.attack = attack;
                this.defense = defense;
                this.speed = speed;
            }

            takeDamage(damage) {
                let attMulti = damage / this.defense;
                if (attMulti < 0.4) {
                    attMulti = 0.4;
                }
                else if (attMulti > 1.5) {
                    attMulti = 1.5;
                }
                var damageTaken = Math.floor((damage + Math.floor((damage - this.defense) / 4)) * attMulti);
                if (damageTaken < 1) {
                    damageTaken = 1;
                }
                this.hp -= damageTaken;
                return damageTaken;
            }
        }

        class Enemy {
            constructor(name, hp, attack, defense, speed, type) {
                this.name = name;
                this.hp = hp;
                this.attack = attack;
                this.defense = defense;
                this.speed = speed;
                this.type = type;
            }

            takeDamage(damage) {
                let attMulti = damage / this.defense;
                if (attMulti < 0.4) {
                    attMulti = 0.4;
                }
                else if (attMulti > 1.5) {
                    attMulti = 1.5;
                }
                var damageTaken = Math.floor((damage + Math.floor((damage - this.defense) / 4)) * attMulti);
                if (damageTaken < 1) {
                    damageTaken = 1;
                }
                this.hp -= damageTaken;
                return damageTaken;
            }
        }
        async function gotAReaction() {
            await collector.on('collect', r => {
                r.emoji.name === '⚔️' ?
                    console.log('Reacted Attack') : console.log('Reacted Guard');
                collector = botMessage.createReactionCollector(filter, { time: 60000 });
            });
        }
        function battle(player, enemy) {
            function playerTurn() {
                if (action == "⚔️") {
                    var turn = player.name + '\'s turn!\n' + player.name + ' does ' + enemy.takeDamage(player.attack) + ' damage!\n';
                }

            }

            function enemyTurn() {
                var turn = enemy.name + '\'s turn!\n' + enemy.name + ' does ' + player.takeDamage(enemy.attack) + ' damage!\n';
            }
            const updatedBattleEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Battle Start! :crossed_swords:')
                .setURL('https://discord.gg/CTMTtQV')
                .setAuthor('Inhumane', 'https://vignette.wikia.nocookie.net/hunter-x-hunter-fanon/images/a/a9/BABC6A23-98EF-498E-9D0E-3EBFC7ED8626.jpeg/revision/latest?cb=20170930221652', 'https://discord.js.org')
                .setDescription('Absolute best')
                .setThumbnail('https://i.imgur.com/wSTFkRM.png')
                .addFields(
                    { name: 'Player HP', value: player.name + '\'s HP: ' + player.hp },
                    { name: 'Enemy HP', value: enemy.name + '\'s HP: ' + enemy.hp },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Turn', value: turn },
                )
                .addField('Bloody battlefield', '10% Less speed debuff', true)
                .setImage('https://tinyurl.com/y4yl2xaa')
                .setTimestamp()
                .setFooter('Fight', 'https://tinyurl.com/y4yl2xaa');
            while (!(player.hp <= 0) && !(enemy.hp <= 0)) {
                botEmbedMessage.edit(updatedBattleEmbed);
                console.log(player.hp, enemy.hp)
                gotAReaction();
                if (player.speed > enemy.speed) {
                    playerTurn(action);
                    if (enemy.hp > 0) {
                        enemyTurn();
                    }
                }
                else {
                    enemyTurn();
                    if (player.hp > 0) {
                        playerTurn();
                    }
                }
            }

            if (player.hp > 0) {
                console.log(player.name + ' defeated ' + enemy.name + '!');
            }
            else {
                console.log(player.name + ' has been defeated by ' + enemy.name + '!');
            }
        }

        function makeNewEnemy() {
            var enemyHP = Math.floor(Math.random() * 51 + 10);
            var enemyAttack = Math.floor(Math.random() * 11);
            var enemyDefense = Math.floor(Math.random() * 11);
            var enemySpeed = Math.floor(Math.random() * 50 + 10);
            var enemyType = "undead";
            var enemy = new Enemy("Skele Man", enemyHP, enemyAttack, enemyDefense, enemySpeed, enemyType);
            return enemy;
        }

        function makeNewPlayer(playerName) {
            playerDataBase.push(new Hero(playerName, 50, 5, 5, 5));
        }

        var playerDataBase = [];
        var matthew = new Hero('Matthew', 100, 7, 10, 15);
        var enemy = makeNewEnemy();
        console.log(message.author.id)

        const battleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Battle Start! :crossed_swords:')
            .setURL('https://discord.gg/CTMTtQV')
            .setAuthor('Inhumane', 'https://vignette.wikia.nocookie.net/hunter-x-hunter-fanon/images/a/a9/BABC6A23-98EF-498E-9D0E-3EBFC7ED8626.jpeg/revision/latest?cb=20170930221652', 'https://discord.js.org')
            .setDescription('Absolute best')
            .setThumbnail('https://i.imgur.com/wSTFkRM.png')
            .addFields(
                { name: 'Player HP', value: matthew.name + '\'s HP: ' + matthew.hp },
                { name: 'Enemy HP', value: enemy.name + '\'s HP: ' + enemy.hp },
                { name: '\u200B', value: '\u200B' }
            )
            .addField('Bloody battlefield', '10% Less speed debuff', true)
            .setImage('https://tinyurl.com/y4yl2xaa')
            .setTimestamp()
            .setFooter('Fight', 'https://tinyurl.com/y4yl2xaa');


        var botEmbedMessage;
        message.channel.send(battleEmbed)
            .then(botMessage => {
                botEmbedMessage = botMessage;
                console.log(botEmbedMessage)
                botMessage.react("⚔️");
                botMessage.react("🛡️");
                const filter = (reaction, user) => {
                    console.log("Check " + reaction.emoji.name);
                    if ((reaction.emoji.name === '⚔️' || reaction.emoji.name === '🛡️') && user == message.author.id) {
                        console.log(reaction.emoji.name + " passed");
                        return reaction;
                    }
                };
                var collector = botMessage.createReactionCollector(filter, { time: 60000 });
                //Replace matthew with the message author
                battle(matthew, enemy);
            })
    }

}
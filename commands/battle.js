module.exports = {
    name: "battle",
    description: "Battles an enemy",
    execute(message, args) {
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

        function battle(player, enemy) {
            function playerTurn() {
                console.log(player.name + '\'s turn!\n' + player.name + ' does ' + enemy.takeDamage(player.attack) + ' damage!\n');
            }

            function enemyTurn() {
                console.log(enemy.name + '\'s turn!\n' + enemy.name + ' does ' + player.takeDamage(enemy.attack) + ' damage!\n');
            }

            while (!(player.hp <= 0) && !(enemy.hp <= 0)) {
                var playerHPStart = player.hp;
                var enemyHPStart = enemy.hp;
                console.log(player.name + '\'s HP: ' + player.hp);
                console.log(enemy.name + '\'s HP: ' + enemy.hp + '\n');
                if (player.speed > enemy.speed) {
                    playerTurn();
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
        battle(matthew, enemy);

        const battleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Battle Start! :crossed_swords:')
            .setURL('https://discord.js.org/')
            .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
            .setDescription('Some description here')
            .setThumbnail('https://i.imgur.com/wSTFkRM.png')
            .addFields(
                { name: 'Regular field title', value: 'Some value here' },
                { name: '\u200B', value: '\u200B' },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            .addField('Inline field title', 'Some value here', true)
            .setImage('https://i.imgur.com/wSTFkRM.png')
            .setTimestamp()
            .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

        message.channel.send(battleEmbed)
            .then(botMessage => {
                botMessage.react("⚔️");
                botMessage.react("🛡️");
            })
            .then(() => {
                const filter = (reaction, user) => (reaction.emoji.name === '⚔️' || reaction.emoji.name === '🛡️');
                const collector = battleEmbed.message.createReactionCollector(filter, { time: 10000 });
                collector.on('collect', r => r.emoji.name === '⚔️' ?
                    console.log('Reacted Yes') : console.log('Reacted No'));
            })
    }

}
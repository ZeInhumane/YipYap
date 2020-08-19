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
        var damageTaken = Math.floor((damage + Math.floor((damage - this.defense) / 4)) * attMulti)
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
        var damageTaken = Math.floor((damage + Math.floor((damage - this.defense) / 4)) * attMulti)
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
    var enemyHP = Math.floor(Math.random()*51 + 10);
    var enemyAttack = Math.floor(Math.random()*11);
    var enemyDefense = Math.floor(Math.random()*11);
    var enemySpeed = Math.floor(Math.random()*50 + 10);
    var enemyType = "undead";
    var enemy = new Enemy("Skele Man", enemyHP, enemyAttack, enemyDefense, enemySpeed, enemyType);
}

var matthew = new Hero('Matthew', 100, 7, 10, 15);
makeNewEnemy();
battle(matthew, enemy);
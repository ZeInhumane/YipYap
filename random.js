class Hero {
    constructor(name, hp, attack, defense, speed) {
        this.name = name;
        this.hp = hp;
		this.attack = attack;
		this.defense = defense;
		this.speed = speed;
    }

    takeDamage(damage) {
        let attMulti = damage/this.defense;
        if(attMulti < 0.4){
            attMulti = 0.4;
        }
        else if(attMulti > 1.5){
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
        let attMulti = damage/this.defense;
        if(attMulti < 0.4){
            attMulti = 0.4;
        }
        else if(attMulti > 1.5){
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
        else{
            enemyTurn();
            if(player.hp > 0){
                playerTurn();
            }
        }
    }

    if(player.hp > 0){
        console.log(player.name + ' defeated ' + enemy.name + '!');
    }
    else{
        console.log(player.name + ' has been defeated by ' + enemy.name + '!');
    }
}

var skeleton2 = new Enemy('Skele Man', 100, 7, 6, 9, 'undead');

var matthew = new Hero('Matthew', 100, 7, 10, 15);

battle(matthew, skeleton1);
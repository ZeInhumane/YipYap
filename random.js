class Hero {
    constructor(name, hp, attack, defense, speed) {
        this.name = name;
        this.hp = hp;
		this.attack = attack;
		this.defense = defense;
		this.speed = speed;
    }

    takeDamage(damage) {
        this.hp -= damage;
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
        this.hp -= damage;
    }
}

function battle(player, enemy) {
    function playerTurn() {
        console.log(player.name + "'s turn!\n" + player.name + " does " + player.attack + " damage!\n");
        enemy.takeDamage(player.attack);
    }

    function enemyTurn() {
        console.log(enemy.name + "'s turn!\n" + enemy.name + " does " + enemy.attack + " damage!\n");
        player.takeDamage(enemy.attack);
    }

    while (!(player.hp < 0) && !(enemy.hp < 0)) {
        if (player.speed > enemy.speed) {
            playerTurn();
            if (enemy.hp > 0) {
                enemyTurn();
            }
            console.log("\n");
        }
        else{
            enemyTurn();
            if(player.hp > 0){
                playerTurn();
            }
            console.log("\n");
        }
    }

    if(player.hp > 0){
        console.log(player.name + " defeated " + enemy.name + "!");
    }
    else{
        console.log(player.name + " has been defeated by " + enemy.name + "!");
    }
}

var skeleton1 = new Enemy("Skele Boy", 10, 2, 1, 3, "undead");

var matthew = new Hero("Matthew", 100, 10, 10, 15);

battle(matthew, skeleton1);
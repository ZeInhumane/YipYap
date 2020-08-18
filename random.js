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

var skeleton1 = new Enemy("Skele Boy", 10, 2, 1, 3, "undead");

var matthew = new Hero("Matthew", 100, 10, 10, 15);

matthew.takeDamage(skeleton1.attack);

console.log(matthew.hp);
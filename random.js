class Hero {
    constructor(HP, attack, defense, speed){
        this.HP = HP;
        this.attack = attack;
        this.speed = speed;
    }

    takeDamage(damage){
        this.HP -= damage;
    }
}

class Enemy {
    constructor(HP, attack, defense, speed, type){
        this.HP = HP;
        this.attack = attack;
        this.defense = defense;
        this.speed = speed;
        this.type = type;
    }

    takeDamage(damage){
        this.HP -= damage;
    }
}
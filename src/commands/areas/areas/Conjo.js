const AreaInterface = require('../AreaInterface.js');

module.exports = class Conjo extends AreaInterface {
    init() {
        this.name = "Conjo";
        this.id = 2;
        this.desc = "Conjo, a place famed for its reflective lakes and beautiful night skies. It is a place of great beauty and wonder, and *death*.";
        this.imageURL = "https://cdn.discordapp.com/attachments/819860035281879040/950316822731833394/Chthonia.jpg";
        // "https://c.tenor.com/3wqv5CpCPbQAAAAC/bisque-doll-bisque.gif"
        this.floors = floors;
    }

    getRandomEnemy(floor) {
        return super.getRandomEnemy(floors[floor]);
    }

    getFloor(floor) {
        return super.getFloor(floor);
    }

    selectFloor(floor) {
        return super.selectFloor(floor);
    }
};

const floors = {
    "1": {
        enemies: [
           "Mountain Troll",
           "Billy",
           "Nanny",
           "Vulture",
           "Goa",
           "Ibex",
           "Chamois",
        ],
        requirement: 0,
        multipliers: {
            "ExpMultiplier": 1,
            "GoldMultiplier": 1,
        },
        buffs: { "hp": 1, "attack": 0.5, "defense": 0.7, "speed": 1.2 },
        rewardDescription: "0% more gold           0% more player experience",
        rewards: {
            jericho: {
                "dropChance": 0.2,
                "minQuantity": 1,
                "maxQuantity": 3,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance : 0,
            equipment: {
                // common equipment set
                "Common": {
                    "dropChance": 80,
                    "drops" : ['Leaf Helmet', 'Leaf Sandals', 'Leaf Shirt', 'Leaf Shorts', 'Razor Leaf'],
                },
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 15,
                    "drops" : ['Camo Helmet', 'Camo Boots', 'Camo Vest', 'Camo Pants', 'Camo Gun'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 5,
                    "drops" : ['Sanke Scale Helmet', 'Squrriel Fur Leggings', 'Spooder Husk', 'Sknuk Fur Shoes', 'Baor Fang'],
                },
            },
            lootbox: {
                "Common Treasure Chest": {
                    "dropChance": 50,
                    "minQuantity": 1,
                    "maxQuantity": 1,
                    "emote": "<:CommonChest:819856620572901387>",
                },
                "Uncommon Treasure Chest": {
                    "dropChance": 1,
                    "minQuantity": 1,
                    "maxQuantity": 1,
                    "emote": "<:UncommonChest:820272834348711976>",
                },
                "Rare Treasure Chest": {
                    "dropChance": 0,
                    "minQuantity": 0,
                    "maxQuantity": 0,
                    "emote": "<:RareChest:820273250629582858>",
                },
                "Epic Treasure Chest": {
                    "dropChance": 0,
                    "minQuantity": 0,
                    "maxQuantity": 0,
                    "emote": "<:EpicChest:820273750289023007>",
                },
                "Legendary Treasure Chest": {
                    "dropChance": 0,
                    "minQuantity": 0,
                    "maxQuantity": 0,
                    "emote": "<:LegendaryChest:820274118817611777>",
                },
                "Mythic Treasure Chest": {
                    "dropChance": 0,
                    "minQuantity": 0,
                    "maxQuantity": 0,
                    "emote": "<:MythicChest:820274344059994122>",
                },
            },
        },
    },
    "2": {
        enemies: [
            "Mountain Troll Captain",
            "Mature Billy",
            "Angry Nanny",
            "Vicious Vulture",
            "Skittish Goa",
            "Strong Ibex",
            "Giant Chamois",
         ],
        requirement: 10,
        multipliers: {
            "ExpMultiplier": 1.2,
            "GoldMultiplier": 1.2,
        },
        buffs: { "hp": 1.9, "attack": 2.5, "defense": 1.8, "speed": 2.5 },
        rewardDescription: "**20% more gold          20% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.2,
                "minQuantity": 2,
                "maxQuantity": 5,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance: 0,
            equipment: {
                // common equipment set
                "Common": {
                    "dropChance": 75,
                    "drops" : ['Leaf Helmet', 'Leaf Sandals', 'Leaf Shirt', 'Leaf Shorts', 'Razor Leaf'],
                },
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 20,
                    "drops" : ['Camo Helmet', 'Camo Boots', 'Camo Vest', 'Camo Pants', 'Camo Gun'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 5,
                    "drops" : ['Sanke Scale Helmet', 'Squrriel Fur Leggings', 'Spooder Husk', 'Sknuk Fur Shoes', 'Baor Fang'],
                },
            },
            lootbox: {
                "Common Treasure Chest": {
                    "dropChance": 55,
                    "minQuantity": 1,
                    "maxQuantity": 2,
                    "emote": "<:CommonChest:819856620572901387>",
                },
                "Uncommon Treasure Chest": {
                    "dropChance": 10,
                    "minQuantity": 1,
                    "maxQuantity": 1,
                    "emote": "<:UncommonChest:820272834348711976>",
                },
                "Rare Treasure Chest": {
                    "dropChance": 1,
                    "minQuantity": 1,
                    "maxQuantity": 1,
                    "emote": "<:RareChest:820273250629582858>",
                },
                "Epic Treasure Chest": {
                    "dropChance": 0,
                    "minQuantity": 0,
                    "maxQuantity": 0,
                    "emote": "<:EpicChest:820273750289023007>",
                },
                "Legendary Treasure Chest": {
                    "dropChance": 0,
                    "minQuantity": 0,
                    "maxQuantity": 0,
                    "emote": "<:LegendaryChest:820274118817611777>",
                },
                "Mythic Treasure Chest": {
                    "dropChance": 0,
                    "minQuantity": 0,
                    "maxQuantity": 0,
                    "emote": "<:MythicChest:820274344059994122>",
                },
            },
        },
    },
    "3": {
        enemies: [
            "Mountain Troll Chief",
            "Leader Billy",
            "Alpha Nanny",
            "Vicious Vulture",
            "Enraged Goa",
            "Rampaging Ibex",
            "Killer Chamois",
         ],
        requirement: 20,
        multipliers: {
            "ExpMultiplier": 1.3,
            "GoldMultiplier": 1.3,
        },
        buffs: { "hp": 3.4, "attack": 3.9, "defense": 2.8, "speed": 3.9 },
        rewardDescription: "**30% more gold          30% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.25,
                "minQuantity": 5,
                "maxQuantity": 10,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance: 0,
            equipment: {
                // common equipment set
                "Common": {
                    "dropChance": 60,
                    "drops" : ['Leaf Helmet', 'Leaf Sandals', 'Leaf Shirt', 'Leaf Shorts', 'Razor Leaf'],
                },
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 35,
                    "drops" : ['Camo Helmet', 'Camo Boots', 'Camo Vest', 'Camo Pants', 'Camo Gun'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 5,
                    "drops" : ['Sanke Scale Helmet', 'Squrriel Fur Leggings', 'Spooder Husk', 'Sknuk Fur Shoes', 'Baor Fang'],
                },
            },
            lootbox: {
                "Common Treasure Chest": {
                    "dropChance": 60,
                    "minQuantity": 1,
                    "maxQuantity": 3,
                    "emote": "<:CommonChest:819856620572901387>",
                },
                "Uncommon Treasure Chest": {
                    "dropChance": 15,
                    "minQuantity": 1,
                    "maxQuantity": 1,
                    "emote": "<:UncommonChest:820272834348711976>",
                },
                "Rare Treasure Chest": {
                    "dropChance": 5,
                    "minQuantity": 1,
                    "maxQuantity": 1,
                    "emote": "<:RareChest:820273250629582858>",
                },
                "Epic Treasure Chest": {
                    "dropChance": 1,
                    "minQuantity": 1,
                    "maxQuantity": 1,
                    "emote": "<:EpicChest:820273750289023007>",
                },
                "Legendary Treasure Chest": {
                    "dropChance": 0,
                    "minQuantity": 0,
                    "maxQuantity": 0,
                    "emote": "<:LegendaryChest:820274118817611777>",
                },
                "Mythic Treasure Chest": {
                    "dropChance": 0,
                    "minQuantity": 0,
                    "maxQuantity": 0,
                    "emote": "<:MythicChest:820274344059994122>",
                },
            },
        },
    },
    "4": {
        enemies: [
            "Silver Bat",
            "Mountain Lion",
            "Lizardman",
            "Giant Catfish",
            "Gorilla",
            "Condor",
         ],
        requirement: 30,
        multipliers: {
            "ExpMultiplier": 1.35,
            "GoldMultiplier": 1.35,
        },
        buffs: { "hp": 5.1, "attack": 5.6, "defense": 4.6, "speed": 5.8 },
        rewardDescription: "**35% more gold          35% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.25,
                "minQuantity": 10,
                "maxQuantity": 20,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance: 0,
            equipment: {
                // common equipment set
                "Common": {
                    "dropChance": 50,
                    "drops" : ['Leaf Helmet', 'Leaf Sandals', 'Leaf Shirt', 'Leaf Shorts', 'Razor Leaf'],
                },
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 40,
                    "drops" : ['Camo Helmet', 'Camo Boots', 'Camo Vest', 'Camo Pants', 'Camo Gun'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 10,
                    "drops" : ['Sanke Scale Helmet', 'Squrriel Fur Leggings', 'Spooder Husk', 'Sknuk Fur Shoes', 'Baor Fang'],
                },
            },
            lootbox: {
                "Common Treasure Chest": {
                    "dropChance": 65,
                    "minQuantity": 1,
                    "maxQuantity": 3,
                    "emote": "<:CommonChest:819856620572901387>",
                },
                "Uncommon Treasure Chest": {
                    "dropChance": 20,
                    "minQuantity": 1,
                    "maxQuantity": 2,
                    "emote": "<:UncommonChest:820272834348711976>",
                },
                "Rare Treasure Chest": {
                    "dropChance": 10,
                    "minQuantity": 1,
                    "maxQuantity": 1,
                    "emote": "<:RareChest:820273250629582858>",
                },
                "Epic Treasure Chest": {
                    "dropChance": 1,
                    "minQuantity": 1,
                    "maxQuantity": 1,
                    "emote": "<:EpicChest:820273750289023007>",
                },
                "Legendary Treasure Chest": {
                    "dropChance": 0,
                    "minQuantity": 0,
                    "maxQuantity": 0,
                    "emote": "<:LegendaryChest:820274118817611777>",
                },
                "Mythic Treasure Chest": {
                    "dropChance": 0,
                    "minQuantity": 0,
                    "maxQuantity": 0,
                    "emote": "<:MythicChest:820274344059994122>",
                },
            },
        },
    },
    "5": {
        enemies: [
            "Golden Bat",
            "Heavenly Lion",
            "Lizardman Captain",
            "King Catfish",
            "Carnivorous Gorilla",
            "CondorSaurus",
         ],
        requirement: 40,
        multipliers: {
            "ExpMultiplier": 1.4,
            "GoldMultiplier": 1.4,
        },
        buffs: { "hp": 6.8, "attack": 7.7, "defense": 6.8, "speed": 7.9 },
        rewardDescription: "**40% more gold          40% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.3,
                "minQuantity": 15,
                "maxQuantity": 25,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance : 0,
            equipment: {
                // common equipment set
                "Common": {
                    "dropChance": 40,
                    "drops" : ['Leaf Helmet', 'Leaf Sandals', 'Leaf Shirt', 'Leaf Shorts', 'Razor Leaf'],
                },
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 45,
                    "drops" : ['Camo Helmet', 'Camo Boots', 'Camo Vest', 'Camo Pants', 'Camo Gun'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 15,
                    "drops" : ['Sanke Scale Helmet', 'Squrriel Fur Leggings', 'Spooder Husk', 'Sknuk Fur Shoes', 'Baor Fang'],
                },
            },
            lootbox: {
                "Common Treasure Chest": {
                    "dropChance": 70,
                    "minQuantity": 1,
                    "maxQuantity": 3,
                    "emote": "<:CommonChest:819856620572901387>",
                },
                "Uncommon Treasure Chest": {
                    "dropChance": 30,
                    "minQuantity": 1,
                    "maxQuantity": 2,
                    "emote": "<:UncommonChest:820272834348711976>",
                },
                "Rare Treasure Chest": {
                    "dropChance": 20,
                    "minQuantity": 1,
                    "maxQuantity": 2,
                    "emote": "<:RareChest:820273250629582858>",
                },
                "Epic Treasure Chest": {
                    "dropChance": 5,
                    "minQuantity": 1,
                    "maxQuantity": 1,
                    "emote": "<:EpicChest:820273750289023007>",
                },
                "Legendary Treasure Chest": {
                    "dropChance": 1,
                    "minQuantity": 1,
                    "maxQuantity": 1,
                    "emote": "<:LegendaryChest:820274118817611777>",
                },
                "Mythic Treasure Chest": {
                    "dropChance": 0,
                    "minQuantity": 0,
                    "maxQuantity": 0,
                    "emote": "<:MythicChest:820274344059994122>",
                },
            },
        },
    },
};
const AreaInterface = require('../AreaInterface.js');

module.exports = class Conjo extends AreaInterface {
    init() {
        this.name = "Conjo";
        this.id = 2;
        this.desc = "Conjo, a place famed for its reflective lakes and beautiful night skies. It is a place of great beauty and wonder, and **death** .";
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
        buffs: { "hp": 1.0, "attack": 0.5, "defense": 0.7, "speed": 1.2 },
        rewardDescription: "0% more gold           0% more player experience",
        rewards: {
            jericho: {
                "dropChance": 0.35,
                "minQuantity": 1,
                "maxQuantity": 20,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance : 0,
            equipment: {
                // common equipment set
                "Common": {
                    "dropChance": 80,
                    "drops" : ["Goat Leather Hat", 'Goat Leather Boots', 'Goat Leather Jacket', 'Goat Leather Pants', 'Sharpened Goat Horn'],
                },
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 15,
                    "drops" : ["Troll's Hat", "Troll's Boots", "Troll's Smock", "Troll's Loincloth", "Troll's Axe"],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 5,
                    "drops" : ['Scale Helmet', 'Scale Faulds', 'Scale Chestplate', 'Lizard Leather Boots', 'Lizardman Spear'],
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
        buffs: { "hp": 1.9, "attack": 2.0, "defense": 1.7, "speed": 2.0 },
        rewardDescription: "**20% more gold          20% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.35,
                "minQuantity": 10,
                "maxQuantity": 25,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance: 0,
            equipment: {
                // common equipment set
                "Common": {
                    "dropChance": 75,
                    "drops" : ['Goat Leather Hat', 'Goat Leather Boots', 'Goat Leather Jacket', 'Goat Leather Pants', 'Sharpened Goat Horn'],
                },
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 20,
                    "drops" : ["Troll's Hat", "Troll's Boots", "Troll's Smock", "Troll's Loincloth", "Troll's Axe"],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 5,
                    "drops" : ['Scale Helmet', 'Scale Faulds', 'Scale Chestplate', 'Lizard Leather Boots', 'Lizardman Spear'],
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
        buffs: { "hp": 2.5, "attack": 2.1, "defense": 2.4, "speed": 2.1 },
        rewardDescription: "**30% more gold          30% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.35,
                "minQuantity": 15,
                "maxQuantity": 40,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance: 0,
            equipment: {
                // common equipment set
                "Common": {
                    "dropChance": 60,
                    "drops" : ['Goat Leather Hat', 'Goat Leather Boots', 'Goat Leather Jacket', 'Goat Leather Pants', 'Sharpened Goat Horn'],
                },
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 35,
                    "drops" : ["Troll's Hat", "Troll's Boots", "Troll's Smock", "Troll's Loincloth", "Troll's Axe"],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 5,
                    "drops" : ['Scale Helmet', 'Scale Faulds', 'Scale Chestplate', 'Lizard Leather Boots', 'Lizardman Spear'],
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
        buffs: { "hp": 2.5, "attack": 2.4, "defense": 2.3, "speed": 2.9 },
        rewardDescription: "**35% more gold          35% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.35,
                "minQuantity": 30,
                "maxQuantity": 50,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance: 0,
            equipment: {
                // common equipment set
                "Common": {
                    "dropChance": 50,
                    "drops" : ['Goat Leather Hat', 'Goat Leather Boots', 'Goat Leather Jacket', 'Goat Leather Pants', 'Sharpened Goat Horn'],
                },
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 40,
                    "drops" : ["Troll's Hat", "Troll's Boots", "Troll's Smock", "Troll's Loincloth", "Troll's Axe"],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 10,
                    "drops" : ['Scale Helmet', 'Scale Faulds', 'Scale Chestplate', 'Lizard Leather Boots', 'Lizardman Spear'],
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
        buffs: { "hp": 2.7, "attack": 2.6, "defense": 2.8, "speed": 2.6 },
        rewardDescription: "**40% more gold          40% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.35,
                "minQuantity": 40,
                "maxQuantity": 80,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance : 0,
            equipment: {
                // common equipment set
                "Common": {
                    "dropChance": 40,
                    "drops" : ['Goat Leather Hat', 'Goat Leather Boots', 'Goat Leather Jacket', 'Goat Leather Pants', 'Sharpened Goat Horn'],
                },
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 45,
                    "drops" : ["Troll's Hat", "Troll's Boots", "Troll's Smock", "Troll's Loincloth", "Troll's Axe"],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 15,
                    "drops" : ['Scale Helmet', 'Scale Faulds', 'Scale Chestplate', 'Lizard Leather Boots', 'Lizardman Spear'],
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
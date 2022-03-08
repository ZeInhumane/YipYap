const AreaInterface = require('../AreaInterface.js');

module.exports = class Luarndis extends AreaInterface {
    init() {
        this.name = "Luarndis";
        this.id = 3;
        this.desc = "The forest of Luarndis is said to hold many secrets. An old tale tells of the magical land of fairies deep within the forest leading many explorers to venture into the forest, where they either returned disappointed... or were never seen again.";
        this.imageURL = "https://cdn.discordapp.com/attachments/819860035281879040/950324030517420042/Luarndis.jpg";
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
            "Sanke",
            "Baor",
            "Squrriel",
            "Rcacoon",
            "Sknuk",
            "Spooder",
        ],
        requirement: 0,
        multipliers: {
            "ExpMultiplier": 1,
            "GoldMultiplier": 1,
        },
        buffs: { "hp": 1.1, "attack": 1.2, "defense": 1.1, "speed": 1 },
        rewardDescription: "0% more gold           0% more player experience",
        rewards: {
            jericho: {
                "dropChance": 0.2,
                "minQuantity": 1,
                "maxQuantity": 3,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipment: {
                equipDropChance : 0.1,
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
            "Venomous Sanke",
            "Vicious Baor",
            "Giant Squrriel",
            "Hangry Rcacoon",
            "Poison Sknuk",
            "Enraged Spooder",
        ],
        requirement: 10,
        multipliers: {
            "ExpMultiplier": 1.2,
            "GoldMultiplier": 1.2,
        },
        buffs: { "hp": 1.3, "attack": 1.2, "defense": 1.2, "speed": 1.1 },
        rewardDescription: "**20% more gold          20% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.2,
                "minQuantity": 2,
                "maxQuantity": 5,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipment: {
                equipDropChance : 0.15,
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
            "Venomous Sanke King",
            "Vicious Baor King",
            "Giant Squrriel Boss",
            "Armed Rcacoon",
            "Poison Sknuk King",
            "Spooder Queen",
        ],
        requirement: 20,
        multipliers: {
            "ExpMultiplier": 1.3,
            "GoldMultiplier": 1.3,
        },
        buffs: { "hp": 1.3, "attack": 1.5, "defense": 1.2, "speed": 1 },
        rewardDescription: "**30% more gold          30% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.25,
                "minQuantity": 5,
                "maxQuantity": 10,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipment: {
                equipDropChance : 0.2,
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
            "Moving Ghost Oak",
            "Bewiching Fireflies",
            "Fiendish Owl",
            "Giant Maggot",
            "Swift Tiger",
            "Poison Dart Frog",
        ],
        requirement: 30,
        multipliers: {
            "ExpMultiplier": 1.35,
            "GoldMultiplier": 1.35,
        },
        buffs: { "hp": 1.4, "attack": 1.5, "defense": 1.4, "speed": 1.5 },
        rewardDescription: "**35% more gold          35% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.25,
                "minQuantity": 10,
                "maxQuantity": 20,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipment: {
                equipDropChance : 0.25,
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
            "Ghost Oak Ruler",
            "Firefly Queen",
            "Owl Lord",
            "Giant Maggot Swarm",
            "Wild Wind Tiger",
            "Poison Flaming Dart Frog",
        ],
        requirement: 40,
        multipliers: {
            "ExpMultiplier": 1.4,
            "GoldMultiplier": 1.4,
        },
        buffs: { "hp": 1.6, "attack": 1.6, "defense": 1.5, "speed": 1.7 },
        rewardDescription: "**40% more gold          40% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.3,
                "minQuantity": 15,
                "maxQuantity": 25,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipment: {
                equipDropChance : 0.25,
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
const AreaInterface = require('../AreaInterface.js');

module.exports = class Ludus extends AreaInterface {
    init() {
        this.name = "Ludus";
        this.id = 3;
        this.desc = "Ludus is a planet in OASIS created by Gregarious Simulation Systems.";
        this.imageURL = "https://images-ext-2.discordapp.net/external/F7xqcqspkS2UWHkSyHjzdbkZzQmdEY1rdC5FHJX27As/%3Fcb%3D20180716235143/https/static.wikia.nocookie.net/readyplayerone/images/9/97/807F9314-80C9-404C-9836-B3D2CDC745BC.jpeg/revision/latest/scale-to-width-down/1000";
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
            "BRo",
            "Brotat f. Raejasesh koorthrapoalo",
            "SIs",
        ],
        requirement: 10,
        multipliers: {
            "ExpMultiplier": 1,
            "GoldMultiplier": 1,
        },
        buffs: { "hp": 1.1, "attack": 1.2, "defense": 1.1, "speed": 1 },
        rewardDescription: "0% more gold           0% more player experience",
        rewards: {
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
            "BRo",
            "Brotat f. Raejasesh koorthrapoalo",
            "SIs",
        ],
        requirement: 20,
        multipliers: {
            "ExpMultiplier": 1,
            "GoldMultiplier": 1,
        },
        buffs: { "hp": 1.1, "attack": 1.2, "defense": 1.1, "speed": 1 },
        rewardDescription: "0% more gold           0% more player experience",
        rewards: {
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
    "3": {
        enemies: [
            "BRo",
            "Brotat f. Raejasesh koorthrapoalo",
            "SIs",
        ],
        requirement: 30,
        multipliers: {
            "ExpMultiplier": 1,
            "GoldMultiplier": 1,
        },
        buffs: { "hp": 1.1, "attack": 1.2, "defense": 1.1, "speed": 1 },
        rewardDescription: "0% more gold           0% more player experience",
        rewards: {
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
};
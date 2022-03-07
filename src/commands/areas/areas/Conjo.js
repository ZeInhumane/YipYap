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
            "BRo",
            "Brotat f. Raejasesh koorthrapoalo",
            "SIs",
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
        requirement: 10,
        multipliers: {
            "ExpMultiplier": 1.2,
            "GoldMultiplier": 1.2,
        },
        buffs: { "hp": 1.1, "attack": 1.2, "defense": 1.1, "speed": 1 },
        rewardDescription: "**20% more gold          20% more player experience**",
        rewards: {
            jericho: { 
                "dropChance": 0.2,
                "minQuantity": 2,
                "maxQuantity": 5,
                "emote": "<:Jericho:823551572029603840>",
            },
            lootbox: {
                "Common Treasure Chest": {
                    "dropChance": 55,
                    "minQuantity": 1,
                    "maxQuantity": 2,
                    "emote": "<:CommonChest:819856620572901387>"
                },
                "Uncommon Treasure Chest": {
                    "dropChance": 10,
                    "minQuantity": 1,
                    "maxQuantity": 1,
                    "emote": "<:UncommonChest:820272834348711976>"
                },
                "Rare Treasure Chest": {
                    "dropChance": 1,
                    "minQuantity": 1,
                    "maxQuantity": 1,
                    "emote": "<:RareChest:820273250629582858>"
                },
                "Epic Treasure Chest": {
                    "dropChance": 0,
                    "minQuantity": 0,
                    "maxQuantity": 0,
                    "emote": "<:EpicChest:820273750289023007>"
                },
                "Legendary Treasure Chest": {
                    "dropChance": 0,
                    "minQuantity": 0,
                    "maxQuantity": 0,
                    "emote": "<:LegendaryChest:820274118817611777>"
                },
                "Mythic Treasure Chest": {
                    "dropChance": 0,
                    "minQuantity": 0,
                    "maxQuantity": 0,
                    "emote": "<:MythicChest:820274344059994122>"
                }
            },
        },
    },
    "3": {
        enemies: [
            "BRo",
            "Brotat f. Raejasesh koorthrapoalo",
            "SIs",
        ],
        requirement: 20,
        multipliers: {
            "ExpMultiplier": 1.3,
            "GoldMultiplier": 1.3,
        },
        buffs: { "hp": 1.1, "attack": 1.2, "defense": 1.1, "speed": 1 },
        rewardDescription: "**30% more gold          30% more player experience**",
        rewards: {
            jericho: { 
                "dropChance": 0.25,
                "minQuantity": 5,
                "maxQuantity": 10,
                "emote": "<:Jericho:823551572029603840>",
            },
            lootbox: {
                "Common Treasure Chest": {
                    "dropChance": 60,
                    "minQuantity": 1,
                    "maxQuantity": 3,
                    "emote": "<:CommonChest:819856620572901387>"
                },
                "Uncommon Treasure Chest": {
                    "dropChance": 15,
                    "minQuantity": 1,
                    "maxQuantity": 1,
                    "emote": "<:UncommonChest:820272834348711976>"
                },
                "Rare Treasure Chest": {
                    "dropChance": 5,
                    "minQuantity": 1,
                    "maxQuantity": 1,
                    "emote": "<:RareChest:820273250629582858>"
                },
                "Epic Treasure Chest": {
                    "dropChance": 1,
                    "minQuantity": 1,
                    "maxQuantity": 1,
                    "emote": "<:EpicChest:820273750289023007>"
                },
                "Legendary Treasure Chest": {
                    "dropChance": 0,
                    "minQuantity": 0,
                    "maxQuantity": 0,
                    "emote": "<:LegendaryChest:820274118817611777>"
                },
                "Mythic Treasure Chest": {
                    "dropChance": 0,
                    "minQuantity": 0,
                    "maxQuantity": 0,
                    "emote": "<:MythicChest:820274344059994122>"
                }
            },
        },
    },
};
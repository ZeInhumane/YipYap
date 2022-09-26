const AreaInterface = require('../AreaInterface.js');

module.exports = class Xeminos extends AreaInterface {
    init() {
        this.name = "Xeminos";
        this.desc = "Jericho Jehammad has been revered as the most influential idol and influence in recent years. There have been many rumours surrounding where he is. An anonymous tip warned of the Xeminos Factory, 'Beware of the Xeminos Factory, Inhumane'.";
        this.id = 4;
        this.imageURL = "https://cdn.discordapp.com/attachments/819860035281879040/955817839422480414/Xeminos.jpg";
        this.floors = floors;
        this.credits = "https://unsplash.com/s/photos/steel-factory";
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
            "Maintenance Robot",
            "Cleaner Robot",
            "Lazer Floor",
            "RoBot",
            "BOB",
            "IFone",
        ],
        requirement: 20,
        multipliers: {
            "ExpMultiplier": 1.2,
            "GoldMultiplier": 1.2,
        },
        buffs: { "hp": 2.5, "attack": 2.5, "defense": 2.5, "speed": 2.5 },
        rewardDescription: "20% more gold           20% more player experience",
        rewards: {
            jericho: {
                "dropChance": 0.30,
                "minQuantity": 15,
                "maxQuantity": 40,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance : 0.2,
            equipment: {
                // common equipment set
                "Common": {
                    "dropChance": 80,
                    "drops" : ['Burnt Metal Bucket', 'Broken Leather Boot', 'Scrap Metal Plate', 'Charred Shorts', 'Metal Bat'],
                },
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 15,
                    "drops" : ['RoBot Head', 'RoBot Feet', 'RoBot Chest', 'RoBot Legs', 'RoBot Hand'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 5,
                    "drops" : ['High-Tech Goggles', 'Mechanical Legs', 'Mechanical Core', 'Mechanical Feet', 'Mechanical Arms'],
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
    "2": {
        enemies: [
            "Maintenance Robot Mk2",
            "Cleaner Robot Mk3",
            "Blue Lazer Floor",
            "Upgraded RoBot",
            "Sophia",
            "IFone Pro",
        ],
        requirement: 30,
        multipliers: {
            "ExpMultiplier": 1.3,
            "GoldMultiplier": 1.3,
        },
        buffs: { "hp": 2.8, "attack": 2.8, "defense": 2.8, "speed": 2.8 },
        rewardDescription: "**30% more gold          30% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.30,
                "minQuantity": 30,
                "maxQuantity": 50,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance: 0.2,
            equipment: {
                // common equipment set
                "Common": {
                    "dropChance": 75,
                    "drops" : ['Burnt Metal Bucket', 'Broken Leather Boot', 'Scrap Metal Plate', 'Charred Shorts', 'Metal Bat'],
                },
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 20,
                    "drops" : ['RoBot Head', 'RoBot Feet', 'RoBot Chest', 'RoBot Legs', 'RoBot Hand'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 5,
                    "drops" : ['High-Tech Goggles', 'Mechanical Legs', 'Mechanical Core', 'Mechanical Feet', 'Mechanical Arms'],
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
    "3": {
        enemies: [
            "Maintenance Robot Mk3",
            "Cleaner Robot Mk5",
            "Invisible Lazer Floor",
            "Task Manager",
            "Siri",
            "IFone Pro Max",
        ],
        requirement: 35,
        multipliers: {
            "ExpMultiplier": 1.3,
            "GoldMultiplier": 1.3,
        },
        buffs: { "hp": 3.2, "attack": 3.2, "defense": 3.2, "speed": 3.2 },
        rewardDescription: "**30% more gold          30% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.30,
                "minQuantity": 40,
                "maxQuantity": 80,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance: 0.2,
            equipment: {
                // common equipment set
                "Common": {
                    "dropChance": 60,
                    "drops" : ['Burnt Metal Bucket', 'Broken Leather Boot', 'Scrap Metal Plate', 'Charred Shorts', 'Metal Bat'],
                },
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 35,
                    "drops" : ['RoBot Head', 'RoBot Feet', 'RoBot Chest', 'RoBot Legs', 'RoBot Hand'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 5,
                    "drops" : ['High-Tech Goggles', 'Mechanical Legs', 'Mechanical Core', 'Mechanical Feet', 'Mechanical Arms'],
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
    "4": {
        enemies: [
            "Unusual Artificial Eyes",
            "Mechnaical Legs",
            "Mechanical Arms",
            "UR-MOM",
            "Alexa",
            "IFone Pro Max Ultra",
        ],
        requirement: 40,
        multipliers: {
            "ExpMultiplier": 1.3,
            "GoldMultiplier": 1.3,
        },
        buffs: { "hp": 3.5, "attack": 3.5, "defense": 3.5, "speed": 3.5 },
        rewardDescription: "**30% more gold          30% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.30,
                "minQuantity": 50,
                "maxQuantity": 90,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance: 0.2,
            equipment: {
                // common equipment set
                "Common": {
                    "dropChance": 50,
                    "drops" : ['Burnt Metal Bucket', 'Broken Leather Boot', 'Scrap Metal Plate', 'Charred Shorts', 'Metal Bat'],
                },
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 40,
                    "drops" : ['RoBot Head', 'RoBot Feet', 'RoBot Chest', 'RoBot Legs', 'RoBot Hand'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 10,
                    "drops" : ['High-Tech Goggles', 'Mechanical Legs', 'Mechanical Core', 'Mechanical Feet', 'Mechanical Arms'],
                },
            },
            lootbox: {
                "Common Treasure Chest": {
                    "dropChance": 70,
                    "minQuantity": 2,
                    "maxQuantity": 5,
                    "emote": "<:CommonChest:819856620572901387>",
                },
                "Uncommon Treasure Chest": {
                    "dropChance": 30,
                    "minQuantity": 1,
                    "maxQuantity": 3,
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
    "5": {
        enemies: [
            "Corrupted Robot",
            "Security Robot ",
            "Robo Dog mk2",
            "Dr. Octolegs",
            "Robo Corp",
            "IFone Pro Max Ultra Extreme",
        ],
        requirement: 45,
        multipliers: {
            "ExpMultiplier": 1.2,
            "GoldMultiplier": 1.2,
        },
        buffs: { "hp": 4.0, "attack": 4.0, "defense": 4.0, "speed": 4.0 },
        rewardDescription: "**20% more gold          20% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.30,
                "minQuantity": 60,
                "maxQuantity": 100,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance : 0.2,
            equipment: {
                // common equipment set
                "Common": {
                    "dropChance": 40,
                    "drops" : ['Burnt Metal Bucket', 'Broken Leather Boot', 'Scrap Metal Plate', 'Charred Shorts', 'Metal Bat'],
                },
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 45,
                    "drops" : ['RoBot Head', 'RoBot Feet', 'RoBot Chest', 'RoBot Legs', 'RoBot Hand'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 15,
                    "drops" : ['High-Tech Goggles', 'Mechanical Legs', 'Mechanical Core', 'Mechanical Feet', 'Mechanical Arms'],
                },
            },
            lootbox: {
                "Common Treasure Chest": {
                    "dropChance": 65,
                    "minQuantity": 2,
                    "maxQuantity": 5,
                    "emote": "<:CommonChest:819856620572901387>",
                },
                "Uncommon Treasure Chest": {
                    "dropChance": 35,
                    "minQuantity": 1,
                    "maxQuantity": 3,
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
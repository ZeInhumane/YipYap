const AreaInterface = require('../AreaInterface.js');

module.exports = class Grimrad extends AreaInterface {
    init() {
        this.name = "Grimrad";
        this.desc = "Taking 'THE FLOOR IS LAVAAAAA' to a whole new meaning. The smoldering heat rising from the ground is almost unbearable. Everything is on fire, and the floor is littered with bones and ash. The lava glow lights up floor, flame sparks light up the night skies. If the old man in the previous city didn't insist on the existence of a powerful ancient treasure here, there's no way I would have come here!";
        this.id = 8;
        this.imageURL = "https://cdn.discordapp.com/attachments/819860035281879040/957227332278550578/Grimrad.jpg";
        this.floors = floors;
        this.credits = "https://www.deviantart.com/artdesk/art/Forbidden-City-of-the-Frozen-Lava-Version-606827970";
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
            "Lava Ball",
            "Magma Boulder",
            "Lava Slime",
            "Fire Salamander",
            "Magma Snail",
            "Flame Serpent",
        ],
        requirement: 20,
        multipliers: {
            "ExpMultiplier": 1.3,
            "GoldMultiplier": 1.3,
        },
        buffs: { "hp": 2.6, "attack": 3.7, "defense": 3.7, "speed": 2.0 },
        rewardDescription: "30% more gold           30% more player experience",
        rewards: {
            jericho: {
                "dropChance": 0.35,
                "minQuantity": 1,
                "maxQuantity": 20,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance : 0,
            equipment: {
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 80,
                    "drops" : ['Flame Gas Mask', 'Flame Boots', 'Flame Chestplate', 'Flame Pants', 'Flame Whip'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 15,
                    "drops" : ['Magma Gas Mask', 'Magma Boots', 'Magma Chestplate', 'Magma Pants', 'Magma Whip'],
                },
                // epic equipment set
                "Epic": {
                    "dropChance": 5,
                    "drops" : ['GLHF Helmet', 'GLHF Boots', 'GLHF Chestplate', 'GLHF Pants', 'GLHF Whip'],
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
    "2": {
        enemies: [
            "Flame Horse",
            "Fire Bird",
            "XXL Magma Boulder",
            "Large Fire Slime",
            "Huge Fire Salamnder",
            "XL Magma Snail",
        ],
        requirement: 30,
        multipliers: {
            "ExpMultiplier": 1.35,
            "GoldMultiplier": 1.35,
        },
        buffs: { "hp": 3.1, "attack": 4.2, "defense": 4.2, "speed": 2.5 },
        rewardDescription: "**35% more gold          35% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.35,
                "minQuantity": 10,
                "maxQuantity": 25,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance: 0,
            equipment: {
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 75,
                    "drops" : ['Flame Gas Mask', 'Flame Boots', 'Flame Chestplate', 'Flame Pants', 'Flame Whip'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 20,
                    "drops" : ['Magma Gas Mask', 'Magma Boots', 'Magma Chestplate', 'Magma Pants', 'Magma Whip'],
                },
                // epic equipment set
                "Epic": {
                    "dropChance": 5,
                    "drops" : ['GLHF Helmet', 'GLHF Boots', 'GLHF Chestplate', 'GLHF Pants', 'GLHF Whip'],
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
    "3": {
        enemies: [
            "Flame Serpent King",
            "King Fire Slime",
            "Flame Horse herd",
            "Fire Bird Empress",
            "Magma Golem",
            "Cherufe",
        ],
        requirement: 40,
        multipliers: {
            "ExpMultiplier": 1.4,
            "GoldMultiplier": 1.4,
        },
        buffs: { "hp": 3.6, "attack": 4.7, "defense": 4.7, "speed": 3.0 },
        rewardDescription: "**40% more gold          40% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.35,
                "minQuantity": 15,
                "maxQuantity": 40,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance: 0,
            equipment: {
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 60,
                    "drops" : ['Flame Gas Mask', 'Flame Boots', 'Flame Chestplate', 'Flame Pants', 'Flame Whip'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 35,
                    "drops" : ['Magma Gas Mask', 'Magma Boots', 'Magma Chestplate', 'Magma Pants', 'Magma Whip'],
                },
                // epic equipment set
                "Epic": {
                    "dropChance": 5,
                    "drops" : ['GLHF Helmet', 'GLHF Boots', 'GLHF Chestplate', 'GLHF Pants', 'GLHF Whip'],
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
    "4": {
        enemies: [
            "Group of Magma Golems",
            "Grimrad Lower House Forge Dwarfs",
            "Grimrad Lower House Forge Fire Giants",
            "Grimrad Lower House Forge Flame Trolls",
            "Grimrad Lower House Forge Flare Gomes",
            "Hellhound",
        ],
        requirement: 50,
        multipliers: {
            "ExpMultiplier": 1.45,
            "GoldMultiplier": 1.45,
        },
        buffs: { "hp": 4.6, "attack": 5.7, "defense": 5.7, "speed": 4.0 },
        rewardDescription: "**45% more gold          45% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.35,
                "minQuantity": 30,
                "maxQuantity": 50,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance: 0,
            equipment: {
                 // uncommon equipment set
                 "Uncommon": {
                    "dropChance": 50,
                    "drops" : ['Flame Gas Mask', 'Flame Boots', 'Flame Chestplate', 'Flame Pants', 'Flame Whip'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 40,
                    "drops" : ['Magma Gas Mask', 'Magma Boots', 'Magma Chestplate', 'Magma Pants', 'Magma Whip'],
                },
                // epic equipment set
                "Epic": {
                    "dropChance": 10,
                    "drops" : ['GLHF Helmet', 'GLHF Boots', 'GLHF Chestplate', 'GLHF Pants', 'GLHF Whip'],
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
    "5": {
        enemies: [
            "Cimera",
            "Phoenix",
            "Magma Dragon",
            "Hellhound Pack",
            "Jinn",
            "Grimrad Lower House Forge Chief",
        ],
        requirement: 60,
        multipliers: {
            "ExpMultiplier": 1.5,
            "GoldMultiplier": 1.5,
        },
        buffs: { "hp": 5.6, "attack": 6.7, "defense": 6.7, "speed": 5.0 },
        rewardDescription: "**50% more gold          50% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.35,
                "minQuantity": 40,
                "maxQuantity": 80,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance : 0,
            equipment: {
                 // uncommon equipment set
                 "Uncommon": {
                    "dropChance": 40,
                    "drops" : ['Flame Gas Mask', 'Flame Boots', 'Flame Chestplate', 'Flame Pants', 'Flame Whip'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 45,
                    "drops" : ['Magma Gas Mask', 'Magma Boots', 'Magma Chestplate', 'Magma Pants', 'Magma Whip'],
                },
                // epic equipment set
                "Epic": {
                    "dropChance": 15,
                    "drops" : ['GLHF Helmet', 'GLHF Boots', 'GLHF Chestplate', 'GLHF Pants', 'GLHF Whip'],
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
                    "dropChance": 40,
                    "minQuantity": 1,
                    "maxQuantity": 3,
                    "emote": "<:UncommonChest:820272834348711976>",
                },
                "Rare Treasure Chest": {
                    "dropChance": 25,
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
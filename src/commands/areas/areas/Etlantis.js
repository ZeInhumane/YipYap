const AreaInterface = require('../AreaInterface.js');

module.exports = class Etlantis extends AreaInterface {
    init() {
        this.name = "Etlantis";
        this.desc = "**Caution level 5 has a high difficulty!\nThe lost city of Etlantis. Who knew relaxing on the beach would get you kidnaped to the legendary lost city? Nows not the time to marvel at the beauty of the city, I must find a way out before _THEY_  find me!";
        this.id = 6;
        this.imageURL = "https://cdn.discordapp.com/attachments/819860035281879040/956045789023600650/Etlantis.jpg";
        this.floors = floors;
        this.credits = "https://www.artstation.com/artwork/mvPwa";
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
            "Sardine",
            "Sea Horse",
            "Redfish",
            "Clownfish",
            "Stripped Bass",
            "Blue Fish",
        ],
        requirement: 50,
        multipliers: {
            "ExpMultiplier": 1.3,
            "GoldMultiplier": 1.4,
        },
        buffs: { "hp": 3.5, "attack": 4.3, "defense": 4.0, "speed": 4.6 },
        rewardDescription: "30% more gold           40% more player experience",
        rewards: {
            jericho: {
                "dropChance": 0.35,
                "minQuantity": 60,
                "maxQuantity": 100,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance : 0.2,
            equipment: {
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 80,
                    "drops" : ['Watermelon Rind', 'Sandy Slippers', 'Sleeveless T-shirt', 'Surf Pants', 'Surf Board'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 15,
                    "drops" : ['Seaweed', 'Woven Seaweed', 'Seaweed Dress', 'Seaweed Dress Skirt', 'Hard Coral'],
                },
                // epic equipment set
                "Epic": {
                    "dropChance": 5,
                    "drops" : ['Mermaid Wig', 'Mermaid Tail', 'Shell Bra', 'Mermaid Tail Fins', 'Mermaid Staff'],
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
    "2": {
        enemies: [
            "Grouper",
            "Tuna",
            "Pacific Halibut",
            "King Salmon",
            "Bristlemouth",
            "Reef Shark",
        ],
        requirement: 55,
        multipliers: {
            "ExpMultiplier": 1.3,
            "GoldMultiplier": 1.4,
        },
        buffs: { "hp": 4.0, "attack": 4.8, "defense": 4.5, "speed": 5.1 },
        rewardDescription: "**30% more gold          40% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.35,
                "minQuantity": 65,
                "maxQuantity": 100,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance: 0.2,
            equipment: {
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 75,
                    "drops" : ['Watermelon Rind', 'Sandy Slippers', 'Sleeveless T-shirt', 'Surf Pants', 'Surf Board'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 20,
                    "drops" : ['Seaweed', 'Woven Seaweed', 'Seaweed Dress', 'Seaweed Dress Skirt', 'Hard Coral'],
                },
                // epic equipment set
                "Epic": {
                    "dropChance": 5,
                    "drops" : ['Mermaid Wig', 'Mermaid Tail', 'Shell Bra', 'Mermaid Tail Fins', 'Mermaid Staff'],
                },
            },
            lootbox: {
                "Common Treasure Chest": {
                    "dropChance": 55,
                    "minQuantity": 2,
                    "maxQuantity": 5,
                    "emote": "<:CommonChest:819856620572901387>",
                },
                "Uncommon Treasure Chest": {
                    "dropChance": 45,
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
    "3": {
        enemies: [
            "Great White Shark",
            "Lion Fish",
            "Killer Whale",
            "Pufferfish",
            "Jellyfish",
            "Hammerhead Shark",
        ],
        requirement: 60,
        multipliers: {
            "ExpMultiplier": 1.3,
            "GoldMultiplier": 1.4,
        },
        buffs: { "hp": 4.5, "attack": 5.3, "defense": 5.0, "speed": 5.6 },
        rewardDescription: "**30% more gold          40% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.35,
                "minQuantity": 65,
                "maxQuantity": 120,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance: 0.2,
            equipment: {
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 60,
                    "drops" : ['Watermelon Rind', 'Sandy Slippers', 'Sleeveless T-shirt', 'Surf Pants', 'Surf Board'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 35,
                    "drops" : ['Seaweed', 'Woven Seaweed', 'Seaweed Dress', 'Seaweed Dress Skirt', 'Hard Coral'],
                },
                // epic equipment set
                "Epic": {
                    "dropChance": 5,
                    "drops" : ['Mermaid Wig', 'Mermaid Tail', 'Shell Bra', 'Mermaid Tail Fins', 'Mermaid Staff'],
                },
            },
            lootbox: {
                "Common Treasure Chest": {
                    "dropChance": 50,
                    "minQuantity": 2,
                    "maxQuantity": 5,
                    "emote": "<:CommonChest:819856620572901387>",
                },
                "Uncommon Treasure Chest": {
                    "dropChance": 55,
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
            "Merman",
            "Mermaid",
            "Fishman Guard",
            "Seal",
            "Dolphin",
            "Blue Whale",
        ],
        requirement: 65,
        multipliers: {
            "ExpMultiplier": 1.3,
            "GoldMultiplier": 1.4,
        },
        buffs: { "hp": 5.0, "attack": 5.8, "defense": 5.5, "speed": 6.1 },
        rewardDescription: "**30% more gold          40% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.35,
                "minQuantity": 65,
                "maxQuantity": 130,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance: 0.2,
            equipment: {
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 50,
                    "drops" : ['Watermelon Rind', 'Sandy Slippers', 'Sleeveless T-shirt', 'Surf Pants', 'Surf Board'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 40,
                    "drops" : ['Seaweed', 'Woven Seaweed', 'Seaweed Dress', 'Seaweed Dress Skirt', 'Hard Coral'],
                },
                // epic equipment set
                "Epic": {
                    "dropChance": 10,
                    "drops" : ['Mermaid Wig', 'Mermaid Tail', 'Shell Bra', 'Mermaid Tail Fins', 'Mermaid Staff'],
                },
            },
            lootbox: {
                "Common Treasure Chest": {
                    "dropChance": 40,
                    "minQuantity": 2,
                    "maxQuantity": 5,
                    "emote": "<:CommonChest:819856620572901387>",
                },
                "Uncommon Treasure Chest": {
                    "dropChance": 65,
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
            "Fishman Guard Patrol",
            "Merman Guard",
            "Mermaid Priestess",
            "Dolphin Rider",
            "Seal Dancer",
            "Grey Whale",
        ],
        requirement: 80,
        multipliers: {
            "ExpMultiplier": 1.5,
            "GoldMultiplier": 1.5,
        },
        buffs: { "hp": 7.7, "attack": 7.7, "defense": 7.7, "speed": 7.7 },
        rewardDescription: "**50% more gold          50% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.5,
                "minQuantity": 120,
                "maxQuantity": 450,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance : 0.2,
            equipment: {
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 30,
                    "drops" : ['Watermelon Rind', 'Sandy Slippers', 'Sleeveless T-shirt', 'Surf Pants', 'Surf Board'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 30,
                    "drops" : ['Seaweed', 'Woven Seaweed', 'Seaweed Dress', 'Seaweed Dress Skirt', 'Hard Coral'],
                },
                // epic equipment set
                "Epic": {
                    "dropChance": 40,
                    "drops" : ['Mermaid Wig', 'Mermaid Tail', 'Shell Bra', 'Mermaid Tail Fins', 'Mermaid Staff'],
                },
            },
            lootbox: {
                "Common Treasure Chest": {
                    "dropChance": 20,
                    "minQuantity": 3,
                    "maxQuantity": 8,
                    "emote": "<:CommonChest:819856620572901387>",
                },
                "Uncommon Treasure Chest": {
                    "dropChance": 40,
                    "minQuantity": 2,
                    "maxQuantity": 5,
                    "emote": "<:UncommonChest:820272834348711976>",
                },
                "Rare Treasure Chest": {
                    "dropChance": 40,
                    "minQuantity": 1,
                    "maxQuantity": 3,
                    "emote": "<:RareChest:820273250629582858>",
                },
                "Epic Treasure Chest": {
                    "dropChance": 10,
                    "minQuantity": 1,
                    "maxQuantity": 1,
                    "emote": "<:EpicChest:820273750289023007>",
                },
                "Legendary Treasure Chest": {
                    "dropChance": 3,
                    "minQuantity": 1,
                    "maxQuantity": 1,
                    "emote": "<:LegendaryChest:820274118817611777>",
                },
                "Mythic Treasure Chest": {
                    "dropChance": 1,
                    "minQuantity": 1,
                    "maxQuantity": 1,
                    "emote": "<:MythicChest:820274344059994122>",
                },
            },
        },
    },
};
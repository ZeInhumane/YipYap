const AreaInterface = require('../AreaInterface.js');

module.exports = class Etlantis extends AreaInterface {
    init() {
        this.name = "Etlantis";
        this.desc = "The lost city of Etlantis. Who knew relaxing on the beach would get you kidnaped to the legendary lost city? Nows not the time to marvel at the beauty of the city, I must find a way out before _THEY_  find me!";
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
        requirement: 20,
        multipliers: {
            "ExpMultiplier": 1.3,
            "GoldMultiplier": 1.3,
        },
        buffs: { "hp": 2.2, "attack": 3.5, "defense": 2.8, "speed": 3.5 },
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
            "Grouper",
            "Tuna",
            "Pacific Halibut",
            "King Salmon",
            "Bristlemouth",
            "Reef Shark",
        ],
        requirement: 30,
        multipliers: {
            "ExpMultiplier": 1.35,
            "GoldMultiplier": 1.35,
        },
        buffs: { "hp": 2.7, "attack": 4.0, "defense": 3.3, "speed": 4.0 },
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
            "Great White Shark",
            "Lion Fish",
            "Killer Whale",
            "Pufferfish",
            "Jellyfish",
            "Hammerhead Shark",
        ],
        requirement: 40,
        multipliers: {
            "ExpMultiplier": 1.4,
            "GoldMultiplier": 1.4,
        },
        buffs: { "hp": 3.2, "attack": 4.5, "defense": 3.8, "speed": 4.5 },
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
            "Merman",
            "Mermaid",
            "Fishman Guard",
            "Seal",
            "Dolphin",
            "Blue Whale",
        ],
        requirement: 50,
        multipliers: {
            "ExpMultiplier": 1.45,
            "GoldMultiplier": 1.45,
        },
        buffs: { "hp": 4.2, "attack": 5.5, "defense": 4.8, "speed": 5.5 },
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
            "Fishman Guard Patrol",
            "Merman Guard",
            "Mermaid Priestess",
            "Dolphin Rider",
            "Seal Dancer",
            "Grey Whale",
        ],
        requirement: 60,
        multipliers: {
            "ExpMultiplier": 1.5,
            "GoldMultiplier": 1.5,
        },
        buffs: { "hp": 5.2, "attack": 6.5, "defense": 5.8, "speed": 6.5 },
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
                    "drops" : ['Watermelon Rind', 'Sandy Slippers', 'Sleeveless T-shirt', 'Surf Pants', 'Surf Board'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 45,
                    "drops" : ['Seaweed', 'Woven Seaweed', 'Seaweed Dress', 'Seaweed Dress Skirt', 'Hard Coral'],
                },
                // epic equipment set
                "Epic": {
                    "dropChance": 15,
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
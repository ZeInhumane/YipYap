const AreaInterface = require('../AreaInterface.js');

module.exports = class Proscis extends AreaInterface {
    init() {
        this.name = "Proscis";
        this.desc = "An unusual beach, with no visitors during summer. Rumours of a cursed beach wont scare me away! Summer is best enjoyed on the beach, soaking under the sun's golden rays!";
        this.id = 5;
        this.imageURL = "https://cdn.discordapp.com/attachments/819860035281879040/956179921074552842/Proscis.jpg";
        this.floors = floors;
        this.credits = "https://pixabay.com/photos/beach-sea-sunset-sun-sunlight-1751455";
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
            "UV",
            "Sun Burn",
            "Coconut",
            "Beach Umbrella",
            "Volley Ball",
            "Rusty Nail",
        ],
        requirement: 30,
        multipliers: {
            "ExpMultiplier": 1.3,
            "GoldMultiplier": 1.3,
        },
        buffs: { "hp": 2.8, "attack": 3.4, "defense": 2.8, "speed": 2.2 },
        rewardDescription: "30% more gold           30% more player experience",
        rewards: {
            jericho: {
                "dropChance": 0.32,
                "minQuantity": 30,
                "maxQuantity": 50,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance : 0.2,
            equipment: {
                // common equipment set
                "Common": {
                    "dropChance": 80,
                    "drops" : ['Floppy Hat', 'Flip Flops', 'Flowery Shirt', 'Flowery Shorts', 'Smoothie Cup'],
                },
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 15,
                    "drops" : ['Snorkel', 'Small Flippers', 'Life Vest', 'Swimming Trunks', 'Waterproof Camera'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 5,
                    "drops" : ['Sunglasses', 'Brown Bermudas', 'Singlet', 'Beach Slippers', 'Watermelons'],
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
            "Crab",
            "Stingray",
            "Stonefish",
            "Reef Shark",
            "Turtle",
            "Sandfly",
        ],
        requirement: 35,
        multipliers: {
            "ExpMultiplier": 1.3,
            "GoldMultiplier": 1.3,
        },
        buffs: { "hp": 3.2, "attack": 3.8, "defense": 3.2, "speed": 2.6 },
        rewardDescription: "**30% more gold          30% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.32,
                "minQuantity": 40,
                "maxQuantity": 80,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance: 0.2,
            equipment: {
                // common equipment set
                "Common": {
                    "dropChance": 75,
                    "drops" : ['Floppy Hat', 'Flip Flops', 'Flowery Shirt', 'Flowery Shorts', 'Smoothie Cup'],
                },
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 20,
                    "drops" : ['Snorkle', 'Small Flippers', 'Life Vest', 'Swimming Trunks', 'Waterproof Camera'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 5,
                    "drops" : ['Sunglasses', 'Brown Bermudas', 'Singlet', 'Beach Slippers', 'Watermelons'],
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
            "UnderTow",
            "Sand Pit",
            "Sea Urchin",
            "Glass Shard",
            "E.Coli",
            "Algae",
        ],
        requirement: 40,
        multipliers: {
            "ExpMultiplier": 1.3,
            "GoldMultiplier": 1.3,
        },
        buffs: { "hp": 3.5, "attack": 4.1, "defense": 3.5, "speed": 3.0 },
        rewardDescription: "**30% more gold          30% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.32,
                "minQuantity": 50,
                "maxQuantity": 90,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance: 0.2,
            equipment: {
                // common equipment set
                "Common": {
                    "dropChance": 60,
                    "drops" : ['Floppy Hat', 'Flip Flops', 'Flowery Shirt', 'Flowery Shorts', 'Smoothie Cup'],
                },
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 35,
                    "drops" : ['Snorkle', 'Small Flippers', 'Life Vest', 'Swimming Trunks', 'Waterproof Camera'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 5,
                    "drops" : ['Sunglasses', 'Brown Bermudas', 'Singlet', 'Beach Slippers', 'Watermelonss'],
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
            "Sea Eagle",
            "Seagull",
            "Coconut Crab",
            "Albatross",
            "Jellyfish",
            "Killer Whale",
        ],
        requirement: 45,
        multipliers: {
            "ExpMultiplier": 1.3,
            "GoldMultiplier": 1.3,
        },
        buffs: { "hp": 4.0, "attack": 4.6, "defense": 4.0, "speed": 3.5 },
        rewardDescription: "**30% more gold          30% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.32,
                "minQuantity": 60,
                "maxQuantity": 100,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance: 0.2,
            equipment: {
                // common equipment set
                "Common": {
                    "dropChance": 50,
                    "drops" : ['Floppy Hat', 'Flip Flops', 'Flowery Shirt', 'Flowery Shorts', 'Smoothie Cup'],
                },
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 40,
                    "drops" : ['Snorkle', 'Small Flippers', 'Life Vest', 'Swimming Trunks', 'Waterproof Camera'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 10,
                    "drops" : ['Sunglasses', 'Brown Bermudas', 'Singlet', 'Beach Slippers', 'Watermelons'],
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
            "Mysterious Song",
            "Mysterious Figure 1",
            "Mysterious Figure 2",
            "Mysterious Figure 3",
            "Mysterious Figure 4",
            "Mysterious Figure 5",
        ],
        requirement: 60,
        multipliers: {
            "ExpMultiplier": 1.5,
            "GoldMultiplier": 1.5,
        },
        buffs: { "hp": 5.5, "attack": 5.5, "defense": 5.5, "speed": 5.5 },
        rewardDescription: "**50% more gold          50% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.5,
                "minQuantity": 100,
                "maxQuantity": 300,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance : 0.2,
            equipment: {
                // common equipment set
                "Common": {
                    "dropChance": 30,
                    "drops" : ['Floppy Hat', 'Flip Flops', 'Flowery Shirt', 'Flowery Shorts', 'Smoothie Cup'],
                },
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 30,
                    "drops" : ['Snorkle', 'Small Flippers', 'Life Vest', 'Swimming Trunks', 'Waterproof Camera'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 40,
                    "drops" : ['Sunglasses', 'Brown Bermudas', 'Singlet', 'Beach Slippers', 'Watermelons'],
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
                    "dropChance": 20,
                    "minQuantity": 1,
                    "maxQuantity": 4,
                    "emote": "<:UncommonChest:820272834348711976>",
                },
                "Rare Treasure Chest": {
                    "dropChance": 20,
                    "minQuantity": 1,
                    "maxQuantity": 3,
                    "emote": "<:RareChest:820273250629582858>",
                },
                "Epic Treasure Chest": {
                    "dropChance": 5,
                    "minQuantity": 1,
                    "maxQuantity": 2,
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
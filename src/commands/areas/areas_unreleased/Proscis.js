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
        requirement: 10,
        multipliers: {
            "ExpMultiplier": 1.2,
            "GoldMultiplier": 1.2,
        },
        buffs: { "hp": 2.2, "attack": 2.7, "defense": 1.7, "speed": 2.2 },
        rewardDescription: "20% more gold           20% more player experience",
        rewards: {
            jericho: {
                "dropChance": 0.32,
                "minQuantity": 1,
                "maxQuantity": 20,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance : 0,
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
                    "drops" : ['Sunglasses', 'Brown Bermudas', 'Singlet', 'Beach Slippers', 'Watermelon'],
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
            "Crab",
            "Stingray",
            "Stonefish",
            "Reef Shark",
            "Turtle",
            "Sandfly",
        ],
        requirement: 20,
        multipliers: {
            "ExpMultiplier": 1.3,
            "GoldMultiplier": 1.3,
        },
        buffs: { "hp": 2.7, "attack": 3.2, "defense": 2.2, "speed": 2.7 },
        rewardDescription: "**30% more gold          30% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.32,
                "minQuantity": 10,
                "maxQuantity": 25,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance: 0,
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
                    "drops" : ['Sunglasses', 'Brown Bermudas', 'Singlet', 'Beach Slippers', 'Watermelon'],
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
            "UnderTow",
            "Sand Pit",
            "Sea Urchin",
            "Glass Shard",
            "E.Coli",
            "Algae",
        ],
        requirement: 30,
        multipliers: {
            "ExpMultiplier": 1.35,
            "GoldMultiplier": 1.35,
        },
        buffs: { "hp": 3.0, "attack": 3.5, "defense": 2.5, "speed": 3.0 },
        rewardDescription: "**35% more gold          35% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.32,
                "minQuantity": 15,
                "maxQuantity": 40,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance: 0,
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
                    "drops" : ['Sunglasses', 'Brown Bermudas', 'Singlet', 'Beach Slippers', 'Watermelon'],
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
            "Sea Eagle",
            "Seagull",
            "Coconut Crab",
            "Albatross",
            "Jellyfish",
            "Killer Whale",
        ],
        requirement: 40,
        multipliers: {
            "ExpMultiplier": 1.4,
            "GoldMultiplier": 14,
        },
        buffs: { "hp": 3.2, "attack": 2.7, "defense": 3.7, "speed": 3.2 },
        rewardDescription: "**40% more gold          40% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.32,
                "minQuantity": 30,
                "maxQuantity": 50,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance: 0,
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
                    "drops" : ['Sunglasses', 'Brown Bermudas', 'Singlet', 'Beach Slippers', 'Watermelon'],
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
            "Mysterious Song",
            "Mysterious Figure 1",
            "Mysterious Figure 2",
            "Mysterious Figure 3",
            "Mysterious Figure 4",
            "Mysterious Figure 5",
        ],
        requirement: 50,
        multipliers: {
            "ExpMultiplier": 1.4,
            "GoldMultiplier": 1.4,
        },
        buffs: { "hp": 3.8, "attack": 3.3, "defense": 2.3, "speed": 3.8 },
        rewardDescription: "**40% more gold          40% more player experience**",
        rewards: {
            jericho: {
                "dropChance": 0.32,
                "minQuantity": 40,
                "maxQuantity": 80,
                "emote": "<:Jericho:823551572029603840>",
            },
            equipDropChance : 0,
            equipment: {
                // common equipment set
                "Common": {
                    "dropChance": 40,
                    "drops" : ['Floppy Hat', 'Flip Flops', 'Flowery Shirt', 'Flowery Shorts', 'Smoothie Cup'],
                },
                // uncommon equipment set
                "Uncommon": {
                    "dropChance": 45,
                    "drops" : ['Snorkle', 'Small Flippers', 'Life Vest', 'Swimming Trunks', 'Waterproof Camera'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 15,
                    "drops" : ['Sunglasses', 'Brown Bermudas', 'Singlet', 'Beach Slippers', 'Watermelon'],
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
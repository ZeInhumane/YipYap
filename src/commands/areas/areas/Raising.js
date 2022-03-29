const AreaInterface = require('../AreaInterface.js');

module.exports = class Raising extends AreaInterface {
    init() {
        this.name = "Raising";
        this.desc = "After crossing the mountains of Conjo, a strange mist surrounds the area, turning the sky into a regal amber. A large river falls into a ravine creating a magestic waterfall of gold. I marvel at the sight as I walk deeper into the mist.";
        this.id = 7;
        this.imageURL = "https://cdn.discordapp.com/attachments/819860035281879040/956914611339268146/Raising.jpg";
        this.floors = floors;
        this.credits = "https://www.wallpaperbetter.com/en/hd-wallpaper-zrrul";
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
            "Buck",
            "Owl",
            "Wild Horse",
            "Elk",
            "Tahr",
            "Vicuna",
        ],
        requirement: 20,
        multipliers: {
            "ExpMultiplier": 1.3,
            "GoldMultiplier": 1.3,
        },
        buffs: { "hp": 3.0, "attack": 3.0, "defense": 2.5, "speed": 3.5 },
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
                    "drops" : ['Deer Mask', 'Deer Leather Boots', 'Deer Cloak', 'Deer Fur Pants', 'Broken Antler'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 15,
                    "drops" : ['Lynx Fur Mufflers', 'Lynx Fur Boots', 'Lynx Fur Cloak', 'Lynx Fur Pants', 'Lynx Kunckles'],
                },
                // epic equipment set
                "Epic": {
                    "dropChance": 5,
                    "drops" : ['Amber Feather Bonnet', 'Amber Kilt', 'Amber Jacket', 'Amber Snow Boots', 'Amber Knuckles'],
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
            "Deer Herd",
            "Eagle Owl",
            "Wild Horse Herd",
            "Elk Herd",
            "Tahr Herd",
            "Vicuna Herd",
        ],
        requirement: 30,
        multipliers: {
            "ExpMultiplier": 1.35,
            "GoldMultiplier": 1.35,
        },
        buffs: { "hp": 3.5, "attack": 3.5, "defense": 3.0, "speed": 4.0 },
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
                    "drops" : ['Deer Mask', 'Deer Leather Boots', 'Deer Cloak', 'Deer Fur Pants', 'Broken Antler'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 20,
                    "drops" : ['Lynx Fur Mufflers', 'Lynx Fur Boots', 'Lynx Cloak', 'Lynx Fur Pants', 'Lynx Kunckles'],
                },
                // epic equipment set
                "Epic": {
                    "dropChance": 5,
                    "drops" : ['Amber Feather Bonnet', 'Amber Kilt', 'Amber Jacket', 'Amber Snow Boots', 'Amber Knuckles'],
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
            "Lynx",
            "Crane",
            "Wolf",
            "Macaque",
            "Bear",
            "Rainbow Trout",
        ],
        requirement: 40,
        multipliers: {
            "ExpMultiplier": 1.4,
            "GoldMultiplier": 1.4,
        },
        buffs: { "hp": 4.0, "attack": 4.0, "defense": 3.5, "speed": 4.5 },
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
                    "drops" : ['Deer Mask', 'Deer Leather Boots', 'Deer Cloak', 'Deer Fur Pants', 'Broken Antler'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 35,
                    "drops" : ['Lynx Fur Mufflers', 'Lynx Fur Boots', 'Lynx Cloak', 'Lynx Fur Pants', 'Lynx Kunckles'],
                },
                // epic equipment set
                "Epic": {
                    "dropChance": 5,
                    "drops" : ['Amber Feather Bonnet', 'Amber Kilt', 'Amber Jacket', 'Amber Snow Boots', 'Amber Knuckles'],
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
            "Lynx Pair",
            "Crane Flock",
            "Wolf Pack",
            "Macaque Group",
            "Bear Family",
            "Rainbow Trout Shoal",
        ],
        requirement: 50,
        multipliers: {
            "ExpMultiplier": 1.45,
            "GoldMultiplier": 1.45,
        },
        buffs: { "hp": 5.0, "attack": 5.0, "defense": 4.5, "speed": 5.5 },
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
                    "drops" : ['Deer Mask', 'Deer Leather Boots', 'Deer Cloak', 'Deer Fur Pants', 'Broken Antler'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 40,
                    "drops" : ['Lynx Fur Mufflers', 'Lynx Fur Boots', 'Lynx Cloak', 'Lynx Fur Pants', 'Lynx Kunckles'],
                },
                // epic equipment set
                "Epic": {
                    "dropChance": 10,
                    "drops" : ['Amber Feather Bonnet', 'Amber Kilt', 'Amber Jacket', 'Amber Snow Boots', 'Amber Knuckles'],
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
            "Amber Crane",
            "Amber Deer",
            "Amber Lynx",
            "Amber Wolf",
            "Amber Eagle Owl",
            "Amber Wild Horse",
            "Amber Bear",
            "Amber Trout",
            "Amber Macaque",
        ],
        requirement: 60,
        multipliers: {
            "ExpMultiplier": 1.5,
            "GoldMultiplier": 1.5,
        },
        buffs: { "hp": 6.0, "attack": 6.0, "defense": 5.5, "speed": 6.5 },
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
                    "drops" : ['Deer Mask', 'Deer Leather Boots', 'Deer Cloak', 'Deer Fur Pants', 'Broken Antler'],
                },
                // rare equipment set
                "Rare": {
                    "dropChance": 45,
                    "drops" : ['Lynx Fur Mufflers', 'Lynx Fur Boots', 'Lynx Cloak', 'Lynx Fur Pants', 'Lynx Kunckles'],
                },
                // epic equipment set
                "Epic": {
                    "dropChance": 15,
                    "drops" : ['Amber Feather Bonnet', 'Amber Kilt', 'Amber Jacket', 'Amber Snow Boots', 'Amber Knuckles'],
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
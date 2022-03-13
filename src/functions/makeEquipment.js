module.exports = async function (equipmentName) {
    const findItem = require('./findItem.js');
    // For level 1 expToLevelUp
    const expRarityTable = {
        "Common": 1000,
        "Uncommon": 3000,
        "Rare": 9000,
        "Epic": 20000,
        "Legendary": 80000,
        "Mythic": 300000,
    };
    const equipment = await findItem(equipmentName);
    equipment.level = 1;
    equipment.ascension = 0;
    equipment.exp = 0;
    equipment.quantity = 1;
    equipment.expToLevelUp = expRarityTable[equipment.rarity];
    equipment.equipped = false;
    return equipment;
};
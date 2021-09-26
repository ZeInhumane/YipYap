module.exports = async function (equipmentName) {
    const findItem = require('./findItem.js');
    // For level 1 expToLevelUp
    let expRarityTable = {
        "Common": 1000,
        "Uncommon": 3000,
        "Rare": 9000,
        "Epic": 40000,
        "Legendary": 100000,
        "Mythic": 500000
    }
    let equipment = await findItem(equipmentName);
    equipment.level = 1;
    equipment.ascension = 0;
    equipment.exp = 0;
    equipment.quantity = 1;
    equipment.expToLevelUp = expRarityTable[equipment.rarity];
    return equipment;
};
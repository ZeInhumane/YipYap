module.exports = function getFinalStats(item, dbEquipment) {
    // Build finalStats (assumes only stats upgrading are same in level up and ascend up)
    finalStats = {}

    // Adds base stats
    for (statName in dbEquipment.stats) {
        finalStats[statName] = {};
        finalStats[statName].flat = dbEquipment.stats[statName].flat;
        finalStats[statName].multi = dbEquipment.stats[statName].multi;
    }

    // Adds stats up from levels into stats
    for (statName in dbEquipment.statsUpPerLvl) {
        if(!finalStats[statName]){
            finalStats[statName].flat = dbEquipment.statsUpPerLvl[statName] * (item.level - 1);
            finalStats[statName].multi = 0;
            continue;
        }
        finalStats[statName].flat += dbEquipment.statsUpPerLvl[statName] * (item.level - 1);
    }

    // Adds stats up from ascensions into stats
    for (statName in dbEquipment.ascensionStatsUp) {
        finalStats[statName].flat += dbEquipment.ascensionStatsUp[statName].flat * item.ascension;
        finalStats[statName].multi += dbEquipment.ascensionStatsUp[statName].multi * item.ascension;
    }
    return finalStats;
}
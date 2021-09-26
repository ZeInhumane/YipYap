module.exports = function getFinalStats(item, dbEquipment) {
    // Build finalStats (assumes only stats upgrading are same in level up and ascend up)
    finalStats = {}
    // Adds stats up from levels into stats
    for (statName in dbEquipment.statsUpPerLvl) {
        finalStats[statName] = {};
        finalStats[statName].flat = dbEquipment.stats[statName].flat + (dbEquipment.statsUpPerLvl[statName] * (item.level - 1));
        finalStats[statName].multi = 0;
    }
    // Adds stats up from ascensions into stats
    for (statName in dbEquipment.ascensionStatsUp) {
        finalStats[statName].flat += dbEquipment.ascensionStatsUp[statName].flat * item.ascension;
        finalStats[statName].multi += dbEquipment.ascensionStatsUp[statName].multi * item.ascension;
    }
    return finalStats;
}
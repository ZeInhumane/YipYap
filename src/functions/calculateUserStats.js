// Import clan util
const Clan = require('../models/clan');
module.exports = async function calculateUserStats(user) {
    const calculatedUserStats = {};
    for (const stat in user.player.baseStats) {
        calculatedUserStats[stat] = Math.round(user.player.baseStats[stat] * (1 + user.player.additionalStats[stat].multi / 100) + user.player.additionalStats[stat].flat);
    }
    if (user.clanID) {
        // Get clan data with Clan ID
        const clanData = await Clan.findOne({ clanID: user.clanID });
        // Add clan stats to user stats
        for (const [key, value] of Object.entries(clanData.stats)) {
            if (calculatedUserStats[key]) {
                calculatedUserStats[key] = Math.floor(calculatedUserStats[key] * ((value + 100) / 100));
            }
        }
    }
    return calculatedUserStats;
};
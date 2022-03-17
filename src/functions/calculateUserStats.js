// Import clan util
const Clan = require('../models/clan');
const getFinalStats = require('./getFinalStats');
const findItem = require('./findItem');
module.exports = async function calculateUserStats(user, returnWholeUser) {
    // Declares user and additional variables
    const additionalStats = { hp: { flat: 0, multi: 0 }, attack: { flat: 0, multi: 0 }, defense: { flat: 0, multi: 0 }, speed: { flat: 0, multi: 0 } };
    const calculatedUserStats = {};
    const userItemsArr = Object.keys(user.inv);
    const currentEquippedItem = [];
    // Gets all equipped item from user
    userItemsArr.find(item => {
        if(user.inv[item].equipped === true) {
            currentEquippedItem.push(item);
        }
    });
    await Promise.all(currentEquippedItem.map(async (itemName) => {
        const currentEquippedItemName = itemName.split("#")[0];
        const stats = getFinalStats(user.inv[itemName], await findItem(currentEquippedItemName, true));
        for (const statName in stats) {
            additionalStats[statName].flat += stats[statName].flat;
            additionalStats[statName].multi += stats[statName].multi;
        }
    }));

    for (const stat in user.player.baseStats) {
        calculatedUserStats[stat] = Math.round(user.player.baseStats[stat] * (1 + additionalStats[stat].multi / 100) + additionalStats[stat].flat);
    }
    if (user.clanID) {
        // Get clan data with Clan ID
        const clanData = await Clan.findOne({ clanID: user.clanID });
        if (clanData) {
            // Add clan stats to user stats
            for (const [key, value] of Object.entries(clanData.stats)) {
                if (calculatedUserStats[key]) {
                    calculatedUserStats[key] = Math.floor(calculatedUserStats[key] * ((value + 100) / 100));
                }
            }
        }
    }
    if (returnWholeUser) {
        for (const stat in user.player.baseStats) {
            user.player[stat] = calculatedUserStats[stat];
            user.player[`${stat}Max`] = calculatedUserStats[stat];
        }
        return user;
    } else {
        return calculatedUserStats;
    }
};
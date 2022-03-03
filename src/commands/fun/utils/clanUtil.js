// Require clan model
const Clan = require('../../../models/clan');

module.exports = async function (clanID) {
    if (!clanID) { return; }

    // Get clan data with Clan ID
    const clanData = await Clan.findOne({ clanID : clanID });
    console.log(clanData);
    return clanData;
};
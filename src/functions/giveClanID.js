module.exports = async function () {
    const botData = require('../models/botData');
    const filter = {};
    const update = { $inc: { 'clanID': 1 } };
    const currentClanID = await botData.findOneAndUpdate(filter, update);
    return `${currentClanID.clanID}`;
};
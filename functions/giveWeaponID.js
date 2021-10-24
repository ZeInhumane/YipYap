module.exports = async function (weaponName) {
    const botData = require('../models/botData');
    const filter = {}
    const update = { $inc: { 'equipmentID': 1 } }
    let currentEquipmentID = await botData.findOneAndUpdate(filter, update);
    return `${weaponName}#${currentEquipmentID.equipmentID}`;
};
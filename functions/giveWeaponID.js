module.exports = async function (weaponName) {
    const botData = require('../models/botData');
    let currentEquipmentID = await botData.findOne({}, (err, data) => {
        data.equipmentID++;
        data.save();
    });
    return `${weaponName}#${currentEquipmentID.equipmentID}`;

};
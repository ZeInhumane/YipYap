const Discord = require('discord.js');
const botData = require('../../models/botData');
module.exports = {
    execute() {
        let returnThis;
        getWeaponID()
        async function getWeaponID() {
            let currentEquipmentID = await botData.findOne({}, (err, user) => {
                user.equipmentID++;
                user.save();
            });
            console.log(currentEquipmentID.equipmentID)
            returnThis = currentEquipmentID.equipmentID;
        }
        
        return returnThis;
    }
}
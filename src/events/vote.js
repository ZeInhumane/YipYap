const findItem = require('../functions/findItem.js');
const giveWeaponID = require('../functions/giveWeaponID.js');
const makeEquipment = require('../functions/makeEquipment');

module.exports = async (client, userID, target) => {

    let itemName = "Jericho Jehammad";
    let transferAmount = 1;
    if (target.inv[itemName]) {
        target.inv[itemName].quantity += transferAmount;
    } else {
        // Gets equipment info from db
        let addItem = await findItem(itemName, true);
        if (!addItem){
            return;
        }
        // Corrects item name to the one in the db
        itemName = addItem.itemName;

        if (addItem.type == 'equipment') {
            addItem = await makeEquipment(itemName);
            itemName = await giveWeaponID(itemName);
            transferAmount = 1;
        }

        target.inv[itemName] = addItem;
        target.inv[itemName].quantity = transferAmount;
    }

    target.markModified('vote');
    target.save()
        .then(result => console.log(result))
        .catch(err => console.error(err));
};


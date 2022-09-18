const findItem = require('../functions/findItem.js');
const giveWeaponID = require('../functions/giveWeaponID.js');
const makeEquipment = require('../functions/makeEquipment');

module.exports = async (client, userID, target) => {

    let itemName = "Jericho Jehammad";
    let transferAmount = 1;
    if (target.inv[itemName]) {
        target.inv[itemName].quantity += transferAmount;
    } else {
        const values = await findItem(itemName);
        if (!values){
            return;
        }
        let addItem = values[0];
        const newName = values[1];
        if (itemName != newName){
            itemName = newName + '#' + itemName.split('#')[1];
        }

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


const Items = require('../models/items');
const Equipment = require('../models/equipment');

module.exports = async function (itemName, getWeaponStats = false, getDescription = true, getEmote = true) {
    // 0 in exclusions means do not return
    const exclusion = { _id: 0 };
    // Always return these props unless specified not to
    if(!getDescription){
        exclusion["description"] = 0;
    }
    if(!getEmote){
        exclusion["emote"] = 0;
    }

    // Gets item info from db (collation to ignore case)
    const item = await Items.findOne({ itemName:  itemName }, exclusion).collation({ locale: 'en', strength:2 }).exec();

    // If item is not found, return null
    if (item == null) {
        return;
    }

    // Got the correct item name from db
    itemName = item.itemName;

    if (item.type == "equipment") {
        // Does not return these props unless specified to
        if (!getWeaponStats) {
            exclusion["stats"] = 0;
            exclusion["ascensionRequirements"] = 0;
            exclusion["ascensionStatsUp"] = 0;
            exclusion["statsUpPerLvl"] = 0;
        }

        const itemAddOn = await Equipment.findOne({ itemName: itemName }, exclusion).exec();
        const props = Object.entries(itemAddOn._doc);
        for (let i = 0; i < props.length; i++) {
            item._doc[props[i][0]] = props[i][1];
        }
    }

    return item._doc;
};
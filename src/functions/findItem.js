const Items = require('../models/items');
const Equipment = require('../models/equipment');

module.exports = async function (itemName, getWeaponStats = false, getDescription = false, getEmote = false) {
    // IDK why it needs _docs, but it breaks without it
    // This is pain
    itemName = itemName.toLowerCase();
    const item = await Items.findOne({ itemName:  itemName }, { _id: 0 }).collation({ locale: 'en', strength:2 }).exec();
    if (item == null) {
        return;
    }
    itemName = item.itemName;
    if (item.type == "equipment") {
        // 0 in exclusions means do not return
        const exclusion = { itemName: 0, _id: 0 };
        // Does not return these props unless specified
        if (!getWeaponStats) {
            exclusion["stats"] = 0;
            exclusion["ascensionRequirements"] = 0;
            exclusion["ascensionStatsUp"] = 0;
            exclusion["statsUpPerLvl"] = 0;
        }
        if(!getDescription){
            exclusion["description"] = 0;
        }
        if(!getEmote){
            exclusion["emote"] = 0;
        }

        const itemAddOn = await Equipment.findOne({ itemName: itemName }, exclusion).collation({ locale: 'en', strength:2 }).exec();
        const props = Object.entries(itemAddOn._doc);
        for (let i = 0; i < props.length; i++) {
            item._doc[props[i][0]] = props[i][1];
        }
    }

    return [item._doc, itemName];
};
const Items = require('../models/items');
const Equipment = require('../models/equipment');
const mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = async function (itemName) {
    // IDK why it needs _docs, but it breaks without it
    // This is pain
    let item = await Items.findOne({ itemName: itemName }, { itemName: 0, _id: 0 }).exec();
    if(item == null){
        return;
    }
    if(item.type == "equipment"){
        itemAddOn = await Equipment.findOne({ itemName: itemName }, { itemName: 0, _id: 0 }).exec();
        props = Object.entries(itemAddOn._doc);
        for(let i=0; i<props.length; i++){
            item._doc[props[i][0]] = props[i][1];
        }
    }

    return item._doc;
};
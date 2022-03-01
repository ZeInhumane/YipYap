const Items = require('../models/items');
const Equipment = require('../models/equipment');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const titleCase = require('./titleCase.js');

module.exports = async function (itemName, itemTypes = []) {
    // IDK why it needs _docs, but it breaks without it
    // This is pain
    const itemNameArr = itemName.split(' ');
    // First part of regex
    let reg = `^.*?\\b${itemNameArr[0]}`;
    // Appends middle part of regex to each new key search term
    for (let i = 1; i < itemNameArr.length; i++) {
        reg += `\\b.*?\\b${itemNameArr[i]}`;
    }
    // Closes the regex
    reg += `\\b.*?$`;
    const items = await Items.find({ itemName: { '$regex': reg, $options: 'i' } }, { _id: 0 }).exec();
    let item;
    if (items.length == 0) {
        return [];
    }
    if (items.length == 1) {
        item = items[0];
    } else {
        const itemNames = [];

        for (let i = 0; i < items.length; i++) {
            itemNames.push(items[i].itemName);
            if (items[i].itemName == titleCase(itemName)) {
                item = items[i];
            }
        }
        if (item == null || item == undefined) {
            return itemNames;
        }
    }
    if (item.type == "equipment") {
        const itemAddOn = await Equipment.findOne({ itemName: item.itemName }, { itemName: 0, _id: 0 }).exec();
        const props = Object.entries(itemAddOn._doc);
        for (let i = 0; i < props.length; i++) {
            item._doc[props[i][0]] = props[i][1];
        }
    }

    return [item._doc];
};
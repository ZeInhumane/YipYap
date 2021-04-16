const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    itemName: String,
    itemCost: Number,
    emote: String,
    type: String,
});

module.exports = mongoose.model('Shop', userSchema, 'shopData');
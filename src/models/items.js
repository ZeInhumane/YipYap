const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    itemName: String,
    emote: String,
    description: String,
    rarity: String,
    type: String,
    image: String,
    credits: String,
});

module.exports = mongoose.model('items', userSchema, 'items');
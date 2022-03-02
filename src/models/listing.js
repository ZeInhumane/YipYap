const mongoose = require('mongoose');

const listingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    itemCost: Number,
    itemName: String,
    quantity: Number,
    item: Object,
    type: String,
});

module.exports = mongoose.model('Listing', listingSchema, 'listing');
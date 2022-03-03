const mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);

const listingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    itemCost: Number,
    itemName: String,
    quantity: Number,
    item: Object,
    type: String,
    listingID: Number,
});

listingSchema.plugin(AutoIncrement, { id: 'order_seq', inc_field: 'listingID' });
module.exports = mongoose.model('Listing', listingSchema, 'listing');
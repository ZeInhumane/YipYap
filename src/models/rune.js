const mongoose = require('mongoose');

const runeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Rune:String,
    Requirements:String,
    Description:String,
    Image:String,
    Title:String,
});

module.exports = mongoose.model('runes', runeSchema, 'runes');
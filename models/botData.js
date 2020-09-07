const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    dataName: String,
    data: mongoose.Collection,
});

module.exports = mongoose.model('BotData', dataSchema, 'botData');
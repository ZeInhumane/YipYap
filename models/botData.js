const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    dataName: String,
    data: Object,
});

module.exports = mongoose.model('BotData', dataSchema, 'botDatas');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    dataName: String,
    data: Object,
});

module.exports = mongoose.model('BotData', userSchema, 'botData');
const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Level:Object,
});

module.exports = mongoose.model('botLevel', guildSchema, 'botLevel');
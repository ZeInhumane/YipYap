const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    tickets: Object,
});

module.exports = mongoose.model('UserEffects', userSchema, 'userEffects');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    currency: Number,
    player: Object,
});

module.exports = mongoose.model('User', userSchema, 'users');
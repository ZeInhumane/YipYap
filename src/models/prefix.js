const mongoose = require('mongoose');

const PrefixSchema = new mongoose.Schema({
    Prefix: {
        type: String,
    },
    GuildID: String,
    GuildName:String,
    GuildOwner:Number,
});

const MessageModel = module.exports = mongoose.model('prefixes', PrefixSchema);
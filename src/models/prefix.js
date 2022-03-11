const mongoose = require('mongoose');

const PrefixSchema = new mongoose.Schema({
    Prefix: {
        type: String,
    },
    GuildID: String,
    GuildName:String,
    GuildOwner:Number,
});

module.exports = mongoose.model('prefixes', PrefixSchema);
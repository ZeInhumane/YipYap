const mongoose = require('mongoose');

const clanSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    clanID: String,
    clanName: String,
    clanDescription: String,
    clanLeader: String,
    clanViceLeader: String,
    clanMembers: Array,
    clanTotalExp: Number,
    clanCurrentExp: Number,
    clanMaxMembers: Number,
    stats: Object,
    clanLevel: Number,
    contribution: Object,
    sp: Number,
}, { minimize: false });

module.exports = mongoose.model('clan', clanSchema, 'clans');
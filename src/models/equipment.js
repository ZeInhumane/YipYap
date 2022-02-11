const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    itemName: String,
    stats: Object,
    equipmentType: String,
    ascensionRequirements: Array,
    ascensionStatsUp: Object,
    statsUpPerLvl: Object,
});

module.exports = mongoose.model('equipment', userSchema, 'equipment');
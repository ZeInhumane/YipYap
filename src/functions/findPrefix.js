const Prefix = require('../models/prefix');
module.exports = async function (guildID) {
    // Set the default prefix here
    let prefix = "-";

    // Find server prefix from db
    const data = await Prefix.findOne({
        GuildID: guildID,
    });

    // If there was a data, use the database prefix BUT if there is no data, use the default prefix
    if (data) {
        prefix = data.Prefix;
    }
    return prefix;
};
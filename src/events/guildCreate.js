const mongoose = require('mongoose');
const Guild = require('../models/guild');

module.exports = async (client, guild) => {
    guild = new Guild({
        _id: mongoose.Types.ObjectId(),
        guildID: guild.id,
        guildName: guild.name,
        prefix: process.env.PREFIX,
    });

    guild.save()
        .then(result => console.log(`Joined a new server: ${result._doc.guildName} (${result._doc.guildID})`))
        .catch(err => console.error(err));
};
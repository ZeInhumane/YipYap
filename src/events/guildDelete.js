const Guild = require('../models/guild');

module.exports = async (client, guild) => {
    Guild.findOneAndDelete({
        guildID: guild.id,
    }, (err) => {
        if (err) console.error(err);
        console.log('I have been removed from a server!');
    });
};
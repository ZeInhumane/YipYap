module.exports = async function () {
    const data = await prefix.findOne({
        GuildID: message.guild.id
    });
    return data.Prefix;

};
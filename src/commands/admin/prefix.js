const prefixModel = require("../../models/prefix");

module.exports = {
    name: "prefix",
    description: "Change the command prefix with this command",
    syntax: "",
    aliases: [],
    cooldown: 5,
    category: "Admin",
    async execute({ message, args }) {
        const data = await prefixModel.findOne({
            GuildID: message.guild.id,
        });

        if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send('You must have the **Manage Server** permission to use this command!');

        if (!args[0]) return message.channel.send('You must provide a **new prefix**!');

        if (args[0].length > 5) return message.channel.send('Your new prefix must be under `5` characters!');

        if (data) {
            await prefixModel.findOneAndRemove({
                GuildID: message.guild.id,
            });

            message.channel.send(`The new prefix is now **\`${args[0]}\`**`);

            const newData = new prefixModel({
                Prefix: args[0],
                GuildID: message.guild.id,
                GuildName: message.guild.name,
                GuildOwner: message.guild.ownerID,
            });
            newData.save();
        } else if (!data) {
            message.channel.send(`The new prefix is now **\`${args[0]}\`**`);

            const newData = new prefixModel({
                Prefix: args[0],
                GuildID: message.guild.id,
                GuildName: message.guild.name,
                GuildOwner: message.guild.ownerID,
            });
            newData.save();
        }
    },
};
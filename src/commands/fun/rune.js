const User = require('../../models/user');
const Discord = require('discord.js');
const rune = require('../../models/rune');
const findPrefix = require('../../functions/findPrefix');

module.exports = {
    name: "rune",
    description: "Move to a new location to receive different prizes :)",
    syntax: "{Floor to access}",
    cooldown: 1,
    aliases: ['runes'],
    category: "Fun",
    execute({ message, args, client }) {
        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                // Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }

            const userRune = parseInt(args[0]);
            const embedColor = "#0099ff";
            // sets rune if doesn't exist
            if (user.rune == null) { user.rune = 1; }
            // checks if argument is keyed in properly
            if (isNaN(userRune)) {
                const returnAll = await rune.find({}).sort(`-Rune`).exec();
                const runeEmbed = new Discord.MessageEmbed()
                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                    .setColor(embedColor)
                    .setTitle(`All available runes`)
                    .addField(`\u200b`, `Enter the rune number you would like to use eg. -rune 1 to equip ruin 1`);
                for (const i in returnAll) {
                    const runeInfo = returnAll[i];
                    runeEmbed
                        .addField(`> ID: ${runeInfo.Rune}`, `Name: ${runeInfo.Title}`)
                        .addField(`Requirement`, runeInfo.Requirements, true)
                        .addField(`Description`, runeInfo.Description, true);
                }
                message.channel.send({ embeds: [runeEmbed] });
                return;
            }


            let runeInfo = await rune.findOne({ 'Rune': userRune }).exec();
            if (!runeInfo) {
                message.channel.send("This isn't a valid rune");
                return;
            }
            runeInfo = runeInfo._doc;

            await User.findOne({ userID: message.author.id }, (err, _user) => {
                if (runeInfo.Requirements > _user.level) {
                    message.channel.send(`It looks like you have not unlocked this rune, you will unlock it when you reach level ${runeInfo.Requirements}`);
                    return;
                }
                user.rune = userRune;
                user.save()
                    .then(() => console.log())
                    .catch(err => console.error(err));

                const runeEmbed = new Discord.MessageEmbed()
                    .setColor(embedColor)
                    .setTitle(`You are now using ${runeInfo.Title} in battle `)
                    .setImage(runeInfo.Image)
                    .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                    .addField(`\u200b`, runeInfo.Description);
                message.channel.send({ embeds: [runeEmbed] });
            });
        });
    },
};
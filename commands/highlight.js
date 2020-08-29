module.exports = {
    name: "highlight",
    description: "Highlights a message",
    execute(message, args, client) {
        const Discord = require('discord.js');
        var highlightedMessage = "";
        args.forEach(arg => {
            highlightedMessage += arg + " ";
        });
        
        user = message.member;
        user = user.toString();
        if (user.includes("!")) {
            user = user.split("!")[1].split(">")[0];
        } else {
            user = user.split("@")[1].split(">")[0];
        }
        authorName = client.users.get(user).username;

        var highlightEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(highlightedMessage)
            .setFooter(authorName);

        message.channel.send(highlightEmbed);
        message.delete();
    }
}
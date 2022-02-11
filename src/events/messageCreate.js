const findPrefix = require('./src/functions/findPrefix');
const cooldownUpdate = require('./src/functions/cooldownUpdate');

module.exports = async (client, message) => {
    if (message.author.bot) return;

    // Getting the prefix from db
    const prefix = await findPrefix(message.guild.id);

    // Checking if the message starts with the prefix
    if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;

    // Checking if message consists only of prefix
    if (message.content.toLowerCase() == prefix.toLowerCase()) return;

    const args = message.content.slice(prefix.length).match(/\S+/g);

    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (command) {
        cooldownUpdate(command, message, args);
    }
};
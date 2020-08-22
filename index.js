const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, bot_age } = require('./config.json');
const fs = require('fs');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log(prefix);
    console.log(bot_age);
    console.log("This updates");
    client.user.setActivity(client.guilds.size + " servers");
});

client.login(process.env.token);

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    switch (command) {
        case 'start':
            client.commands.get('start').execute(message, args);
            break;
        case 'battle':
            client.commands.get('battle').execute(message, args);
            break;
    }
});

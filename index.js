const Discord = require('discord.js');
const mongoose = require('mongoose');
const client = new Discord.Client();
const { prefix, bot_age } = require('./config.json');
const fs = require('fs');
const { cooldown } = require('./commands/ping');
const { time } = require('console');
const BotData = require('./models/botData');

client.mongoose = require('./utils/mongoose');
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
    exports.client = client;
    BotData.find({ dataName: 'Cooldowns' }, (err, Data) => {
        cooldowns = Data.data;
    })
        .catch(() => {
            Data = new BotData({
                _id: mongoose.Types.ObjectId(),
                dataName: 'Cooldowns',
                data: new Discord.Collection(),
            })
            Data.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));
        });
    setInterval(() => {
        BotData.find({ dataName: 'Cooldowns' }, (err, Data) => {
            Data.data = cooldowns;
            Data.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));
        }, 300000)
    });
});

setInterval(botStatus, 60000);
function botStatus() {
    client.user.setActivity(client.guilds.cache.size + " servers");
}

client.login(process.env.token);

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    console.log(args);
    console.log("command is " + command);
    if (!command) {
        message.channel.send('Invalid command. Type =help for commands to use.');
    }
    else {
        // discord js api for cooldown
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            var expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                message.channel.send(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }
        else {
            command.execute(message, args);
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }
    }
});
fs.readdir('./events/', (err, files) => {
    if (err) return console.error;
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const evt = require(`./events/${file}`);
        let evtName = file.split('.')[0];
        console.log(`Loaded event '${evtName}'`);
        client.on(evtName, evt.bind(null, client));
    });
});
client.mongoose.init();
const Discord = require('discord.js');
const mongoose = require('mongoose');
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'] });
const fs = require('fs');
const BotData = require('./models/botData');
const findPrefix = require('./functions/findPrefix');
const dotenv = require('dotenv');
const cooldownUpdate = require('./functions/cooldownUpdate');
dotenv.config(); //Build the process.env object.
client.mongoose = require('./utils/mongoose');
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}


client.once('ready', () => {
    exports.client = client;

    BotData.findOne({ dataName: 'Cooldowns' }, (err, Data) => {
        if (err) console.log(err);
        if (Data == null) {
            Data = new BotData({
                _id: mongoose.Types.ObjectId(),
                dataName: 'Cooldowns',
                data: new Discord.Collection(),
            });
            Data.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));
        }
        else {
            cooldowns = Data.data;
        }
        setInterval(() => {
            BotData.findOne({ dataName: 'Cooldowns' }, (err, Data) => {
                Data.data = cooldowns
                Data.save()
                    .catch(err => console.error(err));
            })
        }, 120000);
    })
});

setInterval(botStatus, 60000);
function botStatus() {
    client.user.setActivity(client.guilds.cache.size + " servers| -help for help");
}

client.login(process.env.token);

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    //Getting the prefix from db
    const prefix = await findPrefix(message.guild.id);
    
    if (!message.content.startsWith(prefix)) return;
    if (message.content == prefix) return;
    const args = message.content.slice(prefix.length).match(/\S+/g);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (command) {
        cooldownUpdate(command, message, args);
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
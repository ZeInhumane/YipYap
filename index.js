const Discord = require('discord.js');
const mongoose = require('mongoose');
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'] });
const fs = require('fs');
const BotData = require('./models/botData');
let cooldowns = new Discord.Collection();
const findPrefix = require('./functions/findPrefix');
client.mongoose = require('./utils/mongoose');
const dotenv = require('dotenv');
dotenv.config(); //Build the process.env object.

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
                    // .then(result => console.log(result))
                    .catch(err => console.error(err));
            })
        }, 120000);
    })
});

setInterval(botStatus, 60000);
function botStatus() {
    client.user.setActivity(client.guilds.cache.size + " servers| -help for help");
}
function cooldownUpdate(command, message, args) {
    // discord js api for cooldown
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        let expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            if(timeLeft.toFixed(1) > 60){
                function secondsToHms(d) {
                    d = Number(d);
                    let h = Math.floor(d / 3600);
                    let m = Math.floor(d % 3600 / 60);
                    let s = Math.floor(d % 3600 % 60);
                
                    let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
                    let mDisplay = m > 0 ? m + (m == 1 ? " minute and " : " minutes and ") : "";
                    let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
                    return hDisplay + mDisplay + sDisplay; 
                }
                let timeFormatted = secondsToHms(timeLeft.toFixed(1))
                message.channel.send(`please wait ${timeFormatted} before reusing the \`${command.name}\` command.`);
            }
            else{
                message.channel.send(`please wait ${timeLeft.toFixed(1) + (timeLeft.toFixed(1) == 1 ? ' second' : ' seconds')} before reusing the \`${command.name}\` command.`);
            }
            
        }
        else {
            command.execute(message, args);
            timestamps.delete(message.author.id);
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }
    }
    else {
        command.execute(message, args);
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
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
    if (!command) {
        // message.channel.send(`Invalid command. Type ${prefix}help for commands to use.`);
    }
    else {
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
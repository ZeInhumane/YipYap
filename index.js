const Discord = require('discord.js');
const mongoose = require('mongoose');
const client = new Discord.Client();
const { bot_age, token } = require('./config.json');
const fs = require('fs');
const BotData = require('./models/botData');
var cooldowns = new Discord.Collection();
const prefix = require('./models/prefix.js');
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
        console.log("Entered Find")
        if (Data == null) {
            console.log("Data is nothing")
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
            console.log("Cooldown gotten")
            cooldowns = Data.data;
        }
        console.log(cooldowns)
        setInterval(() => {
            BotData.findOne({ dataName: 'Cooldowns' }, (err, Data) => {
                Data.data = cooldowns
                Data.save()
                    .then(result => console.log(result))
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

client.on('message', async message => {
    if (message.author.bot) return;

    //Getting the data from the model
    const data = await prefix.findOne({
        GuildID: message.guild.id
    });

    const messageArray = message.content.split(' ');

    //If there was a data, use the database prefix BUT if there is no data, use the default prefix which you have to set!
    if (data) {
        const prefix = data.Prefix;

        if (!message.content.startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).match(/\S+/g);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) {
            message.channel.send(`Invalid command. Type ${prefix}help for commands to use.`);
        }
        else {
            // discord js api for cooldown
            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Discord.Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 3) * 1000;
            console.log(command.cooldown)

            if (timestamps.has(message.author.id)) {
                var expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    message.channel.send(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
                }
                else {
                    command.execute(message, args);
                    timestamps.delete(message.author.id);
                    timestamps.set(message.author.id, now);
                    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
                    console.log(cooldownAmount)
                }
            }
            else {
                command.execute(message, args);
                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            }
        }
    } else if (!data) {
        //set the default prefix here
        const prefix = "-";

        if (!message.content.startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).match(/\S+/g);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) {
            message.channel.send(`Invalid command. Type ${prefix}help for commands to use.`);
        }
        else {
            // discord js api for cooldown
            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Discord.Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 3) * 1000;
            console.log(command.cooldown)

            if (timestamps.has(message.author.id)) {
                var expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    message.channel.send(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
                }
                else {
                    command.execute(message, args);
                    timestamps.delete(message.author.id);
                    timestamps.set(message.author.id, now);
                    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
                    console.log(cooldownAmount)
                }
            }
            else {
                command.execute(message, args);
                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            }
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
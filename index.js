const Discord = require('discord.js');
const dotenv = require('dotenv');

// Build the process.env object
dotenv.config();

// Create client
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'] });
client.mongoose = require('./src/utils/mongoose');
client.commands = new Discord.Collection();

// Load handlers
["command", "event"].forEach(event => require(`./src/handlers/${event}`)(client));

// Login to Discord with token
client.login(process.env.token);

// Initialize mongoose
client.mongoose.init();
const Discord = require("discord.js");
const dotenv = require("dotenv");
const config = require("./config.json");

// Build the process.env object
dotenv.config();

// Create client
const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"],
});
client.mongoose = require("./src/utils/mongoose");
client.mongoUtils = require("./src/utils/mongoUtils");
client.commands = new Discord.Collection();
client.config = config;

// Load handlers
["command", "event"].forEach((event) =>
    require(`./src/handlers/${event}`)(client),
);

// Login to Discord with token
client.login(process.env.token);

// Initialize mongoose
client.mongoose.init();

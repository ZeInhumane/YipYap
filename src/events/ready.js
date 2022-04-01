// const registerInteraction = require("../handlers/registerCommand");
// const registerGuildCommand = require("../handlers/registerGuildCommand");
const Discord = require('discord.js');
const mongoose = require('mongoose');
const BotData = require('../models/botData');


module.exports = async (client) => {
    // Set the bot's presence
    setPresence(client);

    // Set cooldowns
    setCooldowns();

    console.log(`${client.user.username} has been restarted.`);

    console.log("Loading slash commands");
    require('../handlers/slash')(client);
};

const setPresence = (client) => {
    client.user.setPresence({
        activities: [
            { name: `${client.guilds.cache.size.toLocaleString()} servers| -help for help`, type: "PLAYING" },
        ],
        status: "online",
    });
};

const setCooldowns = () => {
    let cooldowns;
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
        } else {
            cooldowns = Data.data;
        }
        setInterval(() => {
            BotData.findOne({ dataName: 'Cooldowns' }, (err, data) => {
                data.data = cooldowns;
                data.save()
                    .catch(err => console.error(err));
            });
        }, 120000);
    });
};
const Discord = require('discord.js');
const activeCommands = new Discord.Collection();

module.exports = async function checkChannel(command, channelId, details) {
    if (!activeCommands.has(command.name)) {
        activeCommands.set(command.name, new Discord.Collection());
        activeCommands.get(command.name).set(channelId, []);
        activeCommands.get(command.name).get(channelId).push(details);
        return { active: false };
    }

    if (!activeCommands.get(command.name).has(channelId)) {
        activeCommands.get(command.name).set(channelId, []);
        activeCommands.get(command.name).get(channelId).push(details);
        return { active: false };
    }

    if (activeCommands.get(command.name).get(channelId).length < command.maxConcurrency) {
        activeCommands.get(command.name).get(channelId).push(details);
        return false;
    }

    return true;
};


// format
/*
    {
        trade: {
            channelId1: [{
                tradeInitiatior: userId,
                tradeTarget: userId,
            }],
            channelId2: [
            {
                tradeInitiatior: userId,
                tradeTarget: userId,
            },
            {
                tradeInitiatior: userId,
                tradeTarget: userId,
            }]
        },
        anotherCommand: {
            channelId1: {
                details
            },
        }
    }
*/
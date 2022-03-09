const Discord = require('discord.js');
const activeCommands = new Discord.Collection();
const usersInTrade = new Set();

exports.checkChannel = async function (command, channelId, details) {
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
        return { active: false };
    }

    return { active: true };
};

exports.inTrade = function (type, userId) {
    switch (type) {
        case 'add':
            usersInTrade.add(userId);
            break;
        case 'remove':
            usersInTrade.delete(userId);
            break;
        case 'check':
            return usersInTrade.has(userId);
    }
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
require('dotenv').config();
const { readdirSync } = require('fs');
const { Routes } = require("discord-api-types/v9");
const { REST } = require('@discordjs/rest');

module.exports = (client) => {
    const environment = process.env.NODE_ENV || 'development';

    const commandsArray = [];
    // Temporary directory for commands
    const slashCommandDir = "slashCommands";

    readdirSync(`./src/${slashCommandDir}/`).forEach((dir) => {
        const commands = readdirSync(`./src/${slashCommandDir}/${dir}/`).filter((file) => file.endsWith('.js') && !file.includes('Interface'));

        for (const file of commands) {
            const command = require(`../${slashCommandDir}/${dir}/${file}`);

            if (command.data.name && command.data.description) {
                commandsArray.push(command.data.toJSON());
                client.slashCommands.set(command.data.name, command);
            }
        }
    });

    const rest = new REST({ version: '9' }).setToken(process.env.token);

    loadSlashCommands(rest, commandsArray, client, environment == "production").catch(err => {
        if (err.code == 50001) {
            console.log('Slash commands are not enabled on this bot');
            return;
        }

        console.error(err);
    });
};

const loadSlashCommands = async (rest, commands, client, isProd) => {

    if (isProd) {
        await rest.put(Routes.applicationCommands(client.user.id), {
            body: commands,
        });


        return console.log('Loaded commands [Global]');
    }

    if (!isProd) {
        for (const guildId in client.testGuildIds) {
            if (botIsInGuild(client, guildId)) {
                await rest.put(Routes.applicationGuildCommands(client.user.idguildId, guildId), {
                    body: commands,
                });
            }
        }

        return console.log(`Loaded ${commands.length} commands [Test Guilds]`);
    }
};

const botIsInGuild = (client, guildId) => {
    return client.guilds.cache.has(guildId);
};
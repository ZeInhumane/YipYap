module.exports = async (client, interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    const command = client.slashCommands.get(commandName);

    if (command) {
        command.execute(client, interaction);
    }
};
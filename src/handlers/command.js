const { readdirSync } = require("fs");
const Ascii = require("ascii-table");

const table = new Ascii("Commands");
table.setHeading("Command", "Load status");

module.exports = (client) => {
    readdirSync("./src/commands/").forEach((dir) => {
        const commands = readdirSync(`./src/commands/${dir}/`).filter((file) => file.endsWith(".js"));

        for (const file of commands) {
            const command = require(`../commands/${dir}/${file}`);

            if (command.name) {
                client.commands.set(command.name, command);
                table.addRow(file, "✅");
            } else {
                table.addRow(file, "❎ -> missing a help.name, or help.name is not a string.");
                continue;
            }
        }
    });

    console.log(table.toString());
};
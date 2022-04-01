const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class CommandInterface {
    constructor(args) {
        // Load data
        this.data = new SlashCommandBuilder()
            .setName(args.name)
            .setDescription(args.description);
        // Set attributes
        for (const key in args) {
            this[key] = args[key];
        }
    }
};
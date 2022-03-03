const Listing = require('../../models/listing');
const Discord = require('discord.js');
const titleCase = require('../../functions/titleCase');
const mongoose = require('mongoose');

module.exports = {
    name: "market",
    description: "Stuff.",
    syntax: `{filters}`,
    aliases: [''],
    category: "Economy",
    cooldown: 5,
    async execute({ message, args, user }) {

        let option = args.shift()?.toLowerCase();
        if (!option) {
            return;
        }

        await handleOption({ message, args, user, option })

        const entriesPerPage = 10;
        let entriesOnCurrentPage = 0;

        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('back')
                    .setLabel('◀️')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('forward')
                    .setLabel('▶️')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('delete')
                    .setLabel('🗑️')
                    .setStyle('DANGER'),
            );
    },
};

marketListing = {
    title: "Global Market :shopping_cart:",
    description: "All the cards listed in the Global Market that matches your requirements are shown below!\n\n",
    author: true
}

function parseArguments(args) {

}

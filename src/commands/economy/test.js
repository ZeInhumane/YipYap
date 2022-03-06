const Listing = require('../../models/listing');
const Discord = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    name: "test",
    description: "Stuff.",
    syntax: `buy {item name} {quantity}\nmk sell {item name} {quantity}\nmk remove {item name}\nmk list`,
    aliases: [''],
    category: "Economy",
    cooldown: 5,
    async execute({ client, message, args, user }) {

        const listingsCollection = client.mongoose.db("YipYap").collection("listing");

        console.log(listingsCollection);
        console.log(test.strings.map(string => string.toString()).join(""));
    },
};


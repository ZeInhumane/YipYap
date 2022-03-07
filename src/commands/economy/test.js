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

        console.log('lmao');

        await client.mongoUtils.client.connect();

        const usersCollection = await client.mongoUtils.getCollection("users");

        console.log(await usersCollection.findOne({ userID: message.author.id }));

        await client.mongoUtils.client.close();
    },
};


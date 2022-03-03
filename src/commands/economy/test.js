const Listing = require('../../models/listing');
const Discord = require('discord.js');
const titleCase = require('../../functions/titleCase');
const mongoose = require('mongoose');
const listing = require('../../models/listing');

/**
 * TODO:
 * fix generateDescription for packs
 * fix listingConfirmed per type
 */
module.exports = {
    name: "test",
    description: "Stuff.",
    syntax: `buy {item name} {quantity}\nmk sell {item name} {quantity}\nmk remove {item name}\nmk list`,
    aliases: [''],
    category: "Economy",
    cooldown: 5,
    async execute({ message, args, user }) {

        // let listings = await Listing.find({ userID: message.author.id });

        // console.log(returnMessage({ listing: listings[0], type: 'fruit', messageType: 'listing' }));

        console.log(test.strings.map(string => string.toString()).join(""));
    },
};


function returnMessage({ listing, type, messageType }) {
    const getMessage = (strings, ...arguments) => {
        return arguments
            .map((argument, index) => {
                let result = "";

                if (typeof argument === "function") {
                    // Call the function with the local user variable as argument.
                    result = argument(user);
                } else {
                    result = argument.toString();
                }

                return strings[index] + result;
            })
            .join("");
    }

    templates = {
        "fruit": {
            "listing": getMessage`**${listing.itemCost * listing.quantity} Gold** <:cash_24:751784973488357457>** | ${listing.quantity === 1 ? listing.itemName : listing.itemName + 's'}** ${listing.item.emote}\n` +
                `${listing.item.type.charAt(0) + listing.item.type.slice(1)} | x${listing.quantity} | ID: ${listing.listingID}`,
            // "sell": `Are you sure you want to place ${itemQuantity === 1 ? '' : `**${itemQuantity}** of`} your **${itemQuantity === 1 ? itemName : `${itemName}s`}** on the market for **${itemPrice}** Gold <:cash_24:751784973488357457>${itemQuantity === 1 ? '' : " **each** "}?`,
        },
        "consumable": {
        },
        "equipment": {
            "listing": `**${listing.itemCost * listing.quantity} Gold** <:cash_24:751784973488357457>** | ${listing.quantity === 1 ? listing.itemName : listing.itemName + 's'}[Asc ${listing.item.ascension}]**\n` + `${listing.item.rarity} | Level ${listing.item.level} | ID: ${listing.listingID}`,
        },
        "pack": {

        },
        "chest": {

        }
    }



    return templates[type][messageType];
}
test = {
    strings: [
        '**',
        ' Gold** <:cash_24:751784973488357457>** | ',
        '** hi',
        '\nhi\n'
    ],
    arguments: [1, 'Apple', '🍎']
}
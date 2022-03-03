exports.returnMessage = ({ listing, type, info, messageType, itemName, itemQuantity, itemPrice }) => {
    const getMessage = (strings, ...arguments) => {
        return arguments
            .map((argument, index) => {
                let result = "";
                if (!argument) return "";

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
            "confirmRemove": getMessage`Are you sure you want to remove ${listing.quantity === 1 ? '' : `**${listing.quantity}** of`} your **${listing.quantity === 1 ? listing.itemName : `${listing.itemName}s`}** that you listed on the market for **${listing.itemCost}** Gold <:cash_24:751784973488357457>${listing.quantity === 1 ? '' : " **each** "}? (ID: ${listing.listingID})`,
            "listing": getMessage`**${listing.itemCost * listing.quantity} Gold** <:cash_24:751784973488357457>** | ${listing.quantity === 1 ? listing.itemName : listing.itemName + 's'}** ${listing.item.emote}\n${listing.item.type.charAt(0).toUpperCase() + listing.item.type.slice(1)} | x${listing.quantity} | ID: ${listing.listingID}`,
            "sell": getMessage`Are you sure you want to place ${itemQuantity === 1 ? '' : `**${itemQuantity}** of`} your **${itemQuantity === 1 ? itemName : `${itemName}s`}** on the market for **${itemPrice}** Gold <:cash_24:751784973488357457>${itemQuantity === 1 ? '' : " **each** "}?`
        },
        "consumable": {
            "listing": getMessage`**${listing.itemCost * listing.quantity} Gold** <:cash_24:751784973488357457>** | ${listing.quantity === 1 ? listing.itemName : listing.itemName + 's'}** ${listing.item.emote}\n` +
                `${listing.item.type.charAt(0).toUpperCase() + listing.item.type.slice(1)} | x${listing.quantity} | ID: ${listing.listingID}`,
            "sell": getMessage`Are you sure you want to place ${itemQuantity === 1 ? '' : `**${itemQuantity}** of`} your **${itemQuantity === 1 ? itemName : `${itemName}s`}** on the market for **${itemPrice}** Gold <:cash_24:751784973488357457>${itemQuantity === 1 ? '' : " **each** "}?`
        },
        "equipment": {
            "listing": getMessage`**${listing.itemCost * listing.quantity} Gold** <:cash_24:751784973488357457>** | ${listing.quantity === 1 ? listing.itemName : listing.itemName + 's'}[Asc ${info?.ascension}]**\n${listing.item.rarity} | Level ${listing.item.level} | ID: ${listing.listingID}`,
            "listingConfirmed": getMessage`You have successfully placed your **${info?.rarity}** Level __${info?.level}__ **${listing.itemName}** [Ascension: ${info?.ascension}] in the market for **${listing.itemPrice}** Gold <:cash_24:751784973488357457>!`,
            "sell": getMessage`Are you sure you want to place ${itemQuantity === 1 ? '' : `**${itemQuantity}** of`} your **${info?.rarity}** Level __${info?.level}__ **${itemName}** [Ascension: ${info?.ascension}] in the market for **${itemPrice}** Gold <:cash_24:751784973488357457>?`
        },
        "pack": {
            "listing": getMessage`**${listing.itemCost * listing.quantity} Gold** <:cash_24:751784973488357457>** | ${listing.quantity === 1 ? listing.itemName : listing.itemName + 's'}**\n${listing.item.type.charAt(0).toUpperCase() + listing.item.type.slice(1)} | x${listing.quantity} | ID: ${listing.listingID}`,
            "sell": getMessage`Are you sure you want to place ${itemQuantity === 1 ? '' : `**${itemQuantity}** of`} your __${info?.rarity}__ **${itemQuantity === 1 ? itemName : `${itemName}s`}** in the market for **${itemPrice}** Gold <:cash_24:751784973488357457>${itemQuantity === 1 ? '' : " **each** "}?`
        },
        "chest": {
            "listing": getMessage`**${listing.itemCost * listing.quantity} Gold** <:cash_24:751784973488357457>** | ${listing.quantity === 1 ? listing.itemName : listing.itemName + 's'}** ${listing.item.emote}\n${listing.item.rarity} | x${listing.quantity} | ID: ${listing.listingID}`,
            "sell": getMessage`Are you sure you want to place ${itemQuantity === 1 ? '' : `**${itemQuantity}** of`} your **${itemQuantity === 1 ? itemName : `${itemName}s`}** in the market for **${itemPrice}** Gold <:cash_24:751784973488357457>${itemQuantity === 1 ? '' : " **each** "}?`
        }
    }

    return templates[type][messageType];
}
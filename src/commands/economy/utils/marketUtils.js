exports.returnMessage = ({ listing, type, info, messageType, itemName, itemQuantity, itemPrice }) => {

    switch (type) {
        case "fruit":
            switch (messageType) {
                case "confirmRemove":
                    return `Are you sure you want to remove ${listing?.quantity === 1 ? '' : `**${listing?.quantity}** of`} your **${listing?.quantity === 1 ? listing?.itemName : `${listing?.itemName}s`}** that you listed on the market for **${listing?.itemCost} Gold** <:cash_24:751784973488357457>${listing?.quantity === 1 ? '' : " **each** "}? (ID: ${listing?.listingID})`;

                case "confirmBuy":
                    return `Are you sure you wish to buy __${listing.quantity}__ **${listing.quantity === 1 ? listing.itemName : `${listing.itemName}s`}** from the market for **${listing.itemCost} Gold** <:cash_24:751784973488357457>${listing.quantity === 1 ? '' : " **each** "}?`;

                case "listing":
                    return `**${listing?.itemCost * listing?.quantity} Gold** <:cash_24:751784973488357457>** | ${listing?.quantity === 1 ? listing?.itemName : listing?.itemName + 's'}** ${listing?.item.emote}\n${listing?.item.type.charAt(0).toUpperCase() + listing?.item.type.slice(1)} | x${listing?.quantity} | ID: ${listing?.listingID}`;

                case "listingConfirmed":
                    return `You have successfully placed ${listing?.quantity === 1 ? '' : `**${listing.quantity}** of `}your **${listing.itemName}** in the market for **${listing?.itemCost} Gold** <:cash_24:751784973488357457>${listing?.quantity === 1 ? '' : " **each** "}`;

                case "purchase":
                    return `You have successfully bought **${listing.quantity}** **${listing.quantity === 1 ? listing.itemName : `${listing.itemName}s`}** from the market for **${listing.itemCost} Gold** <:cash_24:751784973488357457>${listing.quantity === 1 ? '' : " **each** "}`;

                case "sell":
                    return `Are you sure you want to place ${itemQuantity === 1 ? '' : `**${itemQuantity}** of`} your **${itemQuantity === 1 ? itemName : `${itemName}s`}** on the market for **${itemPrice} Gold** <:cash_24:751784973488357457>${itemQuantity === 1 ? '' : " **each** "}?`;

                default:
                    return "";
            }

        case "consumable":
            switch (messageType) {
                case "confirmRemove":
                    return `Are you sure you want to remove ${listing?.quantity === 1 ? '' : `**${listing?.quantity}** of `}your **${listing?.quantity === 1 ? listing?.itemName : `${listing?.itemName}s`}** that you listed on the market for **${listing?.itemCost} Gold** <:cash_24:751784973488357457>${listing?.quantity === 1 ? '' : " **each** "}? (ID: ${listing?.listingID})`;

                case "confirmBuy":
                    return `Are you sure you wish to buy __${listing?.quantity}__ **${listing?.quantity === 1 ? listing?.itemName : `${listing?.itemName}s`}** from the market for **${listing?.itemCost} Gold** <:cash_24:751784973488357457>${listing?.quantity === 1 ? '' : " **each** "}?`;

                case "listing":
                    return `**${listing?.itemCost * listing?.quantity} Gold** <:cash_24:751784973488357457>** | ${listing?.quantity === 1 ? listing?.itemName : listing?.itemName + 's'}** ${listing?.item.emote}\n${listing?.item.type.charAt(0).toUpperCase() + listing?.item.type.slice(1)} | x${listing?.quantity} | ID: ${listing?.listingID}`;

                case "listingConfirmed":
                    return `You have successfully placed ${listing?.quantity === 1 ? '' : `**${listing.quantity}** of `}your **${listing.itemName}** in the market for **${listing?.itemCost} Gold** <:cash_24:751784973488357457>${listing?.quantity === 1 ? '' : " **each** "}`;

                case "purchase":
                    return `You have successfully bought **${listing.quantity}** **${listing.quantity === 1 ? listing.itemName : `${listing.itemName}s`}** from the market for **${listing.itemCost} Gold** <:cash_24:751784973488357457>${listing.quantity === 1 ? '' : " **each** "}`;

                case "sell":
                    return `Are you sure you want to place ${itemQuantity === 1 ? '' : `**${itemQuantity}** of`} your **${itemQuantity === 1 ? itemName : `${itemName}s`}** on the market for **${itemPrice} Gold** <:cash_24:751784973488357457>${itemQuantity === 1 ? '' : " **each** "}?`;

                default:
                    return "";
            }

        case "equipment":
            switch (messageType) {
                case "confirmRemove":
                    return `Are you sure you want to remove ${listing?.quantity === 1 ? '' : `**${listing?.quantity}** of`} your **${listing.item.rarity}** Level __${listing?.item.level}__ **${listing?.itemName}** [Ascension: ${listing.item.ascension}] that you listed on the market for **${listing?.itemCost} Gold** <:cash_24:751784973488357457>${listing?.quantity === 1 ? '' : " **each** "}? (ID: ${listing?.listingID})`;

                case "confirmBuy":
                    return `Are you sure you wish to buy __${listing.quantity}__ **${info?.rarity}** Level __${listing.item.level}__ **${listing?.itemName}** [Ascension: ${listing.item.ascension}] from the market for **${listing?.itemCost} Gold** <:cash_24:751784973488357457>${listing?.quantity === 1 ? '' : " **each** "}?`;

                case "listing":
                    return `**${listing?.itemCost * listing?.quantity} Gold** <:cash_24:751784973488357457>** | ${listing?.quantity === 1 ? listing?.itemName : listing?.itemName + 's'} [ASC ${listing.item.ascension}]**\n${listing?.item.rarity} | Level ${listing?.item.level} | ID: ${listing?.listingID}`;

                case "listingConfirmed":
                    return `You have successfully placed your **${info?.rarity}** Level __${info?.level}__ **${listing?.itemName}** [Ascension: ${info?.ascension}] in the market for **${listing?.itemCost} Gold** <:cash_24:751784973488357457>!`;

                case "purchase":
                    return `You have successfully bought a **${listing.item.rarity}** Level __${listing.item.level}__ **${listing.itemName}** [Ascension: ${listing.item.ascension}] from the market for **${listing.itemCost} Gold** <:cash_24:751784973488357457>!`;

                case "sell":
                    return `Are you sure you want to place ${itemQuantity === 1 ? '' : `**${itemQuantity}** of`} your **${info?.rarity}** Level __${info?.level}__ **${itemName}** [Ascension: ${info?.ascension}] in the market for **${itemPrice} Gold** <:cash_24:751784973488357457>?`;

                default:
                    return "";
            }

        case "pack":
            switch (messageType) {
                case "confirmRemove":
                    return `Are you sure you want to remove ${listing?.quantity === 1 ? '' : `**${listing?.quantity}** of`} your **${listing?.quantity === 1 ? listing?.itemName : `${listing?.itemName}s`}** that you listed on the market for **${listing?.itemCost} Gold** <:cash_24:751784973488357457>${listing?.quantity === 1 ? '' : " **each** "}? (ID: ${listing?.listingID})`;

                case "confirmBuy":
                    return `Are you sure you wish to buy __${listing?.quantity}__ **${listing?.quantity === 1 ? listing?.itemName : `${listing?.itemName}s`}** from the the market for **${listing?.itemCost} Gold** <:cash_24:751784973488357457>${listing?.quantity === 1 ? '' : " **each** "}?`;

                case "listing":
                    return `**${listing?.itemCost * listing?.quantity} Gold** <:cash_24:751784973488357457>** | ${listing?.quantity === 1 ? listing?.itemName : listing?.itemName + 's'}**\n${listing?.item.type.charAt(0).toUpperCase() + listing?.item.type.slice(1)} | x${listing?.quantity} | ID: ${listing?.listingID}`;

                case "listingConfirmed":
                    return `You have successfully placed ${listing?.quantity === 1 ? '' : `**${listing.quantity}** of `}your **${listing.itemName}** in the market for **${listing?.itemCost} Gold** <:cash_24:751784973488357457>${listing?.quantity === 1 ? '' : " **each** "}`;

                case "purchase":
                    return `You have successfully bought **${listing.quantity}** **${listing.quantity === 1 ? listing.itemName : `${listing.itemName}s`}** from the market for **${listing.itemCost} Gold** <:cash_24:751784973488357457>${listing.quantity === 1 ? '' : " **each** "}`;

                case "sell":
                    return `Are you sure you want to place ${itemQuantity === 1 ? '' : `**${itemQuantity}** of`} your __${info?.rarity}__ **${itemQuantity === 1 ? itemName : `${itemName}s`}** in the market for **${itemPrice} Gold** <:cash_24:751784973488357457>${itemQuantity === 1 ? '' : " **each** "}?`;

                default:
                    return "";
            }

        case "chest": {
            switch (messageType) {
                case "confirmRemove":
                    return `Are you sure you want to remove ${listing?.quantity === 1 ? '' : `**${listing?.quantity}** of `}your **${listing?.quantity === 1 ? listing?.itemName : `${listing?.itemName}s`}** that you listed on the market for **${listing?.itemCost} Gold** <:cash_24:751784973488357457>${listing?.quantity === 1 ? '' : " **each** "}? (ID: ${listing?.listingID})`;

                case "confirmBuy":
                    return `Are you sure you wish to buy __${listing?.quantity}__ **${listing?.quantity === 1 ? listing?.itemName : `${listing?.itemName}s`}** frrom the market for **${listing?.itemCost} Gold** <:cash_24:751784973488357457>${listing?.quantity === 1 ? '' : " **each** "}?`;

                case "listing":
                    return `**${listing?.itemCost * listing?.quantity} Gold** <:cash_24:751784973488357457>** | ${listing?.quantity === 1 ? listing?.itemName : listing?.itemName + 's'}** ${listing?.item.emote}\n${listing?.item.rarity} | x${listing?.quantity} | ID: ${listing?.listingID}`;

                case "listingConfirmed":
                    return `You have successfully placed ${listing?.quantity === 1 ? '' : `**${listing.quantity}** of `}your **${listing.itemName}** in the market for **${listing?.itemCost} Gold** <:cash_24:751784973488357457>${listing?.quantity === 1 ? '' : " **each** "}`;

                case "purchase":
                    return `You have successfully bought **${listing.quantity}** **${listing.quantity === 1 ? listing.itemName : `${listing.itemName}s`}** from the market for **${listing.itemCost} Gold** <:cash_24:751784973488357457>${listing.quantity === 1 ? '' : " **each** "}`;

                case "sell":
                    return `Are you sure you want to place ${itemQuantity === 1 ? '' : `**${itemQuantity}** of`} your **${itemQuantity === 1 ? itemName : `${itemName}s`}** in the market for **${itemPrice} Gold** <:cash_24:751784973488357457>${itemQuantity === 1 ? '' : " **each** "}?`;

                default:
                    return "";
            }
        }
    }
};
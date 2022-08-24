exports.invMessage = ({ property, name, type, emote }) => {
    switch (type) {
        case "fruit":
            return `**${property.quantity}x** | **${name}** ${emote}\n${
                property.type.charAt(0).toUpperCase() + property.type.slice(1)
            }`;

        case "consumable":
            return `**${property.quantity}x** | **${name}** ${emote}\n${
                property.type.charAt(0).toUpperCase() + property.type.slice(1)
            }`;

        case "equipment":
            return `**${property.quantity}x** | **${name} [Asc ${property.ascension}]**\n${property.rarity} | Level ${property.level}`;

        case "pack":
            return `**${property.quantity}x** | **${name}** ${emote}\n${
                property.type.charAt(0).toUpperCase() + property.type.slice(1)
            }`;

        case "chest":
            return `**${property.quantity}x** | **${name}** ${emote}\n${
                property.type.charAt(0).toUpperCase() + property.type.slice(1)
            } | ${property.rarity}`;

        case "special":
            return `**${property.quantity}x** | **${name}** ${emote}\n${
                property.type.charAt(0).toUpperCase() + property.type.slice(1)
            }`;
        default:
            return `**${property.quantity}x** | **${name}** ${emote}\nUnknown`;
    }
};

const Discord = require('discord.js');
const cooldowns = new Discord.Collection();
module.exports = function cooldownUpdate(command, message, args, client) {
    // Check if command is for nsfw only
    if (this.nsfw && !params.channel.nsfw) {
        console.log(`something wrong boyo`);
        return;
    }
    // Discord js api for cooldown
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            if (timeLeft.toFixed(1) > 60) {

                const timeFormatted = secondsToHms(timeLeft.toFixed(1));
                message.channel.send(`please wait ${timeFormatted} before reusing the \`${command.name}\` command.`);
            } else {
                message.channel.send(`please wait ${timeLeft.toFixed(1) + (timeLeft.toFixed(1) == 1 ? ' second' : ' seconds')} before reusing the \`${command.name}\` command.`);
            }

        } else {
            executeCommand(command, message, args, client);
            timestamps.delete(message.author.id);
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }
    } else {
        executeCommand(command, message, args);
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
};

function secondsToHms(d) {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);

    const hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    const mDisplay = m > 0 ? m + (m == 1 ? " minute and " : " minutes and ") : "";
    const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
}

async function executeCommand(command, message, args, client) {
    try {
        await command.execute(message, args, client);
    } catch (error) {
        console.error("Incorrect permissions");
    }
}
const win = require('../../classes/battle/win.js');
const areaUtil = require('../areas/utils/areaUtil');
const config = require('../../../config.json');

// Import calculate user stats
const calculateUserStats = require('../../functions/calculateUserStats.js');
module.exports = {
    name: "test",
    description: "",
    syntax: "",
    cooldown: 5,
    aliases: ['t'],
    category: "Fun",
    async execute({ message, user, args }) {

        if (!config.admins.includes(message.author.id)) {
            return;
        }

        // Calculate user stats
        user = await calculateUserStats(user, true);
        // Get Area
        const Area = areaUtil.getArea(user.location.area);
        const area = new Area();
        area.selectFloor(user.location['floor']);

        // Get clan
        const clanID = user.clanID;

        // Create enemy
        const enemy = area.getRandomEnemy();

        // Returns a boolean of whether player won
        const playerWon = true;

        if (args[0]) {
            user.level = 9;
            user.exp = 10 * (10 / 10) * 15 - 1;
            user.markModified('exp');
            user.markModified('level');
            await user.save();
        }

        if (!args[0]) {
            user.level = 9;
            user.exp = 9 * (9 / 10) * 15 + 1;
            user.markModified('exp');
            user.markModified('level');
            await user.save();
        }

        if (playerWon) {
            win.execute(message, user, enemy, area, clanID);
        } else if (playerWon == false) {
            message.channel.send(`${user.player.name} has been defeated by ${enemy.name}!`);
        } else {
            return;
        }
    },
};

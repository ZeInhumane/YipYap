const win = require('../../classes/battle/win.js');
const ticketUtil = require('./utils/ticketUtil.js');
const Battle = require('./interface/battleInterface.js');
const areaUtil = require('../areas/utils/areaUtil');

// Import calculate user stats
const calculateUserStats = require('../../functions/calculateUserStats.js');
module.exports = {
    name: "battle",
    description: "Battling is the primary means of war. 'The war of war is very pog' -Sun Tzu",
    syntax: "",
    cooldown: 20,
    aliases: ['b'],
    category: "Fun",
    async execute({ message, user }) {
        // Calculate user stats
        try {
            user = await calculateUserStats(user, true);
        } catch {
            console.log(Error);
        }
        // Get Area
        const Area = areaUtil.getArea(user.location.area);
        const area = new Area();
        area.selectFloor(user.location['floor']);

        // Get clan
        const clanID = user.clanID;
        // Get effects messages to display in embed later
        const { expMsg, goldMsg } = await ticketUtil.ticketEffects(message.author.id, user, message);

        // Create enemy
        const enemy = area.getRandomEnemy();

        // Initialize battle
        const battle = new Battle(user, enemy, area);

        // Returns a boolean of whether player won
        const playerWon = await battle.initBattle(message, expMsg, goldMsg);

        if (playerWon) {
            win.execute(message, user, enemy, area, clanID);
        } else if (playerWon == false) {
            message.channel.send(`${user.player.name} has been defeated by ${enemy.name}!`);
        } else {
            return;
        }
    },
};

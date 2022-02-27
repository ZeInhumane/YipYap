const win = require('../../classes/battle/win.js');
const ticketUtil = require('./utils/ticketUtil.js');
const Battle = require('./interface/battleInterface.js');
const AreaInterface = require('../areas/AreaInterface.js');

module.exports = {
    name: "battle",
    description: "Battling is the primary means of war. 'The war of war is very pog' -Sun Tzu",
    syntax: "",
    cooldown: 20,
    aliases: ['b'],
    category: "Fun",
    async execute({ message, user }) {

        const area = new AreaInterface.areas[user.location['area']];
        area.selectFloor(user.location['floor'] || 1);

        // Get effects messages to display in embed later
        const { expMsg, goldMsg } = await ticketUtil.ticketEffects(message.author.id, user, message);

        // Create enemy
        const enemy = area.getRandomEnemy(user.location['floor']);

        // Initialize battle
        const battle = new Battle(user, enemy, area);

        // Returns a boolean of whether player won
        const playerWon = await battle.initBattle(message, expMsg, goldMsg);

        if (playerWon) {
            win.execute(message, user, enemy, area);
        } else if (playerWon == false) {
            message.channel.send(`${user.player.name} has been defeated by ${enemy.name}!`);
        } else {
            return;
        }
    },
};

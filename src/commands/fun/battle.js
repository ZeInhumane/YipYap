const botLevel = require('../../models/botLevel');
const win = require('../../classes/battle/win.js');
const ticketUtil = require('./utils/ticketUtil.js');
const battleUtil = require('./utils/battleUtil.js');
const Battle = require('./interface/battleInterface.js');

module.exports = {
    name: "battle",
    description: "Battling is the primary means of war. 'The war of war is very pog' -Sun Tzu",
    syntax: "",
    cooldown: 20,
    aliases: ['b'],
    category: "Fun",
    async execute({ message, user }) {
        // Get effects messages to display in embed later
        const { expMsg, goldMsg } = await ticketUtil.ticketEffects(message.author.id, user, message);

        // Get locationInfo
        let locationInfo;
        await botLevel.findOne({ 'Location': user.location }, (err, result) => { locationInfo = result._doc; });

        // Create enemy
        const enemy = battleUtil.makeNewEnemy(user, locationInfo);

        // Initialize battle
        const battle = new Battle(user, enemy, locationInfo);

        // Returns a boolean of whether player won
        const playerWon = await battle.initBattle(message, expMsg, goldMsg);

        if (playerWon) {
            win.execute(message, user, enemy, locationInfo);
        } else if (playerWon == false) {
            message.channel.send(`${user.player.name} has been defeated by ${enemy.name}!`);
        } else {
            return;
        }
    },
};

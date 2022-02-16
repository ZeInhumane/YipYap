const botLevel = require('../../models/botLevel');
const win = require('../../classes/battle/win.js');
const User = require('../../models/user');
const findPrefix = require('../../functions/findPrefix');
const ticketUtil = require('./utils/ticketUtil.js');
const battleUtil = require('./utils/battleUtil.js');
const Battle = require('./test/battleInterface.js');

module.exports = {
    name: "newbattle",
    description: "Battling is the primary means of war. 'The war of war is very pog' -Sun Tzu",
    syntax: "",
    cooldown: 20,
    aliases: ['refactor', 'new'],
    category: "Fun",
    async execute({ message }) {
        // Find user, if user not found, prompt user to create new user
        const user = await User.findOne({ userID: message.author.id });
        if (!user) {
            const prefix = await findPrefix(message.guild.id);
            message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
            return;
        }

        // Get effects messages to display in embed later
        const { expMsg, goldMsg } = await ticketUtil.ticketEffects(message.author.id, user, message);

        // Get locationInfo
        let locationInfo;
        await botLevel.findOne({ 'Location': user.location }, (err, result) => { locationInfo = result._doc; });

        // Create enemy
        const enemy = await battleUtil.makeNewEnemy(user, locationInfo);

        // Initialize battle
        const battle = new Battle(user, enemy, locationInfo);

        // Returns a boolean of whether player won
        const playerWon = await battle.initBattle(message, expMsg, goldMsg);

        if (playerWon) {
            win.execute(message, user, enemy, locationInfo);
        } else if (playerWon == false) {
            message.channel.send(`${user.player.name} has been defeated by ${enemy.name}!`);
        } else {
            console.log("Battle inactive");
        }
    },
};

const Discord = require('discord.js');

module.exports = class Battle {
    /**
     * Creates a new battle between 2 players
     * @param {User} user
     * @param {Enemy} enemy
     */
    constructor(user, enemy) {
        this.user = user;
        this.player = this.user.player;
        this.enemy = enemy;

        this.displayUltimateString = `<:Yeet:829267937784627200>${BattleInterface.emptyUltimateEmote.repeat(10)}<:Yeet2:829270362516488212>`;
        this.currentColor = '#0099ff';

        this.ultimate = 0;
        this.locationInfo;
        this.originalPlayerHP;
        this.originalEnemyHP;
        this.playerAction;

        this.playerTurnAction;
        this.enemyTurnAction;

        this.active = true;
    }
};


const ultimateEmote = ":Ultimate:822042890955128872";
const emptyUltimateEmote = "<:blank:829270386986319882>";
const ultimateEmoteArray = ["<:1:829267948127649792>", "<:2:829267958836101130>", "<:3_:829267967392088134>", "<:4:829267977559867412>", "<:5:829271937548419093>",
    "<:6:829271966161567774>", "<:7:829271980397166612>", "<:8:829271994205208597>", "<:9:829272014946697246>", "<:10:829272027604713523>"];
const row = new Discord.MessageActionRow()
    .addComponents(
        new Discord.MessageButton()
            .setCustomId('attack')
            .setLabel('⚔️')
            .setStyle('PRIMARY'),
        new Discord.MessageButton()
            .setCustomId('defend')
            .setLabel('🛡️')
            .setStyle('PRIMARY'),
        new Discord.MessageButton()
            .setCustomId('ultimate')
            .setLabel('')
            .setStyle('DANGER')
            .setEmoji(ultimateEmote),
    );
const displayUltimateString = `<:Yeet:829267937784627200>${emptyUltimateEmote.repeat(10)}<:Yeet2:829270362516488212>`;
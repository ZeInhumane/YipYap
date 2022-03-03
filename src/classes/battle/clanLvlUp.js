module.exports = class clanLvlUp {
    constructor(currentExp, clanLevel, userName, clanName) {
        let totalLevelGained = 0;
        let nextLevel = Math.floor(clanLevel * (clanLevel / 10 * 150));
        while (currentExp >= nextLevel) {
            currentExp -= nextLevel;
            totalLevelGained++;
            clanLevel++;
            nextLevel = Math.floor(clanLevel * (clanLevel / 10 * 150));
        }
        this.totalLevelGained = totalLevelGained;
        this.currentExp = currentExp;
        this.nextLevel = nextLevel;
        this.userName = userName;
        this.clanLevel = clanLevel;
        this.clanName = clanName;
    }
    levelUp() {
        if (this.totalLevelGained > 0) {
            return `Congratulations! ${this.clanName} has gained ${this.totalLevelGained} levels!\n${this.clanName} is now at **level ${this.clanLevel}!**\n${this.userName} has gained **${5 * this.totalLevelGained} SP!**`;
        }
        return '';
    }
    getCurrentExp() {
        return this.currentExp;
    }
    getClanLevel() {
        return this.clanLevel;
    }
    getClanSP() {
        let add_sp = 0;
        if (this.totalLevelGained > 0) {
            add_sp = this.totalLevelGained * 2;
        }
        return add_sp;
    }
    getMaxMembers() {
        let addMembers = 0;
        if (this.totalLevelGained > 0) {
            addMembers = this.totalLevelGained * 2;
        }
        return addMembers;
    }
};
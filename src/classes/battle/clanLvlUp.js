module.exports = class clanLvlUp {
    constructor(currentExp, clanLevel) {
        let totalLevelGained = 0;
        let nextLevel = Math.floor(clanLevel * (clanLevel / 10 * 750));
        while (currentExp >= nextLevel) {
            currentExp -= nextLevel;
            totalLevelGained++;
            clanLevel++;
            nextLevel = Math.floor(clanLevel * (clanLevel / 10 * 750));
        }
        this.totalLevelGained = totalLevelGained;
        this.currentExp = currentExp;
        this.nextLevel = nextLevel;
        this.clanLevel = clanLevel;
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
const requireDir = require('require-dir');

module.exports = class AreaInterface {

    /* Constructor */
    constructor() {
        this.init();
    }

    static get areas() { return areas; }
    static get areaDir() { return areaDir; }
    static get getID() { return new this().id; }
    static get getlevelRequired() { return new this().levelRequired; }
    static get getName() { return new this().name; }
    static get getDesc() { return new this().desc; }
};

const areaDir = requireDir('./areas');
const areas = {};
for (const key in areaDir) {
    const area = areaDir[key];
    areas[area.getID] = area;
}
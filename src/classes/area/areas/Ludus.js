const AreaInterface = require('../AreaInterface.js');

module.exports = class Ludus extends AreaInterface {
    init() {
        this.name = "Ludus";
        this.id = 1;
        this.desc = "Ludus is a planet in OASIS created by Gregarious Simulation Systems to serve as the primary establishment for public education within the simulation.";
    }
};
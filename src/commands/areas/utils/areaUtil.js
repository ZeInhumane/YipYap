const AreaInterface = require('../AreaInterface');

exports.getArea = (id) => {
    const areas = Object.entries(AreaInterface.areas);
    if (!id) id = 1;

    for (const [, areaClass] of areas) {
        if (areaClass.getID === id) {
            return areaClass;
        }
    }
};
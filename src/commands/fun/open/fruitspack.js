// const openBase = require('../interface/openBase');
// module.exports = class gacha extends openBase {
//     constructor() {
//     }

//     displayMessage(player, damageTaken, additionalDamage) {
//         return player.name + '\'s turn!\n' + player.name + ' uses their **ULTIMATE** and does ' +
//             +damageTaken + ' damage but **BIG BANG** amplifies the damage to ' + additionalDamage + ' damage!';
//     }

//     ultimate(player, enemy) {
//         const damageTaken = super.calculateDamage(player, enemy);
//         // change in accordance to user stats
//         const additionalDamage = Math.floor(damageTaken * 1.5);
//         enemy.hp -= additionalDamage;
//         return [damageTaken, additionalDamage];
//     }
// };
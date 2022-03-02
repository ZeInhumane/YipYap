// const requireDir = require('require-dir');

// module.exports = class open {
//     constructor(message, args) {
//         this.message = message;
//         this.args = args;
//     }

//     getGachaType() {
//         // Lowercase all args
//         args.map(item => item.toLowerCase());

//         // Finds arguments no matter the position
//         // Finds packAmt
//         let packAmt = 1;
//         const packAmtIndex = args.findIndex(arg => /^[1-9]\d*$/g.test(arg));
//         if (packAmtIndex != -1) {
//             // Extracts packAmt
//             packAmt = args[packAmtIndex];
//             packAmt = parseInt(packAmt);
//             if (packAmt > 5) {
//                 packAmt = 5;
//             }
//             // Removes packAmt from args list
//             args.splice(packAmtIndex, 1);
//         }

//         // Finds packType
//         const packTypeIndex = args.findIndex(arg => /^[a-z]+$/ig.test(arg));
//         if (packTypeIndex == -1) {
//             return 'Please specify a chest or pack that you would like to open', null;
//         }
//         // Extracts packType
//         let packType = args[packTypeIndex];
//         // Removes packType from args list
//         args.splice(packTypeIndex, 1);
//         // Uppercase first letter
//         packType = packType.charAt(0).toUpperCase() + packType.substring(1);

//         let boxType = titleCase(args.join(" "));

//         if (!/^((treasure)? ?(chest)?|pack)$/ig.test(boxType)) {
//             return `Unknown item. Please better specify item to open.`, null;
//         }

//         // Try to find similar item in db
//         const item = await findPartialItem(`${packType}${boxType ? " " + boxType : ""}`);
//         if (!item) {
//             return `That item does not exist!`, null;
//         }
//         if (item.length == 1) {
//             boxType = item[0].itemName.split(' ');
//             boxType.shift();
//             boxType = boxType.join(' ');
//             if (boxType == "" || !/^((treasure)? ?(chest)?|pack)$/ig.test(boxType)) {
//                 return `Specify chest or pack to open.`, null;
//             }
//         } else {
//             // maybe send message
//             return `More than 1 item similar to ${packType}${boxType ? " " + boxType : ""}. Need to be more specific.`, null;
//         }
//         return packType, boxType
//     }
    

//     displayMessage() {
//         return "";
//     }
//     static get boxes() { return boxes; }
//     static get openDir() { return openDir; }
// };

// const openDir = requireDir('./../open');
// const boxes = {};
// for (const key in openDir) {
//     const boxType = openDir[key];
//     boxes[boxType.getID] = box;
// }
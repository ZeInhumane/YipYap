module.exports = {
    execute(message, winner, loser) {
        const User = require('../../models/user');
        message.channel.send(winner.player.name + ' defeated ' + (loser.name || loser.player.name) + '!');
        var moneyEarned = parseInt(loser.level);
        var commonTreasureChest = false;
        const itemName = "common";
        const itemQuantity = 1;
        // change this to change the chances of getting a lootbox currently set at 50%
        if(Math.floor(Math.random() * 2 + 1) == 1){
            commonTreasureChest = true;
        }
        User.findOne({ userID: winner.userID }, (err, user) => {
            if (commonTreasureChest == true){
                var indexOfItemInInv = user.inv.findIndex((item) => {
                    if (item.itemName == itemName) {
                        return true;
                    }
                });
                if (indexOfItemInInv > -1) {
                    user.inv[indexOfItemInInv].itemQuantity += itemQuantity;
                }
                else {
                    user.inv.push({ itemName: itemName, itemQuantity: itemQuantity });
                }
                user.markModified('inv');
                message.channel.send(`You've gotten: 1 <a:treasure_chest:815220359699365908> .`);
            }
            user.currency += moneyEarned;
            user.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
        });
        message.channel.send(winner.player.name + " got " + moneyEarned + "<:cash_24:751784973488357457>");
    }
}
const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const botData = require('../models/botData');
module.exports = {
    name: "pack",
    description: "Open premium packs bought at the shop",
    syntax: "{pack type} {quantity to open}",
    cooldown: 3,
    aliases: ['packs', 'p'],
    category: "Fun",
    execute(message, args) {
        async function getWeaponID() {
            let currentEquipmentID = await botData.findOne({}, (err, user) => {
                user.equipmentID++;
                user.save();
            });
            return currentEquipmentID.equipmentID;
        }
        // get type of packs to open
        let packType = args[0];
        let packEmbed = new Discord.MessageEmbed()
                    .setTitle(`Pack opened!`)
                    .setColor('#000001');
                ;
        
        function titleCase(str) {
            var splitStr = str.toLowerCase().split(' ');
            for (var i = 0; i < splitStr.length; i++) {
                // You do not need to check if i is larger than splitStr length, as your for does that for you
                // Assign it back to the array
                splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
            }
            // Directly return the joined string
            packType = splitStr.join(' ');
        }
        titleCase(packType);
        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                message.channel.send("You have not set up a player yet! Do =start to start.");
                return;
            }
            else if (!user.inv[`${packType} Pack`]) {
                message.channel.send(`You do not own ${packType} packs.`);
                return;
            }

            // get number to open
            let packAmt = 0;
            if (args[1] === 'all') {
                packAmt = user.inv[`${packType} Pack`].quantity;
            }
            else {
                packAmt = parseInt(args[1]);
                if (isNaN(packAmt)) {
                    packAmt = 1;
                }
            }

            if (user.inv[`${packType} Pack`].quantity < args[1]) {
                message.channel.send(`You do not own enough ${packType} packs to open yet.`)
                return;
            }
            else {
                let guest = user.player.name;
                switch (packType) {
                    case 'Fruits':
                        const spoils = {
                            "Apple": 1,
                            "Banana": 2,
                            "Orange": 3,
                            "Pear": 4,
                        }
                        const emoji = {
                            'apple_emote': '🍎',
                            'banana_emote': '🍌',
                            'orange_emote': '🍊',
                            'pear_emote': '🍐'
                        }
                        names = Object.keys(spoils)
                        emotes = Object.values(emoji)
                        amts = Object.values(spoils)
                        for (var f = 0; f < names.length; f++) {
                            if (user.inv[names[f]]) {
                                user.inv[names[f]].quantity += amts[f] * packAmt;
                            }
                            else {
                                user.inv[names[f]] = { quantity: amts[f] * packAmt,
                                    emote:emotes[f],
                                    type:"fruit",
                                 };
                            }
                            packEmbed.addField(`${guest} gained ${amts[f] * packAmt} ${names[f]}${(amts[f] * packAmt)> 1 ? "s" : ""}.`,'\u200b')
                        }
                        message.channel.send(packEmbed);
                        break;

                    case 'Gold':
                        function randomGoldgen(min, max) {
                            const r = (Math.random() * (max - min)) + min
                            return Math.floor(r)
                        }

                        let goldTotal = 0;
                        // unfair generation, low prob of high numbers, but officially get between 30 to 120 gold
                        for (i = 0; i < packAmt; i++) {
                            var prec = randomGoldgen(10, 100.01) / 100
                            var gachaGold = randomGoldgen(30, prec * 120)
                            goldTotal += gachaGold;
                        }
                        user.currency += goldTotal;
                        message.channel.send(`${guest} gained ${goldTotal} currency from Gold Pack <:cash_24:751784973488357457>​`);
                        break;
                    case 'Jericho':
                        var jericho = 0;
                        for (i = 0; i < packAmt; i++) {
                            let jroll = Math.floor(Math.random() * 6);
                            if (jroll == 0){
                                jericho += 1;
                            }
                            else{
                                jericho += jroll;
                            }
                        }
                            if (user.inv['Jericho Jehammad']) {
                                user.inv['Jericho Jehammad'].quantity += jericho;
                            }
                            else {
                                user.inv['Jericho Jehammad'] = { quantity:jericho, 
                                    emote:"<:Jericho:823551572029603840>",
                                    type:"special"
                                };
                            }
                        
                        message.channel.send(`${guest} gained ${jericho} Jericho Jehammad${jericho > 1 ? "s" : ""}.`);

                        break;
                    case 'Swords':
                        if(packAmt > 5){
                            message.channel.send(`You may only open up to 5 Swords packs at once!`);
                            return;
                        }
                        const itemname = ['Wooden Sword','Stone Sword','Iron Sword'];                        
                        const swords = {
                            'Wooden Sword':{
                                'emote':"",
                                'stats':{
                                    0:"+2atk"
                                }
                                    
                            },
                            'Stone Sword':{
                                'emote':"",
                                'stats':{
                                    0:"+3atk"
                                }
                                    
                            },
                            'Iron Sword':{
                                'emote':"",
                                'stats':{
                                    0:"+4atk"
                                }
                                    
                            }
                        }
                        
                        for (i = 0; i < packAmt; i++) {
                            let randomswordid = Math.floor(Math.random() * itemname.length);
                            if (randomswordid >= 2 && Math.floor(Math.random() * itemname.length) <= 2){
                                randomswordid -= 1
                            }
                            if (Math.floor(Math.random() * 100) >= 95){
                                randomswordid = itemname.length -1
                            }
                            let swordprize = itemname[randomswordid];
                            let swordPrizeObject = `${swordprize}#${await getWeaponID()}`
                                user.inv[swordPrizeObject] = swords[swordprize];
                                user.inv[swordPrizeObject].type = 'equipment'
                                user.inv[swordPrizeObject].equipmentType = 'weapon';
                                user.inv[swordPrizeObject].quantity = 1;
                            packEmbed.addField(`${guest} gained 1 ${swordprize} opening a Swords Pack.`,'\u200b')
                        }
                        message.channel.send(packEmbed);
                        break;
                    default:
                        message.channel.send(`This pack does not exist.`);
                        return;
                }

                user.inv[`${packType} Pack`].quantity -= packAmt;
                if (user.inv[`${packType} Pack`].quantity == 0) {
                    delete user.inv[`${packType} Pack`];
                }
                message.channel.send(`${guest} has successfully opened ${packAmt} ${packType} pack${packAmt > 1 ? "s" : ""}.`)
                user.markModified('inv');
                user.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
            }
        });
    }
}
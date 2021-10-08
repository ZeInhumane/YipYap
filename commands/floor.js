QuickLittleWolf
#5749
😶Sleep is life
jerick5555, matthew

matthew — 10/01/2021
lol
jerick5555 — 10/01/2021
Why not both?
matthew — 10/01/2021
why
QuickLittleWolf — 10/01/2021
They thinking of hardcoding the answers in the code for test case....
They desperate...
matthew — 10/01/2021
HHAHAHAH
DO IT
XDDD
jerick5555 — 10/01/2021
Bruh
matthew — 10/01/2021
thats what we did akso
also
jerick
its ok
i managed to get my teams morale back
we talked about lifehack
they won $400 from lifehack
jerick5555 — 10/01/2021
Bruh
QuickLittleWolf — 10/01/2021
I so want giv them my ans....
jerick5555 — 10/01/2021
They that team?
That got lucky?
QuickLittleWolf — 10/01/2021
Bruh....
matthew — 10/01/2021
yea
alphaList = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
matthew — 10/01/2021
kenneth
solo carry
our comp was easy enough if u have a decent cp
u can win
QuickLittleWolf — 10/01/2021
u told them we were also inside....?
matthew — 10/01/2021
no
i didnt
QuickLittleWolf — Today at 9:25 PM
guys... how....?
jerick5555 — Today at 9:25 PM
idk
matthew — Today at 9:25 PM
idt
idw
we got bed bootcamp
QuickLittleWolf — Today at 9:25 PM
i mean.....
matthew — Today at 9:25 PM
Image
matthew — Today at 9:46 PM
i think
they expected more peopel
QuickLittleWolf — Today at 9:46 PM
......?
matthew — Today at 9:46 PM
cuz
everyone i talked to
QuickLittleWolf — Today at 9:46 PM
this are all our regulars...
matthew — Today at 9:46 PM
doesnt wanna join
expected more people
matthew — Today at 9:55 PM
can one of u check the pr
i wanna see how it progresses
Image
go to pangseh > create new branch > add new code > request pull request from me
@QuickLittleWolf
floor.js has new code
const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const botLevel = require('../models/botLevel');
const findPrefix = require('../functions/findPrefix');
Expand
message.txt
3 KB
﻿
const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const botLevel = require('../models/botLevel');
const findPrefix = require('../functions/findPrefix');

module.exports = {
    name: "floor",
    description: "Move to a new location to receive different prizes :)",
    syntax: "{Floor to access}",
    cooldown: 10,
    aliases: ['fl'],
    category: "Economy",
    execute(message, args) {
        User.findOne({ userID: message.author.id }, async (err, user) => {
            if (user == null) {
                //Getting the prefix from db
                const prefix = await findPrefix(message.guild.id);
                message.channel.send(`You have not set up a player yet! Do ${prefix}start to start.`);
                return;
            }

            let floorToAccess = parseInt(args[0]);
            let embedColor = "#0099ff"
            //checks if argument is keyed in properly
            if(isNaN(floorToAccess)) floorToAccess = parseInt(user.location)
            let locationInfo = await botLevel.findOne({ 'Location': floorToAccess }).exec();
            if (!locationInfo) {
                message.channel.send("It looks like this isn't a valid location")
                return;
            }
            locationInfo = locationInfo._doc;
            
            userInfo = await User.findOne({ userID: message.author.id }, (err, user) => {
                if (locationInfo.Requirement > user.level) {
                    message.channel.send(`It looks like you do not meet the requirements to access this floor, come back when you are level ${locationInfo.Requirement}`);
                    return;
                }
                user.location = floorToAccess;
                user.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));

                const floorEmbed = new Discord.MessageEmbed()
                    .setColor(embedColor)
                    .setTitle(`You have successfully entered location ${floorToAccess} `)
                    .setAuthor(message.member.user.tag, message.author.avatarURL(), 'https://discord.gg/h4enMADuCN')
                    .addField(`**${locationInfo.LocationName}**`, `\u200b`)
                    .addField(`${locationInfo.LocationName} applied enemy buffs`, `**Health** Multiplier: ${locationInfo.Buff.hp}  **Attack** Multiplier: ${locationInfo.Buff.attack}\n **Defense** Multiplier: ${locationInfo.Buff.defense}  **Speed** Multiplier: ${locationInfo.Buff.speed}`)
                    .addField(`Additional rewards due to current location`, `**Experience** Multiplier:${locationInfo.Rewards.ExpMultiplier}  **Gold** Multiplier: ${locationInfo.Rewards.GoldMultiplier}`)
                    .setImage(locationInfo.LocationImage)
                message.channel.send({ embeds: [floorEmbed] });
            });
        });
    }
}
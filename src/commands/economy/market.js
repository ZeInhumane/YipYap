const Listing = require('../../models/listing');
const Discord = require('discord.js');
const titleCase = require('../../functions/titleCase');

module.exports = {
  name: "mk",
  description: "Stuff.",
  syntax: `buy {item name} {quantity}\nmk sell {item name} {quantity}\nmk remove {item name}\nmk list`,
  aliases: [''],
  category: "Economy",
  cooldown: 5,
  async execute({ message, args, user }) {

    let option = args.shift()?.toLowerCase();
    if (!option) {
      return;
    }

    await handleOption({ message, args, user, option })

    const entriesPerPage = 10;
    let entriesOnCurrentPage = 0;

    let currentColor = '#0099ff';

    const row = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
          .setCustomId('back')
          .setLabel('◀️')
          .setStyle('PRIMARY'),
        new Discord.MessageButton()
          .setCustomId('forward')
          .setLabel('▶️')
          .setStyle('PRIMARY'),
        new Discord.MessageButton()
          .setCustomId('delete')
          .setLabel('🗑️')
          .setStyle('DANGER'),
      );
  },
};

marketListing = {
  title: "Global Market :shopping_cart:",
  description: "All the cards listed in the Global Market that matches your requirements are shown below!\n\n",
  author: true
}

listingNotAvailable = {
  title: "Error :no_entry:",
  description: "Summoner, this card isn't available in the market! Either you own the card already, it might've just been bought, or you might've inserted the wrong card ID.",
  footer: "If you require assistance with this command, please type .help mk buy for more info!",
  author: true
}

confirmation = {
  title: "Confirmation <:MarinHype:948598624156274738>",
}

confirmationFailed = {
  title: "Request Declined... ",
  description: "Summoner, how unfortunate! This card has just been sold to another user!",
}

confirmationRow = new Discord.MessageActionRow()
  .addComponents(
    new Discord.MessageButton()
      .setCustomId('confirm')
      .setLabel('✅')
      .setStyle('PRIMARY'),
    new Discord.MessageButton()
      .setCustomId('decline')
      .setLabel('❌')
      .setStyle('DANGER'),
  );

async function handleOption({ message, args, user, option }) {
  switch (option) {
    case 'buy':
      buy({ message, args, user });
      break;
    case 'sell':
      handleSell({ message, args, user });
      break;
    case 'list':
      list({ message, args, user });
      break;
    case 'remove':
      remove({ message, args, user });
      break;
    default:
      return;
  }
}

async function buy({ message, args, user }) {
  return;
}

async function handleSell({ message, args, user }) {
  let { itemQuantity, itemName, itemPrice } = parseInt(args[0]) ? {
    itemQuantity: parseInt(args[0]),
    itemName: args.slice(1, args.length - 1).join(' '),
    itemPrice: parseInt(args[args.length - 1])
  } : {
    itemQuantity: 1,
    itemName: args.slice(0, args.length - 1).join(' '),
    itemPrice: parseInt(args[args.length - 1])
  };

  if (!itemName) return message.channel.send('Please enter a valid item name.');
  itemName = titleCase(itemName);

  if (!itemPrice) return message.channel.send('Please enter a valid item price.');

  items = Object.entries(user.inv)
  for (const [name, info] of items) {
    if (name != itemName) continue;

    if (info.quantity < itemQuantity) return message.channel.send('You do not have enough of this item to sell.');

    await confirmationSell({ message, args, user, itemQuantity, itemName, itemPrice, info });

    return;
  }

  return message.channel.send('You do not have this item to sell.');
}

async function confirmationSell({ message, args, user, itemQuantity, itemName, itemPrice, info }) {
  confirmation.description = `Summoner, are you sure you want to place ${itemQuantity === 1 ? '' : `${itemQuantity} of`} your **${info.rarity}** Level __${info.level}__ **${itemName}** [Ascension: ${info.ascension}] in the market for **${itemPrice}** Gold?`;

  console.log(info)
  await message.channel.send({ embeds: [confirmation] });
  // const listing = new Listing({
  //   user: user.id,
  //   item: itemName,
  //   quantity: itemInfo.quantity,
  //   price: itemInfo.price,
  // });
  // await listing.save();
}
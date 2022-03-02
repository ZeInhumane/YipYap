const Listing = require('../../models/listing');
const Discord = require('discord.js');
const titleCase = require('../../functions/titleCase');
const mongoose = require('mongoose');

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
  color: '#0099ff'
}

confirmationFailed = {
  title: "Request Declined... ",
  description: "Summoner, how unfortunate! This card has just been sold to another user!",
}

listingConfirmed = {
  title: "Success! :white_check_mark:",
  color: '#0099ff'
}

confirmationRow = new Discord.MessageActionRow()
  .addComponents(
    new Discord.MessageButton()
      .setCustomId('confirm')
      .setLabel('✅')
      .setStyle('SUCCESS'),
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

    if (info.quantity - info.listed < itemQuantity) return message.channel.send('You do not have enough of this item to sell.');

    await confirmationSell({ message, user, itemQuantity, itemName, itemPrice, info });

    return;
  }

  return message.channel.send('You do not have this item to sell.');
}

async function confirmationSell({ message, user, itemQuantity, itemName, itemPrice, info }) {

  if (info.type == 'fruit') {
    confirmation.description = `Are you sure you want to place ${itemQuantity === 1 ? '' : `**${itemQuantity}** of`} your **${itemQuantity === 1 ? itemName : `${itemName}s`}** on the market for **${itemPrice}** Gold <:cash_24:751784973488357457>${itemQuantity === 1 ? '' : " **each** "}?`;
  }

  if (info.type == 'equipment') {
    confirmation.description = `Are you sure you want to place ${itemQuantity === 1 ? '' : `**${itemQuantity}** of`} your **${info.rarity}** Level __${info.level}__ **${itemName}** [Ascension: ${info.ascension}] in the market for **${itemPrice}** Gold <:cash_24:751784973488357457>?`;
  }

  confirmationMessage = await message.channel.send({ embeds: [confirmation], components: [confirmationRow] });

  const filter = btnInt => {
    btnInt.deferUpdate();
    return btnInt.user.id === message.author.id;
  };

  await confirmationMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
    .then(async int => {
      const selection = int.customId;

      if (selection === 'decline') {
        await confirmationMessage.delete();
        return;
      }

      if (selection === 'confirm') {
        await confirmationMessage.delete();

        user.inv[itemName].listed = itemQuantity;
        user.markModified('inv');
        await user.save();

        const listing = new Listing({
          _id: mongoose.Types.ObjectId(),
          userID: message.author.id,
          itemCost: itemPrice,
          itemName,
          quantity: itemQuantity,
          item: info,
          type: info.type
        });

        await listing.save()
          .then(result => console.log(`A new listing was created by ${result._doc.userID}`))
          .catch(err => console.error(err));

        listingConfirmed.description = `You have successfully placed your **${info.rarity}** Level __${info.level}__ **${itemName}** [Ascension: ${info.ascension}] in the market for **${itemPrice}** Gold <:cash_24:751784973488357457>!`;

        await message.channel.send({ embeds: [listingConfirmed] });

        return;
      }

      return
    })
    .catch(async () => {
      embed = confirmationMessage.embeds[0];
      embed.color = '#FF0000';
      confirmationMessage.edit({ embeds: [embed], components: [] });
      return;
    });
}
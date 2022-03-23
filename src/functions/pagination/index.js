const { Message } = require("discord.js");
const Paginate = require("./Paginate");

Message.prototype.paginate = async function (pages, options, emojis) {
    const paginated = new Paginate(this.client, this, pages, options, emojis);
    await paginated.init();
};

module.exports = Paginate;

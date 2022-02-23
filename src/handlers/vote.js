const User = require('../models/user');
const client = require('../../index.js').client;
module.exports = (userID) => {

    client.emit('vote', userID, user);
    const user = User.findOne({ userID: userID.id });
    if (!user) {
        return;
    }
};
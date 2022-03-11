const mongoose = require('mongoose');
require('dotenv').config();

exports.init = () => {
    const dbOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        // Don't build indexes
        autoIndex: false,
        // Maintain up to 10 socket connections
        poolSize: 10,
        // Keep trying to send operations for 5 seconds
        serverSelectionTimeoutMS: 5000,
        // Close sockets after 45 seconds of inactivity
        socketTimeoutMS: 45000,
        // Use IPv4, skip trying IPv6
        family: 4,
    };

    // Somehow this works and connects so don't change it thanks
    mongoose.connect(process.env.MONGODB_URI, dbOptions);
    mongoose.set('useFindAndModify', false);
    mongoose.Promise = global.Promise;

    mongoose.connection.on('connected', () => {
        console.log('Mongoose has successfully connected!');
    });

    mongoose.connection.on('err', err => {
        console.error(`Mongoose connection error: \n${err.stack}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('Mongoose connection lost');
    });
};


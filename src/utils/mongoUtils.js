const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGODB_URI, { useUnifiedTopology: true });

exports.getCollection = async (name) => {
    return client.db("YipYap").collection(name);
};

exports.client = client;
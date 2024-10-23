const mongoose = require('mongoose');
const process = require('node:process');

const connect2Db = async () => {
    await mongoose.connect(process.env.MONGO_INSTANCE);
};

module.exports = connect2Db;

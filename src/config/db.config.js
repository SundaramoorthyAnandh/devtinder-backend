const mongoose = require('mongoose');

const connect2Db = async () => {
    await mongoose.connect(
        'mongodb+srv://sundaramoorthyanandh:ea2007cricket@dev-tinder.gdmc6.mongodb.net/DevTinder'
    );
};

module.exports = connect2Db;

const mongoose = require("mongoose");
const { CONSTANTS } = require("../config/constants.config");

const connectDB = async () => {
    try {
        await mongoose.connect(CONSTANTS.MONGO_CONNECTION_STRING);
    } catch (e) {
        console.log(e);
    }
};

module.exports = connectDB;

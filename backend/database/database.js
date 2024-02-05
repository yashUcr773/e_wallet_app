const mongoose = require("mongoose");
const { CONSTANTS } = require("../config/constants.config");

mongoose.connect(CONSTANTS.MONGODBCONNECTION + "paytm");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
});

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    },
});

const USER = mongoose.model("Users", userSchema);

const ACCOUNT = mongoose.model("Accounts", accountSchema);

module.exports = {
    USER,
    ACCOUNT,
};

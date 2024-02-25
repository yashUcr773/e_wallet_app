require("dotenv").config();
const CONSTANTS = {
    MONGO_DB_CONNECTION: process.env.MONGO_DB_CONNECTION || "123",
    JWT_SECRET: process.env.JWT_SECRET || "123",
    EXPIRY_TIME: 1000 * 60 * 60 * 24,
};

module.exports = {
    CONSTANTS,
};

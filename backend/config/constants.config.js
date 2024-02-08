const CONSTANTS = {
    MONGODBCONNECTION: process.env.mongoDBString || "123",
    JWTSECRET: process.env.JWTSecret || "123",
    EXPIRYTIME: 1000*60*60*24
};

module.exports = {
    CONSTANTS,
};

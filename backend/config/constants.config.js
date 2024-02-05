const CONSTANTS = {
    MONGODBCONNECTION: process.env.mongoDBString || "123",
    APIBASEURL: "https://localhost:3000/api/v1",
    JWTSECRET: process.env.JWTSecret || "123",
};

module.exports = {
    CONSTANTS,
};

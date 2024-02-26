const { allowedOrigins } = require("./allowedOrigins");
const { CONSTANTS } = require("./constants.config");
const corsOptions = {
    origin: (origin, callback) => {
        if (
            allowedOrigins.indexOf(origin) !== -1 ||
            CONSTANTS.ENV == "development"
        ) {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by CORS, Sender ${origin}`));
        }
    },
    optionsSuccessStatus: 200,
};

module.exports = corsOptions;

const { CONSTANTS } = require("./config/constants.config");
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const PORT = CONSTANTS.PORT || 3000;
const cookieParser = require("cookie-parser");
const connectDB = require("./database/databaseConnection");
const mongoose = require("mongoose");
const {
    credentials,
} = require("./middlewares/access-control-credentials.middleware");

// connect to mongodb
connectDB();

// Set allow credentials to true to send cookie
app.use(credentials);

// Cross-Origin Resource Sharing
app.use((req, res, next) => {
  if (req.path === "/") {
    // Allow all origins for the root path
    cors()(req, res, next);
  } else {
    // Use CORS with options for other routes
    cors(corsOptions)(req, res, next);
  }
});

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// to parse cookies sent with request
app.use(cookieParser());

// routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/api/v1/users", require("./routes/api/v1/users.routes"));
app.use("/api/v1/accounts", require("./routes/api/v1/account.routes"));

// redirect backend to fe
app.use("/", (req, res) => {
    return res.redirect(CONSTANTS.FEURL);
});

// global router catcher
app.all("*", (req, res) => {
    return res.redirect(CONSTANTS.NOTFOUND);
});

mongoose.connection.once("open", () => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

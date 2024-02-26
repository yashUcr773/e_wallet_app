const USERS_DB = require("../database/user.database");
const ACCOUNTS_DB = require("../database/accounts.database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { tokenCookieOptions } = require("../config/cookieOptions");
const {
    USER_SIGNUP_VALIDATOR,
    USER_SIGNIN_VALIDATOR,
} = require("../validations/user.validations");
const { CONSTANTS } = require("../config/constants.config");
const { getRandomBalance } = require("../utils/helper.utils");

/**
Takes in email and password from request.
Checks if user and password exists in database.
Sets refresh token in DB and cookie
Returns found user object and accesstoken
*/
const handleLogin = async (req, res) => {
    try {
        // check if inputs are valid
        const { email, password } = req.body;
        const { success, error } = USER_SIGNIN_VALIDATOR.safeParse({
            email,
            password,
        });

        if (!success) {
            res.cookie("jwt", "", tokenCookieOptions);
            return res.status(400).json({
                message: "Email and password are required.",
                success: false,
                error: error.issues,
            });
        }

        // check if user exists in db
        const foundUser = await USERS_DB.findOne({
            email: { $regex: new RegExp(email, "i") },
        });
        if (!foundUser) {
            res.cookie("jwt", "", tokenCookieOptions);
            return res.status(401).json({
                success: false,
                message: "Email or password incorrect.",
            });
        }

        // evaluate password
        const match = await bcrypt.compare(password, foundUser.password);
        if (!match) {
            res.cookie("jwt", "", tokenCookieOptions);
            return res.status(401).json({
                success: false,
                message: "Email or password incorrect.",
            });
        }

        const [accessToken, refreshToken] = _generateTokens({
            userId: foundUser._id,
            email: foundUser.email,
        });
        foundUser.refreshToken = refreshToken;

        const updatedUser = await USERS_DB.findByIdAndUpdate(
            foundUser._id,
            {
                refreshToken,
            },
            { new: true }
        );

        // send cookie and response
        res.cookie("jwt", refreshToken, tokenCookieOptions);
        return res.json({
            success: true,
            message: "Login Successful",
            user: {
                userId: updatedUser._id,
                email: updatedUser.email,
                firstname: updatedUser.firstname,
                lastname: updatedUser.lastname,
                accessToken: accessToken,
            },
        });
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({
                success: false,
                message: "Server Error",
                error: e.message,
            });
    }
};

/**
Gets refresh token from cookie, if not found, return
Delete refresh token in DB and cookie
Returns
*/
const handleLogout = async (req, res) => {
    try {
        // get inputs
        const cookies = req.cookies;

        // if cookie does not exists, return
        if (!cookies?.jwt) {
            return res.status(200).json({
                success: true,
                message: "Log out successful.",
            });
        }

        // get refresh token
        const refreshToken = cookies["jwt"];

        // find user from db with same refresh token
        const foundUser = await USERS_DB.findOne(
            {
                refreshToken: refreshToken,
            },
            { _id: 1 }
        );

        // if user does not exist, delete cookie and return
        if (!foundUser) {
            res.clearCookie("jwt", tokenCookieOptions);
            return res.status(200).json({
                success: true,
                message: "Log out successful.",
            });
        }

        // update db to have refresh token as empty
        await USERS_DB.findByIdAndUpdate(
            foundUser._id,
            {
                refreshToken: "",
            },
            { new: true }
        );

        // delete cookie and return
        res.clearCookie("jwt", tokenCookieOptions);
        return res
            .status(200)
            .json({ success: true, message: "Log out successful" });
    } catch (e) {
        console.log(e);
        return res
            .status(403)
            .json({
                success: false,
                message: "Authorization Error",
                error: e.message,
            });
    }
};

/**
Takes in email and password from request.
Checks if user and password exists in database.
Sets user, refresh token in DB and cookie.
Returns created user object and accesstoken.
TODO: Update to make only 1 db call to create user and set refresh token
*/
const handleSignup = async (req, res) => {
    try {
        // check if inputs are valid
        const { firstname, lastname, email, password } = req.body;
        const { success, error } = USER_SIGNUP_VALIDATOR.safeParse({
            firstname,
            lastname,
            email,
            password,
        });

        if (!success) {
            return res.status(400).json({
                message: "Email and password are required.",
                success: false,
                error: error.issues,
            });
        }

        // check for duplicate emails in the db
        const duplicate = await USERS_DB.findOne({
            email: { $regex: new RegExp(email, "i") },
        });

        if (duplicate) {
            return res
                .status(409)
                .json({ success: false, message: "email exists" }); //Conflict
        }

        //encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //store the new user
        const newUser = await USERS_DB.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            refreshToken: "",
        });

        const account = await ACCOUNTS_DB.create({
            userId: newUser._id,
            balance: getRandomBalance(1, 10000),
        });

        // generate tokens
        const [accessToken, refreshToken] = _generateTokens({
            userId: newUser._id,
            email: newUser.email,
        });

        // add refresh token in DB
        const updatedUser = await USERS_DB.findByIdAndUpdate(
            newUser.id,
            {
                refreshToken: refreshToken,
            },
            { new: true }
        );

        // send cookie and response
        res.cookie("jwt", refreshToken, tokenCookieOptions);
        return res.status(201).json({
            success: true,
            message: "User Created Successfully.",
            user: {
                userId: updatedUser._id,
                email: updatedUser.email,
                firstname: updatedUser.firstname,
                lastname: updatedUser.lastname,
                accessToken: accessToken,
            },
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, message: e.message });
    }
};

/**
Gets refresh token from cookie, if not found, return
find user with said refresh token from DB
Delete refresh token in DB and cookie
Returns
*/
const handleRefreshToken = async (req, res) => {
    try {
        // get input
        const cookies = req.cookies;
        const sendUserData = req.query.sendUserData;

        console.log(cookies);
        console.log(sendUserData);

        // if token not in cookie, return
        if (!cookies?.jwt) {
            return res.status(403).json({
                success: false,
                message: "Authorization Error",
            });
        }

        // get token
        const refreshToken = cookies["jwt"];

        console.log(await USERS_DB.find({}));

        // find user in DB
        const foundUser = await USERS_DB.findOne({ refreshToken });

        console.log(foundUser);

        // If user not found
        if (!foundUser) {
            return res.status(403).json({
                success: false,
                message: "Authorization Error",
            });
        }

        // verify if token is correct
        await jwt.verify(refreshToken, CONSTANTS.REFRESH_TOKEN_SECRET);

        // generate new tokens
        const [newAccessToken, newRefreshToken] = _generateTokens({
            userId: foundUser._id,
            email: foundUser.email,
        });

        return res.status(200).json({
            success: true,
            message: "Token Refreshed",
            newAccessToken,
            user: sendUserData && {
                userId: foundUser._id,
                firstname: foundUser.firstname,
                lastname: foundUser.lastname,
                email: foundUser.email,
            },
        });
    } catch (e) {
        console.log(e);
        return res.status(403).json({
            success: false,
            message: "Authorization Error",
            error: e.message,
        });
    }
};

/**
Takes in userId and email.
Generate accessToken and refreshToken
return [accessToken, refreshToken]
*/
function _generateTokens({ userId, email }) {
    const accessToken = jwt.sign(
        {
            userInfo: {
                userId,
                email,
            },
        },
        CONSTANTS.ACCESS_TOKEN_SECRET,
        { expiresIn: CONSTANTS.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
        {
            userInfo: {
                userId,
                email,
            },
        },
        CONSTANTS.REFRESH_TOKEN_SECRET,
        { expiresIn: CONSTANTS.REFRESH_TOKEN_EXPIRY }
    );

    return [accessToken, refreshToken];
}

module.exports = {
    handleSignup,
    handleLogin,
    handleLogout,
    handleRefreshToken,
};

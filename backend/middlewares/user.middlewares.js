const { CONSTANTS } = require("../config/constants.config");

const { USERSIGNUP, USERSIGNIN } = require("../validation/user.validation");
const db = require("../database/database");
const JWT = require("jsonwebtoken");
const { hasher } = require("../utils/helper.utils");

function userInputValidator(method) {
    if (method == "signup") {
        return function (req, res, next) {
            const email = req.body.email;
            const firstname = req.body.firstname;
            const lastname = req.body.lastname;
            const password = req.body.password;

            if (
                USERSIGNUP.safeParse({
                    email,
                    firstname,
                    lastname,
                    password,
                }).success
            ) {
                next();
            } else {
                return res.status(411).json({
                    message: "Incorrect inputs",
                });
            }
        };
    } else {
        return function (req, res, next) {
            const email = req.body.email;
            const password = req.body.password;

            if (
                USERSIGNIN.safeParse({
                    email,
                    password,
                }).success
            ) {
                next();
            } else {
                return res.status(411).json({
                    message: "Email already taken / Incorrect inputs",
                });
            }
        };
    }
}

function userExistsMiddleware(method) {
    if (method == "signup") {
        return async function (req, res, next) {
            const email = req.body.email;

            res.locals.userExists = false;
            let user = await db.USER.findOne({
                email,
            });
            if (user) {
                res.locals.userExists = true;
                res.locals.user = user;
            }
            next();
        };
    } else {
        return async function (req, res, next) {
            const email = req.body.email;
            const password = req.body.password || "";

            res.locals.userExists = false;
            let user = await db.USER.findOne({
                email,
                password: hasher(password),
            });
            if (user) {
                res.locals.userExists = true;
                res.locals.user = user;
            }
            next();
        };
    }
}

function authMiddleware(req, res, next) {
    try {
        const authorization = req.headers?.authorization?.split(" ")[1];
        const { userId } = JWT.verify(authorization, CONSTANTS.JWTSECRET);
        res.locals.userId = userId;
        next();
    } catch (e) {
        return res.status(403).json({
            message: "Invalid Credentials",
        });
    }
}

module.exports = {
    authMiddleware,
    userExistsMiddleware,
    userInputValidator,
};

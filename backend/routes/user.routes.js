const express = require("express");
const router = express.Router();
const { hasher, getRandomBalance } = require("../utils/helper.utils");
const db = require("../database/database");
const JWT = require("jsonwebtoken");
const { CONSTANTS } = require("../config/constants.config");
const {
    userInputValidator,
    userExistsMiddleware,
    authMiddleware,
} = require("../middlewares/user.middlewares");

const { USERUPDATE } = require("../validation/user.validation");

router.post(
    "/signup",
    userInputValidator("signup"),
    userExistsMiddleware("signup"),
    async (req, res) => {
        try {
            const email = req.body?.email?.toLowerCase();
            const firstname = req.body.firstname;
            const lastname = req.body.lastname;
            const password = req.body.password;

            if (res.locals.userExists) {
                return res.status(411).json({
                    message: "Email already taken",
                });
            }

            const user = await db.USER.create({
                email,
                firstname,
                lastname,
                password: hasher(password),
            });

            const account = await db.ACCOUNT.create({
                userId: user._id,
                balance: getRandomBalance(1, 10000),
            });

            const token = JWT.sign(
                {
                    userId: user._id,
                    expiryAt: Date.now() + CONSTANTS.EXPIRYTIME,
                },
                CONSTANTS.JWTSECRET
            );
            return res.status(200).json({
                message: "User created successfully",
                token: token,
                userId: user._id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
            });
        } catch (e) {
            console.log(e);
            return res.status(411).json({
                message: "Error while logging in",
            });
        }
    }
);

router.post("/signin", userExistsMiddleware("signin"), async (req, res) => {
    try {
        if (!res.locals.userExists) {
            return res.status(411).json({
                message: "User does not exist",
            });
        }

        const user = res.locals.user;

        const token = JWT.sign(
            { userId: user._id, expiryAt: Date.now() + CONSTANTS.EXPIRYTIME },
            CONSTANTS.JWTSECRET
        );
        return res.status(200).json({
            token: token,
            userId: user._id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
        });
    } catch (e) {
        console.log(e);
        return res.status(411).json({
            message: "Error while logging in",
        });
    }
});

router.put("/", authMiddleware, async (req, res) => {
    try {
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const password = req.body.password;


        const { success } = USERUPDATE.safeParse({
            firstname,
            lastname,
            password,
        });

        if (!success) {
            return res.status(411).json({
                message: "Incorrect inputs",
            });
        }

        let updateObj = {};
        if (firstname) {
            updateObj.firstname = firstname;
        }
        if (lastname) {
            updateObj.lastname = lastname;
        }

        if (password) {
            updateObj.password = hasher(password);
        }


        let user = await db.USER.findOneAndUpdate(
            {
                _id: res.locals.userId,
            },
            updateObj,
            {
                new: true,
                projection: { lastname: 1, email: 1, firstname: 1, _id: 1 },
            }
        );

        return res.status(200).json({
            message: "Updated successfully",
            data: {
                userId: user._id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
            },
        });
    } catch (e) {
        return res.status(411).json({
            message: "Error while updating information",
        });
    }
});

router.get("/bulk", authMiddleware, async (req, res) => {
    try {
        const filter = req.query.filter || "";
        const regexFilter = new RegExp(filter, "i");
        const users = await db.USER.find(
            {
                $or: [
                    { firstname: { $regex: regexFilter } },
                    { lastname: { $regex: regexFilter } },
                ],
            },
            { firstname: 1, lastname: 1, _id: 1 }
        );

        return res.status(200).json({ users });
    } catch (e) {
        console.log(e);
        res.status(413).json({ message: "Error while fetching users" });
    }
});

router.post("/checkAuth", async (req, res) => {
    const token = req.body?.token?.split(" ")[1];
    try {
        const { userId, expiryAt } = JWT.verify(token, CONSTANTS.JWTSECRET);
        const user = await db.USER.findOne(
            { _id: userId },
            { firstname: 1, lastname: 1, email: 1, _id: 1 }
        );
        const newToken = JWT.sign(
            { userId: user._id, expiryAt: Date.now() + CONSTANTS.EXPIRYTIME },
            CONSTANTS.JWTSECRET
        );
        res.status(200).json({ token: newToken, user });
    } catch (e) {
        console.log(e);
        return res.status(403).json({
            message: "Invalid Credentials",
        });
    }
});

module.exports = router;

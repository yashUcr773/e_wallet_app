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
            const email = req.body.email;
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

            const token = JWT.sign({ userId: user._id }, CONSTANTS.JWTSECRET);
            return res.status(200).json({
                message: "User created successfully",
                token: token,
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

        const token = JWT.sign({ userId: user._id }, CONSTANTS.JWTSECRET);
        return res.status(200).json({
            token: token,
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
                message: "Error while updating information",
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

        let update = await db.USER.updateOne(
            {
                _id: res.locals.userId,
            },
            updateObj
        );

        return res.status(200).json({
            message: "Updated successfully",
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

module.exports = router;

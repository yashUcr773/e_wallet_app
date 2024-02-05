const express = require("express");
const { authMiddleware } = require("../middlewares/user.middlewares");
const { ACCOUNT, USER } = require("../database/database");
const { mongoose } = require("mongoose");
const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    const userId = res.locals.userId;
    console.log(userId);
    const account = await ACCOUNT.findOne({ userId: userId });

    res.status(200).json({
        balance: account.balance,
    });
});

router.get("/all", authMiddleware, async (req, res) => {
    try {
        const accounts = await ACCOUNT.find();

        res.status(200).json({
            accounts,
        });
    } catch (e) {
        res.status(404).json({
            message: "Error while fetching Accounts",
        });
    }
});

router.post("/balance", authMiddleware, async (req, res) => {
    try {
        const userIds = req.body.userIds;

        const Promises = [];

        userIds.forEach((userId) => {
            Promises.push(
                ACCOUNT.findOne({ userId: userId }, { userId: 1, balance: 1 })
            );
        });

        const account = await Promise.all(Promises);

        res.status(200).json({
            account: account,
        });
    } catch (e) {
        res.status(404).json({
            message: "Error while fetching Accounts",
        });
    }
});

// router.post("/transfer", authMiddleware, async (req, res) => {
//     try {
//         const { amount, to } = req.body;
//         const sender = await ACCOUNT.findOne({
//             userId: res.locals.userId,
//         });

//         if (!sender) {
//             return res.status(404).json({ message: "Invalid sender account" });
//         }

//         if (sender.balance < amount || typeof amount != "number") {
//             return res.status(400).json({
//                 message: "Insufficient balance",
//             });
//         }

//         const reciever = await ACCOUNT.findOne({
//             userId: to,
//         });

//         if (!reciever) {
//             return res.status(404).json({
//                 message: "Invalid reciever account",
//             });
//         }

//         await new Promise((r) => setTimeout(r, 1000));

//         await ACCOUNT.updateOne(
//             {
//                 userId: res.locals.userId,
//             },
//             {
//                 $inc: {
//                     balance: -amount,
//                 },
//             }
//         );

//         await ACCOUNT.updateOne(
//             {
//                 userId: to,
//             },
//             {
//                 $inc: {
//                     balance: +amount,
//                 },
//             }
//         );

//         return res.status(200).json({
//             message: "Transfer successful",
//         });
//     } catch (e) {
//         console.log(e);
//         return res.status(404).json({
//             message: "Some error occured",
//         });
//     }
// });

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const { amount, to } = req.body;

        session.startTransaction();

        const sender = await ACCOUNT.findOne({
            userId: res.locals.userId,
        }).session(session);

        if (!sender) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Invalid sender account" });
        }

        if (sender.balance < amount || typeof amount != "number") {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance",
            });
        }

        const reciever = await ACCOUNT.findOne({
            userId: to,
        }).session(session);

        if (!reciever) {
            await session.abortTransaction();
            return res.status(404).json({
                message: "Invalid reciever account",
            });
        }
        await new Promise((r) => setTimeout(r, 2000));

        await ACCOUNT.updateOne(
            {
                userId: res.locals.userId,
            },
            {
                $inc: {
                    balance: -amount,
                },
            }
        ).session(session);

        await ACCOUNT.updateOne(
            {
                userId: to,
            },
            {
                $inc: {
                    balance: +amount,
                },
            }
        ).session(session);
        await session.commitTransaction();
        return res.status(200).json({
            message: "Transfer successful",
        });
    } catch (e) {
        session.abortTransaction().then(() => {
            return res.status(404).json({
                message: "Some error occured",
            });
        });
    }
});

module.exports = router;

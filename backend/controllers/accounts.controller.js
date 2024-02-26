const { default: mongoose } = require("mongoose");
const ACCOUNTS_DB = require("../database/accounts.database");

const getBalanceofUser = async (req, res) => {
    try {
        const userId = req.userInfo.userId;
        const account = await ACCOUNTS_DB.findOne({ userId: userId });
        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
                user,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Account found",
            balance: account.balance,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: e.message,
        });
    }
};

const getBalanceForAll = async (req, res) => {
    try {
        const accounts = await ACCOUNTS_DB.find().populate({
            path: "userId",
            select: "firstname lastname email _id",
        });

        return res.status(200).json({
            success: true,
            message: "Accounts found",
            accounts,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: e.message,
        });
    }
};

const getBalanceForIds = async (req, res) => {
    try {
        const userIds = req.body.userIds;
        const Promises = [];
        userIds.forEach((userId) => {
            Promises.push(
                ACCOUNTS_DB.findOne(
                    { userId: userId },
                    { userId: 1, balance: 1 }
                ).populate({
                    path: "userId",
                    select: "firstname lastname email _id",
                })
            );
        });

        const accounts = await Promise.all(Promises);

        return res.status(200).json({
            success: true,
            message: "Accounts found",
            accounts,
        });
    } catch (e) {
        console.log(e);
        return res.status(404).json({
            success: false,
            message: "Error while fetching Accounts",
            error: e.message,
        });
    }
};

const transferMoney = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const { amount, to } = req.body;

        session.startTransaction();

        const sender = await ACCOUNTS_DB.findOne({
            userId: req.userInfo.userId,
        }).session(session);

        if (!sender) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Invalid sender account",
            });
        }

        if (sender.balance < amount || typeof amount != "number") {
            await session.abortTransaction();
            return res.status(401).json({
                success: false,
                message: "Insufficient balance",
            });
        }

        const reciever = await ACCOUNTS_DB.findOne({
            userId: to,
        }).session(session);

        if (!reciever) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Invalid reciever account",
            });
        }
        await ACCOUNTS_DB.updateOne(
            {
                userId: req.userInfo.userId,
            },
            {
                $inc: {
                    balance: -amount,
                },
            }
        ).session(session);

        await ACCOUNTS_DB.updateOne(
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
            success: true,
            message: "Transfer successful",
        });
    } catch (e) {
        console.log(e);
        session.abortTransaction().then(() => {
            return res.status(404).json({
                success: false,
                message: "Some error occured",
                error: e.message,
            });
        });
    }
};

module.exports = {
    getBalanceofUser,
    getBalanceForAll,
    getBalanceForIds,
    transferMoney,
};

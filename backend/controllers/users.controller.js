const USERS_DB = require("../database/user.database");
const { USER_UPDATE_VALIDATOR } = require("../validations/user.validations");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function getUserById(req, res) {
    try {
        const id = req.params.id;
        const user = await USERS_DB.findById(id, { password: 0 });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                user,
            });
        }
        return res.status(200).json({
            success: true,
            message: "User found",
            user,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: e.message,
        });
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await USERS_DB.find({}, { password: 0 });
        return res.status(200).json({
            success: true,
            message: "Users found",
            users,
        });
    } catch (e) {
        console.log(e);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: e.message,
        });
    }
}

async function getUserByFilter(req, res) {
    try {
        const mask = req.query.mask || "";
        const regexFilter = new RegExp(mask, "i");
        const users = await USERS_DB.find(
            {
                $or: [
                    { firstname: { $regex: regexFilter } },
                    { lastname: { $regex: regexFilter } },
                ],
            },
            { firstname: 1, lastname: 1, _id: 1, email: 1 }
        );

        return res.status(200).json({
            success: true,
            message: "Users found",
            users,
        });
    } catch (e) {
        console.log(e);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: e.message,
        });
    }
}

async function updateUserInfo(req, res) {
    try {
        const { firstname, lastname, password } = req.body;

        const { success, error } = USER_UPDATE_VALIDATOR.safeParse({
            firstname,
            lastname,
            password,
        });

        if (!success) {
            return res.status(400).json({
                message: "Firstname, lastname or password is required.",
                success: false,
                error: error.issues,
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
            const hashedPassword = await bcrypt.hash(password, 10);
            updateObj.password = hashedPassword;
        }

        let user = await USERS_DB.findOneAndUpdate(
            {
                _id: req.userInfo.userId,
            },
            updateObj,
            {
                new: true,
                projection: { lastname: 1, email: 1, firstname: 1, _id: 1 },
            }
        );

        return res.status(200).json({
            message: "Updated successfully",
            success: true,
            data: {
                userId: user._id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
            },
        });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
}

module.exports = {
    getUserById,
    getAllUsers,
    getUserByFilter,
    updateUserInfo,
};

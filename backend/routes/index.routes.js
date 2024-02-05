const express = require("express");
const userRouter = require("./user.routes");
const accountsRouter = require("./account.routes");

const router = express.Router();

router.use("/user", userRouter);
router.use("/account", accountsRouter);

module.exports = router;

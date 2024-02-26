const express = require("express");
const router = express.Router();
const accountsController = require("../../../controllers/accounts.controller");
const { verifyJWT } = require("../../../middlewares/verifyJWT");

router.use(verifyJWT);
router.get("/balance", accountsController.getBalanceofUser);
router.get("/all", accountsController.getBalanceForAll);
router.post("/balance/ids", accountsController.getBalanceForIds);
router.post("/transfer", accountsController.transferMoney);

module.exports = router;

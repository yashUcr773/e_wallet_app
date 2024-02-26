const express = require("express");
const router = express.Router();
const userController = require("../../../controllers/users.controller");
const { verifyJWT } = require("../../../middlewares/verifyJWT");

router.use(verifyJWT);
router.get("/id/:id", userController.getUserById);
router.get("/filter", userController.getUserByFilter);
router.get("/", userController.getAllUsers);
router.put("/", userController.updateUserInfo);

module.exports = router;

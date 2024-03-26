const express = require("express");
const router = express.Router();

const userController = require('../app/controllers/userController');

router.get("/login" , userController.login);
router.post("/post-login" , userController.postLogin);
router.get("/logout" , userController.logout);
router.get("/register" , userController.register);
router.post("/post-register" , userController.postRegister);

module.exports = router;
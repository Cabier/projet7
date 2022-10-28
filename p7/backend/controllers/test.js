const express = require("express");
const router = express.Router();
const userController = require("../controllers/auth.controller");
//const multer = require("multer");
//routes Auth
router.post('/register', userController.register);
router.post('/login',userController.login)
//router.get("/desactivateAccount/:id", userController.desactivateAccount);

module.exports = router;
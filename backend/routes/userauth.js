const express = require("express");
const { register, verifyEmail,loginUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", loginUser);
router.get("/verify-email", verifyEmail);
module.exports = router;


// const express = require('express');
// const { register, login } = require('../controllers/authController');

// const router = express.Router();

// router.post('/register', register);


// module.exports = router;
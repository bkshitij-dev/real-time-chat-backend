const express = require("express");
const router = express.Router();
const { signupAgent, loginAgent } = require("../controllers/auth.controller");

router.post("/signup", signupAgent);
router.post("/login", loginAgent);

module.exports = router;

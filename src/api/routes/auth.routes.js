const express = require("express");
const router = express.Router();
const { signupAgent } = require("../controllers/auth.controller");

router.post("/signup", signupAgent);

module.exports = router;

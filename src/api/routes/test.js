const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth.middleware");

// Protected test route
router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You have accessed a protected route!",
    user: req.user,
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();

router.post("/test", (req, res) => {
  res.status(200).json({ received: req.body });
});

module.exports = router;

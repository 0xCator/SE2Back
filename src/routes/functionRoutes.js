const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
    res.send("Login");
});

router.patch("/patch", (req, res) => {
    res.send("Patch");
});

module.exports = router;
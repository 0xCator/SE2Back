const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Get all users");
});

router.get("/:userID", (req, res) => {
    res.send("Get " + req.params.userID + "'s data");
});

router.post("/", (req, res) => {
    res.send("Create new user");
});

router.patch("/:userID", (req,res) => {
    res.send("Update " + req.params.userID + "'s data");
});

router.delete("/:userID", (req, res) => {
    res.send("Delete " + req.params.userID);
});

module.exports = router;
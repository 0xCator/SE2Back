const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Get all users");
});

router.get("/:carID", (req, res) => {
    res.send("Get " + req.params.carID + "'s data");
});

router.post("/", (req, res) => {
    res.send("Create new user");
});

router.patch("/:carID", (req,res) => {
    res.send("Update " + req.params.carID + "'s data");
});

router.delete("/:carID", (req, res) => {
    res.send("Delete " + req.params.carID);
});

module.exports = router;
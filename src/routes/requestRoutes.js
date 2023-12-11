const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Get all requests");
});

router.get("/:reqID", (req, res) => {
    res.send("Get " + req.params.reqID + "'s data");
});

router.post("/", (req, res) => {
    res.send("Create new request");
});

router.delete("/:reqID", (req, res) => {
    res.send("Delete " + req.params.reqID);
});

module.exports = router;
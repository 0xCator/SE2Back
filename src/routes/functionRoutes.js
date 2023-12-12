const express = require("express");
const router = express.Router();
const functions = require("../controllers/functionController");

router.get("/login/:username/:password", functions.login);

router.patch("/pair", functions.pair);

module.exports = router;
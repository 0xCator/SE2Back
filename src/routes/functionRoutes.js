const express = require("express");
const router = express.Router();
const functions = require("../controllers/functionController");

router.get("/login/:username/:password/", functions.login);
router.post("/sendNotification", functions.sendNotification);
router.post("/token/:username/:token", functions.notificationsToken);

router.patch("/pair", functions.pair);

module.exports = router;

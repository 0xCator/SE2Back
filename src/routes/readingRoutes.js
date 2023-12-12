const express = require("express");
const router = express.Router();
const readings = require("../controllers/readingController");

router.get("/", readings.findAll);

router.get("/latest/:userID", readings.findLatest);

router.get("/:userID", readings.findSpecific);

router.post("/", readings.create);

router.delete("/:readingID", readings.delete);

router.delete("/", readings.deleteAll);

module.exports = router;
const express = require("express");
const router = express.Router();
const requests = require("../controllers/requestController");

router.get("/", requests.findAll);

router.get("/:reqID", requests.findOne);

router.post("/", requests.create);

router.delete("/:reqID", requests.delete);

module.exports = router;
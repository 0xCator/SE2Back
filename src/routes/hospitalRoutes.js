const express = require("express");
const router = express.Router();
const hospitals = require("../controllers/hospitalController");

router.get("/", hospitals.findAll);

router.get("/:hospitalID", hospitals.findOne);

router.post("/", hospitals.create);

router.delete("/:hospitalID", hospitals.delete);

module.exports = router;
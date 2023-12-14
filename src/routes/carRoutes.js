const express = require("express");
const router = express.Router();
const cars = require("../controllers/carController");

router.get("/", cars.findAll);

router.get("/:carID", cars.findOne);

router.post("/", cars.create);

router.patch("/:carID", cars.update);

router.delete("/:carID", cars.delete);

module.exports = router;

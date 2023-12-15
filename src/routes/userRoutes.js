const express = require("express");
const router = express.Router();
const users = require("../controllers/userController");

router.get("/", users.findAll);

router.get("/patients", users.findAllPatients);

router.get("/:userID", users.findOne);

router.get("/username/:username", users.findByUsername);

router.post("/", users.create);

router.patch("/:userID/medicalHistory", users.updateMedHistory);

router.patch("/:userID/readings", users.updateReadings);

router.patch("/:userID/addRelatives", users.addRelative);
router.patch("/:userID/removeRelatives", users.removeRelative);

router.delete("/:userID", users.delete);

module.exports = router;

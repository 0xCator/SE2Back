const express = require("express");
const router = express.Router();
const users = require("../controllers/userController");

router.get("/", users.findAll);

router.get("/:userID", users.findOne);

router.get("/username/:username", users.findByUsername);

router.post("/", users.create);

router.patch("/:userID/medicalHistory", users.updateMedHistory);

router.patch("/:userID/Relatives", users.addRelative);
router.delete("/:userID/Relatives", users.removeRelative);

router.patch("/:userID/Patients", users.addPatient);
router.delete("/:userID/Patients", users.removePatient);

router.delete("/:userID", users.delete);

module.exports = router;
// Routes/TechnicianRoutes.js
const express = require("express");
const router = express.Router();

const TechnicianController = require("../Controllers/TechnicianControllers");

router.get("/", TechnicianController.getAllTechnicians);
router.post("/", TechnicianController.createTechnician);
router.get("/:id", TechnicianController.getTechnicianById);
router.put("/:id", TechnicianController.updateTechnician);
router.delete("/:id", TechnicianController.deleteTechnician);

module.exports = router;

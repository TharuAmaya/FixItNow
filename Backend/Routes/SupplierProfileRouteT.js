const express = require("express");
const router = express.Router();
const controller = require("../Controllers/SupplierProfileControllerT");

// Routes
router.get("/", controller.getProfile);          
router.get("/:id", controller.getProfile);      
router.post("/", controller.createProfile);     
router.put("/:id", controller.updateProfile);   

module.exports = router;

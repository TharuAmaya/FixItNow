const express = require("express");
const router = express.Router();
const { addResponse, getResponses,deleteResponse } = require("../Controllers/supplierresponseControllerT");

// Routes
router.post("/", addResponse);
router.get("/", getResponses);
router.delete("/:id", deleteResponse);

module.exports = router;

const express = require("express");
const router = express.Router();
const { getAllRequests, addRequest, deleteRequest, getRequestById } = require("../Controllers/RequestControllers");

router.get("/", getAllRequests);
router.get("/:id", getRequestById);   // 8Add this line
router.post("/", addRequest);
router.delete("/:id", deleteRequest);

module.exports = router;

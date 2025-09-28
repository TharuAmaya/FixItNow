const express = require("express");
const router = express.Router();

// Import controller functions
const { getAllUsers, addUser, getUserById, updateUser, deleteUser } = require("../Controllers/UserControllers");

// Routes
router.get("/", getAllUsers);
router.post("/", addUser);          // function name matches controller
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;

// routes/NotificationRoute.js
const express = require("express");
const router = express.Router();
const {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
} = require("../Controllers/NotificationController");

// GET all
router.get("/", getNotifications);

// GET one
router.get("/:id", getNotificationById);

// POST create
router.post("/", createNotification);

// PATCH update
router.patch("/:id", updateNotification);

// DELETE remove
router.delete("/:id", deleteNotification);

module.exports = router;

const express = require("express");
const { getNotifications, markAsRead, deleteNotification} = require("../Controllers/notificationControllerT");
const router = express.Router();

router.get("/", getNotifications);
router.put("/:id/read", markAsRead);
router.delete("/:id", deleteNotification); 

module.exports = router;

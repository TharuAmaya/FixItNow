


//supplier (not yet)




const express = require("express");
const router = express.Router();
const {
  createNotification,
  getNotifications,
  markAsRead
} = require("../Controllers/notificationController");

router.post("/", createNotification); 
router.get("/", getNotifications);    
router.put("/:id/read", markAsRead);  // mark read

module.exports = router;

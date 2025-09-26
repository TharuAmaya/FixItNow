const express = require("express");
const router = express.Router({ mergeParams: true });
const H = require("../Controllers/TaskStatusHistoryController");

router.get("/", H.list);
router.post("/", H.append);

module.exports = router;

const express = require("express");
const router = express.Router({ mergeParams: true });
const I = require("../Controllers/TaskIssueController");

router.get("/", I.get);
router.put("/", I.upsert);
router.patch("/", I.upsert);

module.exports = router;

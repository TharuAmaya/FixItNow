const express = require("express");
const router = express.Router({ mergeParams: true });
const C = require("../Controllers/TaskContactController");

router.get("/", C.get);
router.put("/", C.upsert);
router.patch("/", C.upsert);

module.exports = router;

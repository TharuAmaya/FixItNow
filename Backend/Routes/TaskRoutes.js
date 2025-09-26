const express = require("express");
const router = express.Router();
//Insert model
const Task = require("../Model/TaskModel");
//Inser task controller
const TaskController = require("../Controllers/TaskControllers");

router.get("/", TaskController.getAllTasks);
router.post("/", TaskController.createTask);
router.get("/:id", TaskController.getTaskById);
router.put("/:id", TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);

//export router
module.exports = router;
// Controllers/TaskStatusHistoryController.js
const TaskStatusHistory = require("../Model/TaskStatusHistory");
const Task = require("../Model/TaskModel");

// GET /tasks/:taskId/history
exports.list = async (req, res) => {
  try {
    const history = await TaskStatusHistory.find({ taskId: req.params.taskId }).sort({ createdAt: -1 });
    return res.status(200).json({ history });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error fetching status history" });
  }
};

// POST /tasks/:taskId/history
exports.append = async (req, res) => {
  const { fromStatus = "", toStatus, reason = "" } = req.body;
  const taskId = req.params.taskId;

  if (!toStatus) return res.status(400).json({ message: "toStatus is required" });

  try {
    // 1) Write history entry
    const row = await TaskStatusHistory.create({ taskId, fromStatus, toStatus, reason });

    // 2) Mirror latest status to the Task table
    const updatedTask = await Task.findOneAndUpdate(
      { taskId },
      { status: toStatus },
      { new: true }
    );

    if (!updatedTask) {
      // Task not found; still return history row
      return res.status(201).json({
        event: row,
        warning: "History saved, but Task not found to mirror status"
      });
    }

    return res.status(201).json({ event: row, task: updatedTask });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error writing status history" });
  }
};


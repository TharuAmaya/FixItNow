const TaskIssue = require("../Model/TaskIssue");

exports.get = async (req, res) => {
  try {
    const doc = await TaskIssue.findOne({ taskId: req.params.taskId });
    return res.status(200).json({ issue: doc || null });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error fetching issue" });
  }
};

exports.upsert = async (req, res) => {
  const { issueDescription = "" } = req.body;
  const taskId = req.params.taskId; // Extract taskId from URL params
  try {
    const doc = await TaskIssue.findOneAndUpdate(
      { taskId: taskId }, // Use the extracted taskId
      { taskId: taskId, issueDescription }, // Include taskId in update
      { upsert: true, new: true }
    );
    return res.status(200).json({ issue: doc });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error saving issue" });
  }
};

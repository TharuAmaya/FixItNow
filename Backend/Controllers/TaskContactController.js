const TaskContact = require("../Model/TaskContact");

exports.get = async (req, res) => {
  try {
    const doc = await TaskContact.findOne({ taskId: req.params.taskId });
    return res.status(200).json({ contact: doc || null });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error fetching contact" });
  }
};

exports.upsert = async (req, res) => {
  const { customerPhone = "", address = "" } = req.body;
  const taskId = req.params.taskId; // Extract taskId from URL params
  try {
    const doc = await TaskContact.findOneAndUpdate(
      { taskId: taskId }, // Use the extracted taskId
      { taskId: taskId, customerPhone, address }, // Include taskId in update
      { upsert: true, new: true }
    );
    return res.status(200).json({ contact: doc });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error saving contact" });
  }
};

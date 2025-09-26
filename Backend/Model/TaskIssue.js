const mongoose = require("mongoose");

const taskIssueSchema = new mongoose.Schema(
  {
    taskId: { type: String, required: true, index: true, unique: true },
    issueDescription: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TaskIssue", taskIssueSchema);

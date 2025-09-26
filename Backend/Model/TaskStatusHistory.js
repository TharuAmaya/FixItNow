const mongoose = require("mongoose");

const statusHistorySchema = new mongoose.Schema(
  {
    taskId: { type: String, required: true, index: true },
    fromStatus: { type: String },
    toStatus: {
      type: String,
      enum: ["pending", "accepted", "in-progress", "on-hold", "completed", "rejected"],
      required: true
    },
    reason: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TaskStatusHistory", statusHistorySchema);

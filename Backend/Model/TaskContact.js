const mongoose = require("mongoose");

const taskContactSchema = new mongoose.Schema(
  {
    taskId: { type: String, required: true, index: true, unique: true },
    customerPhone: { type: String, default: "" },
    address: { type: String, default: "" } // single string; normalize later if needed
  },
  { timestamps: true }
);

module.exports = mongoose.model("TaskContact", taskContactSchema);

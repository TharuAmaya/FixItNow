const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskId: { type: String, required: true, unique: true }, // Unique Task ID
  customerName: { type: String, required: true },         // Customer name
  serviceType: { type: String, required: true },          // Service type
  assignedTechnician: { type: String, required: true },   // Technician assigned
  status: { 
    type: String, 
    enum: ["pending", "accepted", "in-progress", "on-hold", "completed", "rejected"], 
    message: "status must be one of pending, accepted, in-progress, on-hold, completed, rejected",
    default: "pending" 
  },                                                      // Expanded task status
  urgency: { 
    type: String, 
    enum: ["low", "medium", "high"], 
    message: "urgency must be one of low, medium, high",
    default: "medium" 
  },                                                      // Urgency level
  createdAt: { type: Date, default: Date.now }           // Task creation date
});

module.exports = mongoose.model("TaskModel", taskSchema);

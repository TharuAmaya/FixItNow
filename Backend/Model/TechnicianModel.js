const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    days: {
      type: [String],
      enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
      default: ["mon", "tue", "wed", "thu", "fri"],
    },
    startHour: { type: Number, min: 0, max: 23, default: 9 },  // 9 AM
    endHour: { type: Number, min: 1, max: 24, default: 17 },   // 5 PM
  },
  { _id: false }
);

const technicianSchema = new mongoose.Schema(
  {
    technicianId: { type: String, required: true, unique: true }, // Unique Technician ID (business key)
    name: { type: String, required: true },                       // Name
    skills: { type: [String], default: [] },                      // Skills list
    availability: { type: availabilitySchema, default: () => ({}) }, // Availability config
    workload: { type: Number, default: 0, min: 0 },               // Current workload (e.g., number of tasks)
    createdAt: { type: Date, default: Date.now },                 // Created timestamp
  }
 
);

module.exports = mongoose.model("TechnicianModel", technicianSchema);


//supplier (not yet)


const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  link: { type: String }, // route for redirect (supplierorder / Supplierresponse)
  role: { type: String, enum: ["admin", "supplier"], required: true }, //  who see it
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("NotificationSupplier", NotificationSchema);

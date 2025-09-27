const mongoose = require("mongoose");

const SupplierResponseSchema = new mongoose.Schema({
  resID: { type: String, required: true, unique: true },
  orderId: { type: String, ref: "PurchaseOrder", required: true },
  responseType: { type: String, enum: ["Accept", "Reject"], required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  "SupplierResponseModelT",
  SupplierResponseSchema
);

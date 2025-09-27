const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  supId: { type: String, unique: true, required: true },
  supName: { type: String, required: true },
  supPhone: { type: String, required: true },
  supMail: { type: String, required: true },
  address: { type: String, required: true },
  profilePic: { type: String, default: "" },
  lastEdit: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SupplierProfileModelT", SupplierSchema);

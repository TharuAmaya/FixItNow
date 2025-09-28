const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gmail: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);

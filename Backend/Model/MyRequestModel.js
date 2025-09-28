// models/RequestModel.js
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requestId: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true },
  problemType: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);

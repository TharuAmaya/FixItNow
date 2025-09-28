const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestSchema = new mongoose.Schema({
  requestId: { 
    type: String, 
    required: true 
  },
  user: { 
    type: String,
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  problemType: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
});

module.exports = mongoose.model("Request", requestSchema);

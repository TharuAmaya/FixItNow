const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const supplierSchema = new Schema({
  supId: {
    type: String,
    required: true,
  },
  supname: {
    type: String,
    required: true,
  },
  supphone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v); // 10 digits
      },
      message: (props) =>
        `${props.value} is not a valid phone number (must be 10 digits)`,
    },
  },
  gmail: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(v); // gmail
      },
      message: "Only Gmail addresses are allowed (e.g., user@gmail.com)",
    },
  },
  address: {
    type: String,
    required: true,
  },
  performanceScore: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger, // (no decimals)
      message: "Rating must be a whole number (1, 2, 3, etc.)",
    },
  },
  totalorders: {
    type: String,
    required: true,
  },
  joinedDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model(
  "SupplierManagementModelT", //file name
  supplierSchema //function name
);

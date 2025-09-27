const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const purchaseOrderSchema = new Schema({
  orderId: {
    type: String,
    required: true,
    
  },
  supplierId: {
    type: String,
    required: true,
    //ref: SupplierManagementModelT, 
  },

 items: [
  {
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 }
  }
],


  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Completed"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,

    
  }
});

module.exports = mongoose.model(
  "PurchaseManagementModelT", //file name
  purchaseOrderSchema //function name
);

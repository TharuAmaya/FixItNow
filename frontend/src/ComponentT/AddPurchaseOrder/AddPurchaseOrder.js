import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./AddPurchaseOrder.css";

function AddPurchaseOrder() {
  const navigate = useNavigate();

  // Update   multiple items
  const [inputs, setInputs] = useState({
    orderId: "",
    supplierId: "",
    status: "Pending",
    createdAt: "",
    items: [{ itemName: "", quantity: 1 }], // start  one item
  });

  // Handle  input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //  individual item  changes
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    setInputs((prev) => {
      const newItems = [...prev.items];
      newItems[index][name] = name === "quantity" ? Number(value) : value;
      return { ...prev, items: newItems };
    });
  };

  //  add new item row
  const addItem = () => {
    setInputs((prev) => ({
      ...prev,
      items: [...prev.items, { itemName: "", quantity: 1 }],
    }));
  };

  const removeItem = (index) => {
    setInputs((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => navigate("/Purchaseorders"));
  };

  const sendRequest = async () => {
    try {
      const res = await axios.post("http://localhost:5000/purchases/", {
        orderId: String(inputs.orderId),
        supplierId: String(inputs.supplierId),
        items: inputs.items, // send  array of items
        status: String(inputs.status),
        createdAt: new Date(inputs.createdAt).toISOString(),
      });
      console.log("Response:", res.data);
      return res.data;
    } catch (err) {
      console.error("Error adding purchase order:", err);
    }
  };

  return (
    <div className="form-container">
      <h1>Add Purchase Order</h1>
      <form onSubmit={handleSubmit} id="purchaseOrderForm">
        <div className="full">
          <label htmlFor="orderId">
            Order ID <span className="req">*</span>
          </label>
          <input
            id="orderId"
            name="orderId"
            onChange={handleChange}
            type="text"
            value={inputs.orderId}
            required
          />

          <label htmlFor="supplierId">
            Supplier ID <span className="req">*</span>
          </label>
          <input
            id="supplierId"
            name="supplierId"
            onChange={handleChange}
            type="text"
            value={inputs.supplierId}
            required
          />
        </div>
        <h3>Items</h3>
        {inputs.items.map((item, index) => (
          <div key={index} className="item-row">
            <input
              type="text"
              name="itemName"
              placeholder="Item Name"
              value={item.itemName}
              onChange={(e) => handleItemChange(index, e)}
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              min="1"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, e)}
              required
            />
            {inputs.items.length > 1 && (
              <button type="button1" onClick={() => removeItem(index)}>
                Remove
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addItem}>
          Add Item
        </button>

        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            onChange={handleChange}
            value={inputs.status}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        <div className="full">
          <label htmlFor="createdAt">
            Created At <span className="req">*</span>
          </label>
          <input
            id="createdAt"
            name="createdAt"
            onChange={handleChange}
            type="date"
            value={inputs.createdAt}
            required
          />
        </div>

        <div className="actions full">
          <button type="submit">Submit</button>
          <button type="reset" className="secondary">
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPurchaseOrder;

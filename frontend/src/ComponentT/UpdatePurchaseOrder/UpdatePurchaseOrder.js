import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdatePurchaseOrder.css";
function UpdatePurchaseOrder() {
  const [inputs, setInputs] = useState({
    orderId: "",
    supplierId: "",
    items: [],
    status: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://localhost:5000/purchases/${id}`)
        .then((res) => res.data)
        .then((data) => setInputs(data.purchase));
    };
    fetchHandler();
  }, [id]);

  // Send update request
  const sendRequest = async () => {
    await axios
      .put(`http://localhost:5000/purchases/${id}`, {
        orderId: String(inputs.orderId),
        supplierId: String(inputs.supplierId),
        items: inputs.items,
        status: String(inputs.status),
      })
      .then((res) => res.data);
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value, //name attribute from  input
    }));
  };
  const handleItemChange = (index, field, value) => {
    const newItems = [...inputs.items];
    newItems[index][field] = value;
    setInputs((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setInputs((prev) => ({
      ...prev,
      items: [...prev.items, { itemName: "", quantity: 0 }],
    }));
  };

  const removeItem = (index) => {
    const newItems = inputs.items.filter((_, i) => i !== index);
    setInputs((prev) => ({ ...prev, items: newItems }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest().then(() => navigate("/Purchaseorders"));
  };

  return (
    <div>
      <h1>Update Purchase Order</h1>
      <form onSubmit={handleSubmit} id="purchaseOrderForm">
        <div className="full">
          <label htmlFor="orderId">
            Order ID <span className="req">*</span>
          </label>
          <input
            id="orderId"
            name="orderId"
            type="text"
            value={inputs.orderId}
            readOnly
          />
        </div>

        <div className="full">
          <label htmlFor="supplierId">
            Supplier ID <span className="req">*</span>
          </label>
          <input
            id="supplierId"
            name="supplierId"
            type="text"
            value={inputs.supplierId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="full">
          <label>
            Items <span className="req">*</span>
          </label>
          {inputs.items.map((item, index) => (
            <div key={index} className="item-row">
              <input
                type="text"
                placeholder="Item Name"
                value={item.itemName}
                onChange={(e) =>
                  handleItemChange(index, "itemName", e.target.value)
                }
                required
              />
              <input
                type="number"
                min="0"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                required
              />
              <button type="button1" onClick={() => removeItem(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addItem}>
            Add Item
          </button>
        </div>

        <div className="full">
          <label htmlFor="status">
            Status <span className="req">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={inputs.status}
            onChange={handleChange}
            require
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
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

export default UpdatePurchaseOrder;

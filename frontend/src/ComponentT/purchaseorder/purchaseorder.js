import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./purchaseorder.css";

function PurchaseOrder({ order, onDelete }) {
  const { _id, orderId, supplierId, items, status, createdAt } = order;

  const deleteHandler = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (!confirmDelete) return; // User clicked "Cancel", so exit

    try {
      await axios.delete(`http://localhost:5000/purchases/${_id}`);
      onDelete(_id); // Remove from frontend state immediately
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // If  no items
  if (!items || items.length === 0) {
    return (
      <tr>
        <td>{orderId}</td>
        <td>{supplierId}</td>
        <td colSpan="2">No items</td>
        <td>{status}</td>
        <td>{createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}</td>

        <td>
          <div className="action-buttons">
            <Link to={`/Updateorder/${_id}`}>
              <button className="update-btn">✎</button>
            </Link>
            <button className="delete-btn" onClick={deleteHandler}>
              🗑
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <>
      {items.map((item, index) => (
        <tr key={index}>
          {/*  show Order ID and Supplier ID */}
          {index === 0 && (
            <>
              <td rowSpan={items.length}>{orderId}</td>
              <td rowSpan={items.length}>{supplierId}</td>
            </>
          )}

          <td>{item.itemName}</td>
          <td>{item.quantity}</td>

          {/*  show Status, Created At, and Actions  */}
          {index === 0 && (
            <>
              <td rowSpan={items.length}>{status}</td>
              <td rowSpan={items.length}>
                {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}
              </td>

              <td rowSpan={items.length}>
                <div className="action-buttons">
                  <Link to={`/Updateorder/${_id}`}>
                    <button className="update-btn">✎</button>
                  </Link>

                  <button className="delete-btn" onClick={deleteHandler}>
                    🗑
                  </button>
                </div>
              </td>
            </>
          )}
        </tr>
      ))}
    </>
  );
}

export default PurchaseOrder;

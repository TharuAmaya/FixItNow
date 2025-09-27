import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import PurchaseOrder from "../purchaseorder/purchaseorder";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./purchaseorderdetails.css";

function PurchaseOrderDetails() {
  const [orders, setOrders] = useState([]);        // currently displayed
  const [allOrders, setAllOrders] = useState([]);  // all fetched orders
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  const componentRef = useRef(null);

  // Fetch all orders once
  useEffect(() => {
    axios
      .get("http://localhost:5000/purchases")
      .then((res) => {
        const data = res.data.purchases || res.data;
        setOrders(data);
        setAllOrders(data); // store full list for filtering
      })
      .catch((err) => console.error(err));
  }, []);

  // Live search
  useEffect(() => {
    if (!searchQuery) {
      setOrders(allOrders); // reset if query is empty
      setNoResults(false);
      return;
    }

    const filtered = allOrders.filter((order) =>
      Object.values(order).some((field) =>
        String(field).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    setOrders(filtered);
    setNoResults(filtered.length === 0);
  }, [searchQuery, allOrders]);

  // Delete handler
  const handleDelete = (id) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
    setAllOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
  };

  // PDF Download
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const img = "/logo.png"; 

    doc.addImage(img, "PNG", 10, 10, 25, 25);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("FIXITNOW", 40, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Address: 123 Main Street, Colombo, Sri Lanka", 40, 27);
    doc.text("Email: support@fixitnow.com | Phone: +94 77 123 4567", 40, 33);

    doc.setFontSize(14);
    doc.text("Purchase Orders Report", 14, 50);

    autoTable(doc, {
      startY: 60,
      head: [["Order ID", "Supplier ID", "Item Name", "Quantity", "Status", "Created At"]],
      body: orders.flatMap((order) =>
        order.items && order.items.length > 0
          ? order.items.map((item, idx) => [
              idx === 0 ? order.orderId : "",
              idx === 0 ? order.supplierId : "",
              item.itemName || "N/A",
              item.quantity || 0,
              idx === 0 ? order.status : "",
              idx === 0
                ? order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "N/A"
                : "",
            ])
          : [[order.orderId, order.supplierId, "No items", "", order.status, new Date(order.createdAt).toLocaleDateString()]]
      ),
      styles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [26, 82, 118],
        textColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      margin: { left: 14, right: 14 },
    });

    //  Save file
    doc.save("purchase_orders_report.pdf");
  };


  return (
    <div className="purchase-order-container">
      <div className="pur-top-bar">
        <h1>Orders Report</h1>
        <Link to="/add-order">
          <button className="topright">+ Add Purchase Order</button>
        </Link>
      </div>
      <div className="pur-search-bar">
        <input
          type="text"
          placeholder="Search purchase orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // filter as typing
        />
      </div>
      <div ref={componentRef}>
        {noResults ? (
          <p>No purchase orders found</p>
        ) : (
          <table className="purchase-order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Supplier ID</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <PurchaseOrder
                    key={order._id}
                    order={order}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="7">No purchase orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <button onClick={handleDownloadPDF} className="pur-download-btn button-small">
        Download Report
      </button>
    </div>
  );
}

export default PurchaseOrderDetails;

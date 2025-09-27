import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./SupplierPurchaseOrders.css";

function SupplierPurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]); // store all fetched orders
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  const componentRef = useRef(null);

  // Fetch orders once
  useEffect(() => {
    axios
      .get("http://localhost:5000/purchases")
      .then((res) => {
        const data = res.data.purchases || res.data;
        setOrders(data);
        setAllOrders(data); // keep a copy for filtering
      })
      .catch((err) => console.error(err));
  }, []);

  // Live search
  useEffect(() => {
    if (!searchQuery) {
      setOrders(allOrders); // reset  if search is empty
      setNoResults(false);
      return;
    }

    const filtered = allOrders.filter((order) => {
      const orderValues = [
        order.orderId,
        order.status,
        ...(order.items || []).map((item) => Object.values(item).join(" ")),
      ];
      return orderValues.some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    setOrders(filtered);
    setNoResults(filtered.length === 0);
  }, [searchQuery, allOrders]);

  // PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const logo = "/logo.png"; 

    doc.addImage(logo, "PNG", 10, 10, 25, 25);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("FIXITNOW", 40, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Address: 123 Main Street, Colombo, Sri Lanka", 40, 27);
    doc.text("Email: support@fixitnow.com | Phone: +94 77 123 4567", 40, 33);

    doc.setFontSize(14);
    doc.text("Supplier Purchase Orders Report", 14, 50);

    const tableData = [];
    orders.forEach((order) => {
      if (order.items && order.items.length > 0) {
        order.items.forEach((item, idx) => {
          tableData.push([
            idx === 0 ? order.orderId : "", // orderId only once
            item.itemName || "N/A",
            item.quantity || "N/A",
            idx === 0
              ? order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : "N/A"
              : "",
          ]);
        });
      } else {
        tableData.push([
          order.orderId,
          "No items",
          "-",
          order.createdAt
            ? new Date(order.createdAt).toLocaleDateString()
            : "N/A",
        ]);
      }
    });

    autoTable(doc, {
      startY: 60,
      head: [["Order ID", "Item Name", "Quantity", "Created At"]],
      body: tableData,
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
    doc.save("supplier_purchase_orders_report.pdf");
  };

  return (
    <div className="supplier-order-container">
      <div className="order-card">
        <h1>My Purchase Orders</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // live search
          />
        </div>

        <div ref={componentRef}>
          {noResults ? (
            <p>No purchase orders found.</p>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Item Name</th>
                  <th>Quantity</th>

                  <th>Created At</th>
                  <th>Response</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) =>
                    order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <tr key={`${order._id}-${index}`}>
                          {index === 0 && (
                            <td rowSpan={order.items.length}>
                              {order.orderId}
                            </td>
                          )}
                          <td>{item.itemName}</td>
                          <td>{item.quantity}</td>
                          {index === 0 && (
                            <>
                              <td rowSpan={order.items.length}>
                                {order.createdAt
                                  ? new Date(
                                      order.createdAt
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td rowSpan={order.items.length}>
                                <Link to={`/add-response/${order.orderId}`}>
                                  <button className="response-btn">
                                    Add Response
                                  </button>
                                </Link>
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr key={order._id}>
                        <td>{order.orderId}</td>
                        <td colSpan="2">No items</td>
                        <td>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td>
                          <Link to={`/add-response/${order._id}`}>
                            <button className="response-btn">
                              Add Response
                            </button>
                          </Link>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan="5">No purchase orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <button onClick={handleDownloadPDF} className="download-btn">
          Download Report
        </button>
      </div>
    </div>
  );
}

export default SupplierPurchaseOrders;

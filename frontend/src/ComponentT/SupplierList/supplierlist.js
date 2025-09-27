import React, { useState, useEffect } from "react";
import axios from "axios";
import Supplier from "../Supplier/Supplier";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "./supplierlist.css";

const URL = "http://localhost:5000/suppliers/";

function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(URL);
        const data = response.data.suppliers || [];
        setSuppliers(data);
        setAllSuppliers(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSuppliers();
  }, []);

  // Live search
  useEffect(() => {
    const filtered = allSuppliers.filter((supplier) =>
      Object.values(supplier).some((field) =>
        field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setSuppliers(filtered);
    setNoResults(filtered.length === 0);
  }, [searchQuery, allSuppliers]);

  //pdf
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const img = "/logo.png";
    doc.addImage(img, "PNG", 10, 10, 25, 25); // (image, format, x, y, width, height)

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("FIXITNOW", 40, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Address: 123 Main Street, Colombo, Sri Lanka", 40, 27);
    doc.text("Email: support@fixitnow.com | Phone: +94 11 969 6966", 40, 33);

    doc.setFontSize(14);
    doc.text("Supplier's Details", 14, 50);

    autoTable(doc, {
      startY: 60,
      head: [
        [
          "ID",
          "Name",
          "Phone",
          "Email",
          "Address",
          "Performance",
          "Orders",
          "Joined Date",
        ],
      ],
      body: suppliers.map((s) => [
        s.supId || "N/A",
        s.supname || "N/A",
        s.supphone || "N/A",
        s.gmail || "N/A",
        s.address || "N/A",
        s.performanceScore ?? "N/A",
        s.totalorders ?? "0",
        s.joinedDate ? new Date(s.joinedDate).toLocaleDateString() : "N/A",
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [26, 82, 118],
        textColor: [255, 255, 255], // white 
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // gray 
      },
      margin: { left: 14, right: 14 },
    });
    // Save file
    doc.save("supplier_list.pdf");
  };

  return (
    <div className="sup-container">
      <div className="sup-top-bar">
        <h1>Supplier List</h1>
        <Link to="/add-supplier">
          <button className="sup-topright">+ Add Supplier</button>
        </Link>
      </div>

      <div className="sup-search-bar">
        <input
          type="text"
          placeholder="Search supplier details"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {noResults ? (
        <p>No results found</p>
      ) : (
        <table className="sup-supplier-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Comapny Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Performance Score</th>
              <th>Total Orders</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No results found
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <Supplier
                  key={supplier._id}
                  supplier={supplier}
                  onDelete={(id) =>
                    setSuppliers((prev) => prev.filter((sup) => sup._id !== id))
                  }
                />
              ))
            )}
          </tbody>
        </table>
      )}

      <button onClick={handleDownloadPDF} className="sup-download-btn">
        Download Report
      </button>
    </div>
  );
}

export default SupplierList;

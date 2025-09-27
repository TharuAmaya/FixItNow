import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminSupResponse.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AdminSupResponse() {  
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/responses"); // admin route
        setResponses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchResponses();
  }, []);

  
    // PDF 
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
    doc.text("Supplier Responses Report", 14, 50);

    autoTable(doc, {
      startY: 60,
      head: [["Response ID", "Order ID", "Type", "Notes", "Date"]],
      body: responses.map((r) => [
        r.resID || "N/A",
        r.orderId || "N/A",
        r.responseType || "N/A",
        r.notes || "N/A",
        r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "N/A",
      ]),
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
    doc.save("supplier_responses_report.pdf");
  };

  return (
    <div className="admin-response-container">
      <h2>All Supplier Responses</h2>
      
      <table>
        <thead>
          <tr>
            <th>Response ID</th>
            <th>Order ID</th>
           
            <th>Type</th>
            <th>Notes</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {responses.length > 0 ? (
            responses.map((res) => (
              <tr key={res._id}>
                <td>{res.resID}</td>
                <td>{res.orderId || "N/A"}</td>
                <td>{res.responseType}</td>
                <td>{res.notes}</td>
                <td>{new Date(res.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No responses yet.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={handleDownloadPDF} className="response-download-btn">
          Download Report
        </button>
    </div>
  );
}

export default AdminSupResponse;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddSupplier.css";

function AddSupplier() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    supId: "",
    supname: "",
    supphone: "",
    gmail: "",
    address: "",
    performanceScore: "",
    totalorders: "",
    joinedDate: "",
  });

  // handle field changes
  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/suppliers/", {
        supId: String(inputs.supId),
        supname: String(inputs.supname),
        supphone: String(inputs.supphone),
        gmail: String(inputs.gmail),
        address: String(inputs.address),
        performanceScore: Number(inputs.performanceScore),
        totalorders: Number(inputs.totalorders),
        joinedDate: new Date(inputs.joinedDate).toISOString(),
      });
      navigate("/Supplierlist"); //after success
    } catch (err) {
      console.error("Error adding supplier:", err);
      alert("Failed to add supplier. Please try again.");
    }
  };

  return (
    <div className="add-supplier-container">
      <h1 className="form-title">Add Supplier</h1>

      <form onSubmit={handleSubmit} className="supplier-form">
        <div className="form-group">
          <label htmlFor="supId">
            Supplier ID <span className="req">*</span>
          </label>
          <input
            id="supId"
            name="supId"
            type="text"
            value={inputs.supId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="supname">
            Name <span className="req">*</span>
          </label>
          <input
            id="supname"
            name="supname"
            type="text"
            placeholder="Supplier name"
            value={inputs.supname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="supphone">
            Phone <span className="req">*</span>
          </label>
          <input
            id="supphone"
            name="supphone"
            type="tel"
            placeholder="+94 7X XXX XXXX"
            value={inputs.supphone}
            onChange={handleChange}
            pattern="^(\+?\d[\d\s\-]{7,})$"
            required
          />
        </div>
        <div className="form-group full">
          <label htmlFor="gmail">
            Email <span className="req">*</span>
          </label>
          <input
            id="gmail"
            name="gmail"
            type="email"
            placeholder="name@gmail.com"
            value={inputs.gmail}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group full">
          <label htmlFor="address">
            Address <span className="req">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            placeholder="Street, City, Postal code"
            value={inputs.address}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="performanceScore">
            Performance Score (1-5) <span className="req">*</span>
          </label>
          <input
            id="performanceScore"
            name="performanceScore"
            type="number"
            min="1"
            max="5"
            value={inputs.performanceScore}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="totalorders">
            Total Orders <span className="req">*</span>
          </label>
          <input
            id="totalorders"
            name="totalorders"
            type="number"
            min="0"
            placeholder="0"
            value={inputs.totalorders}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group full">
          <label htmlFor="joinedDate">
            Joined Date <span className="req">*</span>
          </label>
          <input
            id="joinedDate"
            name="joinedDate"
            type="date"
            value={inputs.joinedDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{
              width: '120px',
              height: '40px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Submit
          </button>
          <button 
            type="reset" 
            className="btn btn-secondary"
            style={{
              width: '120px',
              height: '40px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddSupplier;

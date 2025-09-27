import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './UpdateSupplier.css';

function UpdateSupplier() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const { id } = useParams(); 


  useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://localhost:5000/suppliers/${id}`)
        .then((res) => res.data)
        .then((data) => setInputs(data.supplier));
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    await axios
      .put(`http://localhost:5000/suppliers/${id}`, {
        supId:String(inputs.supId),
        supname: String(inputs.supname),
        supphone: String(inputs.supphone),
        gmail: String(inputs.gmail),
        address: String(inputs.address),
        performanceScore: Number(inputs.performanceScore),
        totalorders: String(inputs.totalorders),
      })
      .then((res) => res.data);
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value, 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => history("/Supplierlist")); //details add 
  };

  return (
    <div>
      <h1>Update user</h1>
      <form onSubmit={handleSubmit} id="supplierForm">
        <div className="full">
          <label htmlFor="supId">
            Supplier ID <span class="req">*</span>
          </label>
          <input
            id="supId"
            name="supId"
            onChange={handleChange}
            type="text"
            value={inputs.supId}
            readOnly 
            
          />
        </div>

        <div>
          <label htmlFor="supname">
            Name <span class="req">*</span>
          </label>
          <input
            id="supname"
            name="supname"
            onChange={handleChange}
            type="text"
            placeholder="Supplier name"
            value={inputs.supname}
            required
          />
        </div>

        <div>
          <label htmlFor="supphone">
            Phone <span class="req">*</span>
          </label>
          <input
            id="supphone"
            name="supphone"
            onChange={handleChange}
            type="tel"
            inputmode="tel"
            placeholder="+94 7X XXX XXXX"
            value={inputs.supphone}
            pattern="^(\+?\d[\d\s\-]{7,})$"
            required
          />
        </div>

        <div className="full">
          <label htmlFor="gmail">
            Email <span class="req">*</span>
          </label>
          <input
            id="gmail"
            name="gmail"
            onChange={handleChange}
            type="email"
            placeholder="name@gmail.com"
            value={inputs.gmail}
            required
          />
        </div>

        <div className="full">
          <label htmlFor="address">
            Address <span class="req">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            onChange={handleChange}
            placeholder="Street, City, Postal code"
            value={inputs.address}
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="performanceScore">
            Performance Score (1-5) <span class="req">*</span>
          </label>
          <input
            id="performanceScore"
            name="performanceScore"
            onChange={handleChange}
            type="number"
            min="0"
            max="100"
            step="1"
            value={inputs.performanceScore}
            required
          />
        </div>

        <div>
          <label htmlFor="totalorders">
            Total Orders <span class="req">*</span>
          </label>
          <input
            id="totalorders"
            name="totalorders"
            onChange={handleChange}
            type="number"
            min="0"
            step="1"
            placeholder="0"
            value={inputs.totalorders}
            required
          />
        </div>

        <div className="full">
          <label htmlFor="joinedDate">
            Joined Date <span class="req">*</span>
          </label>
          <input
            id="joinedDate"
            name="joinedDate"
            onChange={handleChange}
            type="date"
            value={inputs.joinedDate}
            readOnly  
          />
        </div>

        <div class="actions full">
          <button type="submit">Submit</button>
          <button type="reset" class="secondary">
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
export default UpdateSupplier;

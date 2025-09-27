import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function AddResponse() {
  const { id } = useParams(); //  orderId from URL
  const navigate = useNavigate();
  const [resID, setResID] = useState("");
  const [responseType, setResponseType] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/responses", {
      resID,
      orderId: id,
      responseType,
      notes,
    });
    navigate("/responses", { state: { newResponse: res.data.response } });
  } catch (err) {
    if (err.response && err.response.data.error) {
      alert(err.response.data.error); // Response already exists for this order
      navigate("/supplierorder"); 
    } else {
      console.error(err);
    }
  }
};


  return (
    <div className="form-container">
      <h2>Add Response</h2>
      <form onSubmit={handleSubmit}>
        <label>Order ID:</label>
        <input
          type="text"
          value={id}
          readOnly
        />

        <label>Response ID:</label>
        <input
          type="text"
          value={resID}
          onChange={(e) => setResID(e.target.value)}
          required
        />

        <label>Response Type:</label>
        <select
          value={responseType}
          onChange={(e) => setResponseType(e.target.value)}
          required
        >
          <option value="">Select</option>
          <option value="Accept">Accept</option>
          <option value="Reject">Reject</option>
        </select>

        <label>Notes:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button type="submit">Submit Response</button>
      </form>
    </div>
  );
}

export default AddResponse;

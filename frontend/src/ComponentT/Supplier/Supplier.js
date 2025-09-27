import React from "react";
import "./Supplier.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Supplier({ supplier, onDelete }) {
  const {
    _id,
    supId,
    supname,
    supphone,
    gmail,
    address,
    performanceScore,
    totalorders,
    joinedDate,
  } = supplier;

  /*const deleteHandler= async()=>{
    const history = useNavigate();
    await axios.delete(`http://localhost:5000/suppliers/${_id}`)
    .then(res=>res.data)
    .then(()=>history("/"))
    .then(()=>history("/supplierlist"))
  }*/

  const deleteHandler = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this supplier?"
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:5000/suppliers/${_id}`);
      onDelete(_id); // Remove from frontend state
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <tr>
      <td>{supId}</td>
      <td>{supname}</td>
      <td>{supphone}</td>
      <td>{gmail}</td>
      <td>{address}</td>
      <td>{performanceScore}</td>
      <td>{totalorders}</td>
      <td>{joinedDate ? new Date(joinedDate).toLocaleDateString() : "N/A"}</td>
      <td>
        <div className="action-buttons">
          <Link to={`/Supplierlist/${_id}`}>
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

/*function Supplier({ supplier }) {
  if (!supplier) return null; // Prevents destructuring undefined

  const { supId, supname, supphone, gmail, address, performanceScore, totalorders, joinedDate } = supplier;
  return (
    
    <div>
      
      <h1>ID: {supId}</h1>
      <h1>Name: {supname}</h1>
      <h1>Phone: {supphone}</h1>
      <h1>Gmail: {gmail}</h1>
      <h1>Address: {address}</h1>
      <h1>Performance Score: {performanceScore}</h1>
      <h1>Total Orders: {totalorders}</h1>
      <h1>Joined Date: {joinedDate}</h1>
      <button>Update</button>
      <button>Delete</button>
      
 </div>
  );
}*/

export default Supplier;

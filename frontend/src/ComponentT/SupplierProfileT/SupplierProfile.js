import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Calendar from "../Calendar/Calendar"; 
import "./SupplierProfile.css";

function SupplierProfile() {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch profile
    axios
      .get("http://localhost:5000/api/supplier")
      .then((res) => setProfile(res.data))
      .catch((err) => console.log(err));

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/supplier/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div className="supplier-container">
      <div className="profile-header">
        <h1> Profile</h1>
      </div>

      {profile ? (
        <div className="profile-content">
          <div className="profile-info">
            {profile.profilePic && (
              <img
                src={profile.profilePic}
                alt="Profile Pic"
                className="profile-image"
              />
            )}
            <p><b>Name:</b> {profile.supName}</p>
            <p><b>Phone:</b> {profile.supPhone}</p>
            <p><b>Email:</b> {profile.supMail}</p>
            <p><b>Address:</b> {profile.address}</p>
            <button onClick={() => navigate(`/edit/${profile._id}`)}>Edit Profile</button>
          </div>

         
          <div className="calendar-section">
            <h2> Schedule</h2>
            <p className="calendar-description">
              
            </p>
            <Calendar orders={orders} />

          
            <div className="calendar-legend">
              <span> Accepted</span>
              
              <span> Rejected</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-profile">
          <p>No profile found. Please add your details to get started.</p>
          <button onClick={() => navigate("/add")}>Add Details</button>
        </div>
      )}
    </div>
  );
}

export default SupplierProfile;

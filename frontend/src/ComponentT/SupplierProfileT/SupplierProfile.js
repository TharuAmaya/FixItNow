import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SupplierProfile.css";

function SupplierProfile() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/supplier")
      .then((res) => setProfile(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="supplier-container">
      <div className="profile-header">
        <h1> Profile</h1>
      </div>

      {profile ? (
        <div className="profile-info">
          {profile.profilePic && (
            <img
              src={profile.profilePic}
              alt="Profile Pic"
              className="profile-image"
            />
          )}
          <p>
            <b>Name:</b> {profile.supName}
          </p>
          <p>
            <b>Phone:</b> {profile.supPhone}
          </p>
          <p>
            <b>Email:</b> {profile.supMail}
          </p>
          <p>
            <b>Address:</b> {profile.address}
          </p>
          <button onClick={() => navigate(`/edit/${profile._id}`)}>Edit</button>
        </div>
      ) : (
        <button onClick={() => navigate("/add")}>Add Details</button>
      )}
    </div>
  );
}

export default SupplierProfile;

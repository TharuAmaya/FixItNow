import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './AddEditProfile.css'; 

function AddEditProfile() {
  const { id } = useParams();
  const [form, setForm] = useState({
    supId: "",
    supName: "",
    supPhone: "",
    supMail: "",
    address: "",
    profilePic: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/supplier/${id}`)
        .then(res => {
          console.log('Fetched data:', res.data);
          setForm(res.data);
        })
        .catch(err => {
          console.error('Error fetching supplier:', err);
          alert('Error loading supplier data');
        });
    }
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Submitting form:', form);
    
    if (id) {
      // Update existing supplier
      axios.put(`http://localhost:5000/api/supplier/${id}`, form)
        .then(response => {
          console.log('Update successful:', response.data);
          alert('Profile updated successfully!');
          navigate("/profile");
        })
        .catch(err => {
          console.error('Update error:', err.response?.data || err.message);
          alert(`Error updating profile: ${err.response?.data?.message || err.message}`);
        });
    } else {
      // Create new supplier
      const formData = { ...form };
      // Remove empty supId for new profiles (let backend generate it)
      if (!formData.supId) {
        delete formData.supId;
      }
      
      axios.post("http://localhost:5000/api/supplier", formData)
        .then(response => {
          console.log('Create successful:', response.data);
          alert(`Profile created successfully! Supplier ID: ${response.data.supId}`);
          navigate("/profile");
        })
        .catch(err => {
          console.error('Create error:', err.response?.data || err.message);
          alert(`Error creating profile: ${err.response?.data?.message || err.message}`);
        });
    }
  };

  return (
    <div className="add-edit-container">
      <h1>{id ? "Edit Profile" : "Add Profile"}</h1>
      <form onSubmit={handleSubmit}>
        {form.supId && (
          <>
            <label>Supplier ID</label>
            <input 
              name="supId" 
              type="text"
              value={form.supId} 
              disabled
              style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            />
          </>
        )}
        <label>Name</label>
        <input 
          name="supName" 
          type="text"
          placeholder="Name" 
          value={form.supName} 
          onChange={handleChange} 
          required 
        />
        <label>Phone Number</label>
        <input 
          name="supPhone" 
          type="tel"
          placeholder="Phone" 
          value={form.supPhone} 
          onChange={handleChange} 
          required 
        />
        <label>E-mail</label>
        <input 
          name="supMail" 
          type="email" 
          placeholder="Email" 
          value={form.supMail} 
          onChange={handleChange} 
          required 
        />
        <label>Address</label>
        <input 
          name="address" 
          type="text"
          placeholder="Address" 
          value={form.address} 
          onChange={handleChange} 
          required 
        />
        <label>Profile Picture URL</label>
        <input 
          name="profilePic" 
          type="url" 
          placeholder="Profile Pic URL" 
          value={form.profilePic} 
          onChange={handleChange} 
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default AddEditProfile;

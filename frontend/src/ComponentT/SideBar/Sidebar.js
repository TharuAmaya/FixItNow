import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = forwardRef(({ role }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Expose toggle function via ref
  useImperativeHandle(ref, () => ({
    toggleSidebar,
  }));

  return (
    <>
      <div className="menu-icon" onClick={toggleSidebar}>
        &#9776;
      </div>
      <div
        className="overlay"
        style={{ display: isOpen ? "block" : "none" }}
        onClick={toggleSidebar}
      ></div>
      <div className="sidebar" style={{ width: isOpen ? "250px" : "0" }}>
        <div className="close-btn" onClick={toggleSidebar}>
          &times;
        </div>
        <div className="logo">
          <img src="/logo.png" alt="Site Logo" />
          <span>FIXITNOW</span>
        </div>
        <ul>
          <li>
            <Link to="/home" onClick={toggleSidebar}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/" onClick={toggleSidebar}>
              Profile
            </Link>
          </li>
          <li>
            <Link to="/" onClick={toggleSidebar}>
              Inventory Management
            </Link>
          </li>
          <li>
            <Link to="/Supplierlist" onClick={toggleSidebar}>
              Supplier Relations
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
});

export default Sidebar;

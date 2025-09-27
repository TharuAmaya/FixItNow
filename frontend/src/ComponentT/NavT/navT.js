import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./navT.css";

function NavT({ toggleSidebar }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/notifications");
      const activeNotifications = res.data.notifications.filter(
        (n) => !n.isDeleted
      );
      setNotifications(activeNotifications);
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="top-navbar">
      <div className="menu-section">
        <div className="menu-icon" onClick={toggleSidebar}>
          &#9776;
        </div>
        <span className="menu-text">FixItNow</span>
      </div>
      <div className="nav-buttons">
        <Link to="/Supplierlist" className="nav-btn purple-btn">
          Supplier List
        </Link>
        <Link to="/Purchaseorders" className="nav-btn blue-btn">
          Purchase Orders
        </Link>
        <Link to="/Supplierresponse" className="nav-btn green-btn">
          Supplier Responses
        </Link>
        <Link to="/notifi" className="nav-btn yellow-btn">
          🔔 Notifications
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </Link>
      </div>
    </div>
  );
}

export default NavT;

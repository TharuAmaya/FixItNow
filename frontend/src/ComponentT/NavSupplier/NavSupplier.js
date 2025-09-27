import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./NavSupplier.css";

function NavSupplier() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // auto-refresh every 5s
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
  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.removeItem("role"); // remove saved role
      navigate("/LOgin");
    }
  };

  return (
    <div className="nav-container">
      <div className="brand-name">FIXITNOW</div>
      <div className="nav-right">
        <ul className="home-ull">
          <li className="home-lil">
            <Link to="/home" className="activehome">
              <h1>Home</h1>
            </Link>
          </li>

          <li className="home-lil">
            <Link to="/profile" className="activesuppliers">
              <h1>Profile</h1>
            </Link>
          </li>
          <li className="home-lil">
            <Link to="/supplierorder" className="activepurchases">
              <h1>Purchase Orders</h1>
            </Link>
          </li>
          <li className="home-lil">
            <Link to="/responses" className="acctiveresponsed">
              <h1>My Response</h1>
            </Link>
          </li>
          <li className="home-lil" style={{ position: "relative" }}>
            <Link to="/notifica" className="acctiveresponses">
              <h1>
                Notifications
                {unreadCount > 0 && <span>{unreadCount}</span>}
              </h1>
            </Link>
          </li>
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default NavSupplier;

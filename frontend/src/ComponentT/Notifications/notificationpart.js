import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./notificationpart.css";

function Notificationell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/notifications");
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id, link) => {
    try {
      await axios.put(`http://localhost:5000/notifications/${id}/read`);
      fetchNotifications();
      if (link) navigate(link); // redirect if link exists
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="notification-container">
      <button
        className="notification-bell"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>
      {showDropdown && (
        <div className="notification-dropdown">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div key={notif._id} className="notification-item">
                <p className="notification-message">{notif.message}</p>
                <small className="notification-date">
                  {new Date(notif.createdAt).toLocaleString()}
                </small>

                {!notif.isRead ? (
                  <button
                    className="mark-read-btn"
                    onClick={() => markAsRead(notif._id, notif.link)}
                  >
                    View
                  </button>
                ) : (
                  <span className="notification-seen">Seen</span>
                )}
              </div>
            ))
          ) : (
            <p className="no-notifications">No notifications</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Notificationell;

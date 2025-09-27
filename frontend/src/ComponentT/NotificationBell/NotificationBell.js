import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./NotificationBell.css";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const navigate = useNavigate();

  const updateCountdowns = useCallback(() => {
    const newCountdowns = {};
    notifications.forEach((notif) => {
      if (notif.responseDeadline) {
        const distance = new Date(notif.responseDeadline) - new Date();
        newCountdowns[notif._id] = distance > 0 ? distance : 0;
      }
    });
    setCountdowns(newCountdowns);
  }, [notifications]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
      updateCountdowns();
    }, 1000);
    return () => clearInterval(interval);
  }, [updateCountdowns]);

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

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/notifications/${id}/read`);
      fetchNotifications();
      navigate("/Supplierresponse"); // after marking as read
    } catch (err) {
      console.error(err);
    }
  };

  const formatCountdown = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="notification-container">
      <div className="notification-dropdown">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div key={notif._id} className="notification-item">
              <p className="notification-message">{notif.message}</p>
              <small className="notification-date">
                {new Date(notif.createdAt).toLocaleString()}
              </small>
              {notif.responseDeadline && (
                <p className="notification-countdown">
                  Time left: {formatCountdown(countdowns[notif._id] || 0)}
                </p>
              )}
              {!notif.isRead && (
                <button
                  className="mark-read-btn"
                  onClick={() => markAsRead(notif._id)}
                >
                  Mark as read
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="no-notifications">No notifications</p>
        )}
      </div>
    </div>
  );
}

export default NotificationBell;

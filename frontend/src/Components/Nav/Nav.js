import React from 'react';
import './nav.css';
import { Link } from 'react-router-dom';

function Nav() {

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-logo">
  <img
    src="https://i.pinimg.com/736x/1d/56/92/1d5692a8229c6cf4a8a0c4115f7f3ddf.jpg"
    alt="FixItNow"
  />
  FixItNow
</Link>

      <ul className="navbar-links">
        <Link to="/dashboard" className="navbar-link"><li>Dashboard</li></Link>
        <Link to="/overview" className="navbar-link"><li>Task Overview</li></Link>
        <Link to="/technician-management" className="navbar-link"><li>Technician Management</li></Link>
        <Link to="/task-assignment" className="navbar-link"><li>Task Assignment</li></Link>
        <Link to="/send-pdf" className="navbar-link"><li>Send PDF</li></Link>
        <Link to="/performance-reports" className="navbar-link"><li>Performance Reports</li></Link>
      </ul>

      <div className="navbar-auth">
        <Link to="/notifications"><button className="notifications-btn">Notifications</button></Link>
        <Link to="/logout"><button className="logout-btn">Log Out</button></Link>
      </div>

    </nav>
  );
}

export default Nav;

import React from 'react';
import './nav.css';
import { Link } from 'react-router-dom';

function TechNav() {
  return (
    <nav className="navbar">
      <Link to="/tech-dashboard" className="navbar-logo">
  <img
    src="https://i.pinimg.com/736x/1d/56/92/1d5692a8229c6cf4a8a0c4115f7f3ddf.jpg"
    alt="FixItNow"
  />
  FixItNow
</Link>

      <ul className="navbar-links">
        <Link to="/tech-dashboard" className="navbar-link"><li>Dashboard</li></Link>
        <Link to="/tech-overview" className="navbar-link"><li>Task Overview</li></Link>
      </ul>

      <div className="navbar-auth">
        <Link to="/tech-notifications"><button className="notifications-btn">Notifications</button></Link>
        <Link to="/tech-logout"><button className="logout-btn">Log Out</button></Link>
      </div>
    </nav>
  );
}

export default TechNav;

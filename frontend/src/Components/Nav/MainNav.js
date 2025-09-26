import React from 'react';
import './nav.css';
import { Link } from 'react-router-dom';

function MainNav() {

  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-logo">
  <img
    src="https://i.pinimg.com/736x/1d/56/92/1d5692a8229c6cf4a8a0c4115f7f3ddf.jpg"
    alt="FixItNow"
  />
  FixItNow
</Link>

      <ul className="navbar-links">
        <Link to="/home" className="navbar-link"><li>Home</li></Link>
        <Link to="/about-us" className="navbar-link"><li>About Us</li></Link>
        <Link to="/request" className="navbar-link"><li>Maintenance Requests</li></Link>
        <Link to="/spare-parts" className="navbar-link"><li>Spare Parts</li></Link>
        <Link to="/contact-us" className="navbar-link"><li>Contact Us</li></Link>
      </ul>

      <div className="navbar-auth">
        <Link to="/sign-up"><button className="notifications-btn">Sign Up</button></Link>
        <Link to="/login"><button className="logout-btn">Log In</button></Link>
      </div>

    </nav>
  );
}

export default MainNav;

import React from 'react';
import Nav from '../Nav/Nav';
import { useNavigate } from 'react-router-dom';
import './Logout.css';

function Logout() {
  const navigate = useNavigate();

  const handleConfirm = () => {
    alert('Logged out');
    navigate('/login'); 
  };

  const handleCancel = () => {
    navigate('/dashboard');
    alert('Canceled');
  };

  return (
    <div className="lo-root">
      <div style={{ height: 12 }} />
      <Nav />
      <div className="lo-container">
        <div className="lo-hero" />
        <h1 className="lo-title">Logout</h1>

        <div className="lo-center">
          <div className="lo-card">
            <svg className="lo-illustration" viewBox="0 0 24 24" fill="none" stroke="#0A1E54" strokeWidth="1.5">
              <rect x="3" y="2" width="12" height="20" rx="2" stroke="#C8B39B"/>
              <path d="M9 12h11M18 9l3 3-3 3" />
              <circle cx="8" cy="12" r="1" />
            </svg>

            <div className="lo-heading">Ready to sign out?</div>
            <div className="lo-text">
              This will end the current session. Unsaved changes may be lost. Sign back in anytime to continue.
            </div>

            <div className="lo-actions">
              <button className="lo-btn lo-btn-primary" onClick={handleConfirm}>Logout</button>
              <button className="lo-btn" onClick={handleCancel}>Cancel</button>
            </div>

            <a className="lo-link" href="/dashboard">Back to dashboard</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Logout;

import React from "react";
import "./SitePages.css";
import MainNav from '../Nav/MainNav';

function AboutUs() {
  return (
    <div className="site-root">
      <div className="site-container">
        <MainNav />
        <div className="hero hero-about">
          <div className="hero-inner">
            <h1 className="hero-title">About FixItNow</h1>
            <p className="hero-sub">
              A maintenance request platform connecting customers with the right technician — fast.
              Built for clarity, speed, and trust with warranty‑backed services and genuine spare parts.
            </p>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Our mission</h2>
          <div className="split">
            <div className="card">
              <h4>Customer first</h4>
              <p>Make requesting repairs effortless, transparent, and reliable.</p>
              <ul className="clean">
                <li>Instant matching with relevant technicians</li>
                <li>Clear timelines and updates</li>
                <li>Warranty on services and parts</li>
              </ul>
            </div>
            <div className="card">
              <h4>Technician success</h4>
              <p>Give pros the tools to deliver great work efficiently.</p>
              <ul className="clean">
                <li>Smart scheduling and notifications</li>
                <li>Task history and performance insights</li>
                <li>Genuine parts for durable fixes</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">What we deliver</h2>
          <div className="grid-3">
            <div className="card">
              <h4>Speed</h4>
              <p>Fast assignment and streamlined workflows reduce wait time.</p>
            </div>
            <div className="card">
              <h4>Quality</h4>
              <p>Experienced technicians and OEM parts improve outcomes.</p>
            </div>
            <div className="card">
              <h4>Trust</h4>
              <p>Transparent pricing, tracking, and warranties provide assurance.</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">
              <img src="https://i.pinimg.com/736x/1d/56/92/1d5692a8229c6cf4a8a0c4115f7f3ddf.jpg" alt="FixItNow" />
              <div className="footer-title">FixItNow</div>
            </div>
          <div className="footer-note">
            Fast, reliable maintenance with warranty-backed services and genuine parts.
          </div>

          {/* Social row */}
          <div className="footer-social">
            <a className="ico" aria-label="WhatsApp" href="https://wa.me/94768916723" target="_blank" rel="noreferrer noopener">
              <img src="https://i.pinimg.com/736x/e0/2b/8c/e02b8c39a048919368ff5753d1082de7.jpg" alt="WhatsApp" style={{width:22, height:22, objectFit:"cover", borderRadius:4}} />
            </a>
            <a className="ico" aria-label="Facebook" href="https://facebook.com" target="_blank" rel="noreferrer noopener">
              <img src="https://i.pinimg.com/1200x/d1/bf/a9/d1bfa97a3dd4a8b4eedea7d53f0f3e7a.jpg" alt="Facebook" style={{width:22, height:22, objectFit:"cover", borderRadius:4}} />
            </a>
            <a className="ico" aria-label="Instagram" href="https://instagram.com" target="_blank" rel="noreferrer noopener">
              <img src="https://i.pinimg.com/736x/d4/6e/05/d46e0541bcc23534d9610a42e4c97b7c.jpg" alt="Instagram" style={{width:22, height:22, objectFit:"cover", borderRadius:4}} />
            </a>
          </div>

        </div>

        <div className="footer-links">
          <a href="/about-us"><span className="bullet" />About us</a>
          <a href="/contact-us"><span className="bullet" />Contact</a>
          <a href="/request"><span className="bullet" />Request a service</a>
          <a href="/store"><span className="bullet" />Spare parts store</a>
        </div>

        <div className="footer-links">
          <a href="/terms"><span className="bullet" />Terms</a>
          <a href="/privacy"><span className="bullet" />Privacy</a>
          <a href="/help"><span className="bullet" />Help center</a>
        </div>
      </div>
    </footer>

    </div>
  );
}

export default AboutUs;

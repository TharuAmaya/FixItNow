import MainNav from '../Nav/MainNav';
import React from "react";
import { Link } from "react-router-dom";
import "./SitePages.css";

function Home() {
  return (
    <div className="site-root">
      <div className="site-container">
        <MainNav />

        <div className="hero hero-home">
          <div className="hero-inner">
            <h1 className="hero-title">FixItNow — fast, reliable maintenance</h1>
            <p className="hero-sub">
              Connect instantly with vetted technicians for plumbing, electrical, equipment repair, and AC servicing.
              Request service, track status, buy spare parts, and get warranty-backed work.
            </p>
            <div className="btn-row">
              <Link to="/request" className="btn btn-primary">Request a Service</Link>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Services</h2>
          <div className="grid-3">
            <div className="card">
              <div className="feature">
                <div className="feature-icon">🔧</div>
                <div>
                  <h4>Plumbing</h4>
                  <p>Leak fixes, pipe installs, and fixture replacement by certified pros.</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="feature">
                <div className="feature-icon">⚡</div>
                <div>
                  <h4>Electrical</h4>
                  <p>Safe wiring, appliance hookups, and inspections that meet standards.</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="feature">
                <div className="feature-icon">🛠️</div>
                <div>
                  <h4>Equipment Repair</h4>
                  <p>Quick diagnostics and genuine parts for long‑lasting fixes.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid-3" style={{ marginTop: 12 }}>
            <div className="card">
              <div className="feature">
                <div className="feature-icon">❄️</div>
                <div>
                  <h4>AC Repair</h4>
                  <p>Servicing, gas refills, and component replacement for peak performance.</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="feature">
                <div className="feature-icon">🧰</div>
                <div>
                  <h4>More Services</h4>
                  <p>Painting, carpentry, and on-demand handyman work by trusted partners.</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="feature">
                <div className="feature-icon">🧾</div>
                <div>
                  <h4>Spare Parts</h4>
                  <p>Buy genuine parts with warranties; pickup or doorstep delivery options.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="promo">
            Warranty on services and spare parts, transparent pricing, and real‑time updates for peace of mind.
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Why choose FixItNow?</h2>
          <div className="grid-3">
            <div className="card">
              <h4>Vetted Technicians</h4>
              <p>Skilled pros matched to each request for accuracy and speed.</p>
            </div>
            <div className="card">
              <h4>Spare Parts Store</h4>
              <p>Purchase genuine parts, track orders, and receive warranties.</p>
            </div>
            <div className="card">
              <h4>Live Status</h4>
              <p>Track assignments, progress, and completion time from one place.</p>
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

export default Home;

import React, { useState } from "react";
import "./SitePages.css";
import MainNav from '../Nav/MainNav';

function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState("");

  const update = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    setSent("Message sent! We’ll reply within 1 business day.");
    setTimeout(() => setSent(""), 3000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="site-root">
      <div className="site-container">
        <MainNav />

        <div className="hero hero-contact">
          <div className="hero-inner">
            <h1 className="hero-title">Contact FixItNow</h1>
            <p className="hero-sub">Questions, partnerships, or support — a quick note gets things moving.</p>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Send a message</h2>
          <div className="split">
            <form onSubmit={submit} className="card" style={{ display:"grid", gap:10 }}>
              <label className="label">Name</label>
              <input className="input" value={form.name} onChange={update("name")} required />

              <label className="label">Email</label>
              <input className="input" type="email" value={form.email} onChange={update("email")} required />

              <label className="label">Subject</label>
              <input className="input" value={form.subject} onChange={update("subject")} required />

              <label className="label">Message</label>
              <textarea className="textarea" value={form.message} onChange={update("message")} required />

              <div style={{ display:"flex", gap:8, marginTop:6 }}>
                <button className="btn btn-primary" type="submit">Send</button>
                <button className="btn" type="button" onClick={() => setForm({ name:"", email:"", subject:"", message:"" })}>Clear</button>
              </div>
              {sent && <div className="small">{sent}</div>}
            </form>

            <div className="card">
              <h4>Contact details</h4>
              <p>Email: support@fixitnow.gmail.com</p>
              <p>Phone: +94 76 891 6723</p>
              <p>Office: Colombo HQ</p>
              <div className="map" style={{ display:"grid", placeItems:"center" }}>
                <img
                  src="https://i.pinimg.com/1200x/ca/93/11/ca9311661861da76ea938d3d5b108dd3.jpg"
                  alt="FixItNow office location"
                  style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="promo">
          Prefer WhatsApp? Message us for quick support and order updates.
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

export default ContactUs;

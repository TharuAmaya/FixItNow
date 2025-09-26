import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Nav from '../Nav/Nav';
import { useNavigate } from 'react-router-dom';
import './ManualTaskAssignment.css';

const STATUS_OPTIONS = ["pending","accepted","in-progress","on-hold","completed"];
const URGENCY_OPTIONS = ["low","medium","high"];

function ManualTaskAssignment() {
  const history = useNavigate();
  const techSelectRef = useRef(null);

  const [inputValue, setInputValue] = useState({
    taskId: "",
    customerName: "",
    serviceType: "",
    assignedTechnician: "",
    status: "pending",
    urgency: "medium",
    createdAt: new Date().toISOString().slice(0, 10),
  });

  const [techs, setTechs] = useState([]);
  const [techsLoading, setTechsLoading] = useState(true);
  const [techsError, setTechsError] = useState("");

  useEffect(() => {
    let active = true;
    setTechsLoading(true);
    setTechsError("");
    axios.get("http://localhost:5000/technicians")
      .then((res) => {
        if (!active) return;
        const list = Array.isArray(res.data?.technicians) ? res.data.technicians : [];
        setTechs(list);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Failed to load technicians", err);
        setTechsError("Failed to load technicians");
      })
      .finally(() => active && setTechsLoading(false));
    return () => { active = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.assignedTechnician) {
      alert("Please select a technician");
      techSelectRef.current?.focus();
      return;
    }
    const techName = String(inputValue.assignedTechnician).replace(/\s+/g, " ").trim();
    try {
      await axios.post("http://localhost:5000/tasks", {
        taskId: String(inputValue.taskId),
        customerName: String(inputValue.customerName),
        serviceType: String(inputValue.serviceType),
        assignedTechnician: techName,
        status: String(inputValue.status),
        urgency: String(inputValue.urgency),
        createdAt: String(inputValue.createdAt),
      });
      window.alert("Task Assigned Successfully");
      history("/overview");
    } catch (err) {
      console.error("Create task failed", err);
      window.alert("Failed to assign task");
    }
  };

  return (
    <div className="mta-root">
      <div style={{ height: 12 }} />
      <Nav />
      <div className="mta-container">
        <div className="mta-hero" />
        <h1 className="mta-title">Manual Task Assignment</h1>
        <h2 className="mta-subtitle">Enter Task Details</h2>

        <div className="mta-card">
          <form className="mta-form" onSubmit={handleSubmit}>
            <div className="col-span-2">
              <label className="mta-label">Task ID</label>
              <input
                className="mta-field"
                type="text"
                name="taskId"
                value={inputValue.taskId}
                onChange={handleChange}
                placeholder="Unique ID (e.g., TSK-1024)"
                required
              />
            </div>

            <div>
              <label className="mta-label">Customer Name</label>
              <input
                className="mta-field"
                type="text"
                name="customerName"
                value={inputValue.customerName}
                onChange={handleChange}
                placeholder="Customer full name"
                required
              />
            </div>

            <div>
              <label className="mta-label">Service Type</label>
              <input
                className="mta-field"
                type="text"
                name="serviceType"
                value={inputValue.serviceType}
                onChange={handleChange}
                placeholder="e.g., plumbing, electrical"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="mta-label">Assigned Technician</label>
              {techsLoading ? (
                <div className="mta-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0A1E54" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9" stroke="#C8B39B"/><path d="M12 7v5l3 2" />
                  </svg>
                  Loading technicians…
                </div>
              ) : techsError ? (
                <>
                  <div className="mta-error">{techsError}</div>
                  <input
                    className="mta-field"
                    type="text"
                    name="assignedTechnician"
                    value={inputValue.assignedTechnician}
                    onChange={handleChange}
                    placeholder="Type technician name"
                    required
                  />
                </>
              ) : techs.length === 0 ? (
                <>
                  <div className="mta-help">No technicians found. Enter a name manually.</div>
                  <input
                    className="mta-field"
                    type="text"
                    name="assignedTechnician"
                    value={inputValue.assignedTechnician}
                    onChange={handleChange}
                    placeholder="Type technician name"
                    required
                  />
                </>
              ) : (
                <div className="mta-row">
                  <select
                    ref={techSelectRef}
                    className="mta-field"
                    name="assignedTechnician"
                    value={inputValue.assignedTechnician}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select a technician…</option>
                    {techs.map((t) => (
                      <option key={t.technicianId || t.name} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="mta-label">Status</label>
              <select
                className="mta-field"
                name="status"
                value={inputValue.status}
                onChange={handleChange}
                required
              >
                {STATUS_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>

            <div>
              <label className="mta-label">Urgency</label>
              <select
                className="mta-field"
                name="urgency"
                value={inputValue.urgency}
                onChange={handleChange}
                required
              >
                {URGENCY_OPTIONS.map((u) => (<option key={u} value={u}>{u}</option>))}
              </select>
            </div>

            <div>
              <label className="mta-label">Created At</label>
              <input
                className="mta-field"
                type="date"
                name="createdAt"
                value={inputValue.createdAt}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-span-2 mta-actions">
              <button className="mta-btn mta-btn-primary" type="submit">Submit</button>
              <button
                type="button"
                className="mta-btn"
                onClick={() =>
                  setInputValue({
                    taskId: "",
                    customerName: "",
                    serviceType: "",
                    assignedTechnician: "",
                    status: "pending",
                    urgency: "medium",
                    createdAt: new Date().toISOString().slice(0,10),
                  })
                }
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ManualTaskAssignment;

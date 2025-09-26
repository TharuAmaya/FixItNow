import { useReactToPrint } from "react-to-print";
import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";
import "./TaskOverview.css";

const url = "http://localhost:5000/tasks";

const fetchTasks = async () => {
  const res = await axios.get(url);
  return res.data;
};

const STATUS_OPTIONS = ["pending","accepted","in-progress","on-hold","completed"];

function TaskOverview() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterTechnician, setFilterTechnician] = useState("");
  const [filterServiceType, setFilterServiceType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Task-data",
    onAfterPrint: () => alert("Document printed successfully!"),
  });

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");
    fetchTasks()
      .then((data) => {
        if (!active) return;
        setTasks(Array.isArray(data.tasks) ? data.tasks : []);
      })
      .catch((err) => {
        if (!active) return;
        setLoadError("Failed to load tasks");
        console.error(err);
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const norm = (v) => (v ?? "").toString().trim().toLowerCase();

  const filteredTasks = useMemo(() => {
    const q = norm(searchQuery);
    return tasks.filter((t) => {
      const matchesSearch = !q || Object.values(t).some((field) => norm(field).includes(q));
      const matchesDate = !filterDate || norm(t.createdAt).includes(norm(filterDate));
      const matchesTechnician = !filterTechnician || norm(t.assignedTechnician).includes(norm(filterTechnician));
      const matchesService = !filterServiceType || norm(t.serviceType).includes(norm(filterServiceType));
      const matchesStatus = !filterStatus || norm(t.status) === norm(filterStatus);
      return matchesSearch && matchesDate && matchesTechnician && matchesService && matchesStatus;
    });
  }, [tasks, searchQuery, filterDate, filterTechnician, filterServiceType, filterStatus]);

  const noResults = !loading && filteredTasks.length === 0;

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      alert("Task deleted successfully!");
      setTasks((prev) => prev.filter((t) => t.taskId !== taskId));
    } catch (error) {
      alert("Failed to delete task.");
      console.error(error);
    }
  };

  const technicianOptions = useMemo(() => {
    return Array.from(new Set(tasks.map((t) => t.assignedTechnician).filter(Boolean))).sort();
  }, [tasks]);
  const serviceTypeOptions = useMemo(() => {
    return Array.from(new Set(tasks.map((t) => t.serviceType).filter(Boolean))).sort();
  }, [tasks]);

  return (
    <div className="to-root">
      
      <div className="to-container">
        <Nav />
        <div style={{ height: 12 }} />
        <div className="to-hero" />
        <h1 className="to-title">
          Task Overview
          <span className="to-title-chip">{tasks.length} total</span>
        </h1>

        <div className="to-filters">
          <input
            className="to-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            name="search"
            placeholder="Search all fields..."
          />
          <input
            className="to-input"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            type="text"
            placeholder="Filter by date (e.g., 2025-09-08)"
          />
          <input
            className="to-input"
            list="tech-list"
            value={filterTechnician}
            onChange={(e) => setFilterTechnician(e.target.value)}
            type="text"
            placeholder="Technician"
          />
          <datalist id="tech-list">
            {technicianOptions.map((name) => (<option key={name} value={name} />))}
          </datalist>

          <input
            className="to-input"
            list="service-list"
            value={filterServiceType}
            onChange={(e) => setFilterServiceType(e.target.value)}
            type="text"
            placeholder="Service type"
          />
          <datalist id="service-list">
            {serviceTypeOptions.map((s) => (<option key={s} value={s} />))}
          </datalist>

          <select
            className="to-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>

          <button
            className="to-btn"
            onClick={() => {
              setSearchQuery(""); setFilterDate(""); setFilterTechnician("");
              setFilterServiceType(""); setFilterStatus("");
            }}
          >
            Clear filters
          </button>
        </div>

        <div className="to-card" ref={componentRef}>
          {loading ? (
            <div className="to-state">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#0A1E54" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" stroke="#C8B39B"/>
                <path d="M12 7v5l3 2" />
              </svg>
              <h3>Loading…</h3>
              <p>Please wait while tasks are fetched.</p>
            </div>
          ) : loadError ? (
            <div className="to-state">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#ef476f" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><circle cx="12" cy="16" r="1"/>
              </svg>
              <h3>Failed to load tasks</h3>
              <p>{loadError}</p>
            </div>
          ) : noResults ? (
            <div className="to-state" style={{padding:32}}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#0A1E54" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="16" rx="2" stroke="#C8B39B"/>
                <path d="M8 2v4M16 2v4M3 9h18" />
                <rect x="7" y="12" width="4" height="3" rx=".5" />
                <rect x="13" y="12" width="4" height="3" rx=".5" />
              </svg>
              <h3>No results found</h3>
              <p>Try adjusting filters or search terms.</p>
            </div>
          ) : (
            <div className="to-table-wrap">
              <table className="to-table">
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Customer Name</th>
                    <th>Service Type</th>
                    <th>Technician</th>
                    <th>Status</th>
                    <th>Urgency</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((t) => (
                    <tr key={t.taskId}>
                      <td>{t.taskId}</td>
                      <td>{t.customerName}</td>
                      <td>{t.serviceType}</td>
                      <td>{t.assignedTechnician}</td>
                      <td>
                        <span className={`status ${String(t.status || "").toLowerCase()}`}>
                          {t.status}
                        </span>
                      </td>
                      <td>{t.urgency}</td>
                      <td>{t.createdAt}</td>
                      <td>
                        <div className="to-actions">
                          {/* <a className="to-link" href={`/overview/${t.taskId}`}>Update</a> */}
                          <a className="to-btn to-btn-secondary" href={`/overview/${t.taskId}`}>Update</a>
                          <button className="to-btn to-btn-secondary" onClick={() => handleDelete(t.taskId)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="to-footer-actions">
          <button className="to-btn to-btn-primary" onClick={() => handlePrint()}>Print Tasks</button>
          <button
            className="to-btn"
            onClick={() => {
              const phoneNumber = "+94768916723";
              const message = "Here is the task report you requested.";
              const whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, "_blank");
            }}
          >
            Send Report via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskOverview;

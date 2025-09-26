import { useReactToPrint } from "react-to-print";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TechNav from "../Nav/TechNav";
import "./TechTaskOverview.css";

const TASKS_URL = "http://localhost:5000/tasks";
const TECH_NAME = "Jane Smith";
// const TECH_NAME = "Sara White";
const STATUS_OPTIONS = ["pending", "accepted", "in-progress", "on-hold", "completed"];

function TechTaskOverview() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterServiceType, setFilterServiceType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${TECH_NAME}-Tasks`,
  });

  const norm = (v) => (v ?? "").toString().trim().toLowerCase();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");
    axios
      .get(TASKS_URL)
      .then((res) => {
        if (!active) return;
        const all = Array.isArray(res.data) ? res.data : res.data?.tasks ?? [];
        setTasks(Array.isArray(all) ? all : []);
      })
      .catch((e) => {
        console.error(e);
        if (active) setLoadError("Failed to load tasks");
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const filteredTasks = useMemo(() => {
    const q = norm(searchQuery);
    return tasks.filter((t) => {
      const isMine = norm(t.assignedTechnician) === norm(TECH_NAME);
      if (!isMine) return false;
      const matchesSearch = !q || Object.values(t).some((f) => norm(f).includes(q));
      const matchesDate = !filterDate || norm(t.createdAt).includes(norm(filterDate));
      const matchesService = !filterServiceType || norm(t.serviceType) === norm(filterServiceType);
      const matchesStatus = !filterStatus || norm(t.status) === norm(filterStatus);
      return matchesSearch && matchesDate && matchesService && matchesStatus;
    });
  }, [tasks, searchQuery, filterDate, filterServiceType, filterStatus]);

  const serviceTypeOptions = useMemo(() => {
    return Array.from(
      new Set(
        tasks
          .filter((t) => norm(t.assignedTechnician) === norm(TECH_NAME))
          .map((t) => t.serviceType)
          .filter(Boolean)
      )
    ).sort();
  }, [tasks]);

  const noResults = !loading && filteredTasks.length === 0;

  const [quickStatus, setQuickStatus] = useState("");
  useEffect(() => { setFilterStatus(quickStatus); }, [quickStatus]);

  return (
    <div className="tt-root">
      
      <div className="tt-container">
        <TechNav />
        <div style={{ height: 12 }} />
        <div className="tt-hero" />
        <h1 className="tt-title">{TECH_NAME} — Task List</h1>

        {/* Quick status */}
        <div className="tt-quick">
          <button
            className={`tt-pill ${quickStatus === "accepted" ? "active" : ""}`}
            onClick={() => setQuickStatus(quickStatus === "accepted" ? "" : "accepted")}
          >
            {quickStatus === "accepted" ? "Accepted ✓" : "Accepted"}
          </button>
          <button
            className={`tt-pill ${quickStatus === "in-progress" ? "active" : ""}`}
            onClick={() => setQuickStatus(quickStatus === "in-progress" ? "" : "in-progress")}
          >
            {quickStatus === "in-progress" ? "In Progress ✓" : "In Progress"}
          </button>
          <button
            className={`tt-pill ${quickStatus === "completed" ? "active" : ""}`}
            onClick={() => setQuickStatus(quickStatus === "completed" ? "" : "completed")}
          >
            {quickStatus === "completed" ? "Completed ✓" : "Completed"}
          </button>
        </div>

        {/* Filters */}
        <div className="tt-filters">
          <input
            className="tt-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search my tasks..."
          />
          <input
            className="tt-input"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            type="text"
            placeholder="Filter by deadline (YYYY-MM-DD)"
          />
          <select
            className="tt-select"
            value={filterServiceType}
            onChange={(e) => setFilterServiceType(e.target.value)}
          >
            <option value="">All service types</option>
            {serviceTypeOptions.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
          <select
            className="tt-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>

          <button
            className="tt-btn"
            onClick={() => {
              setSearchQuery("");
              setFilterDate("");
              setFilterServiceType("");
              setFilterStatus("");
              setQuickStatus("");
            }}
          >
            Clear
          </button>
          <button className="tt-btn tt-btn-primary tt-print-hide" onClick={() => handlePrint()}>
            Print
          </button>
        </div>

        {/* Table */}
        <div className="tt-card tt-content-pad" ref={componentRef}>
          {loading ? (
            <p className="tt-state">Loading…</p>
          ) : noResults ? (
            <p className="tt-state">No results found</p>
          ) : (
            <div className="tt-table-wrap">
              <table className="tt-table">
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Customer Name</th>
                    <th>Service Type</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Deadline</th>
                    <th>Created At</th>
                    <th className="tt-cell-right">View</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((t) => (
                    <tr key={t.taskId}>
                      <td>{t.taskId}</td>
                      <td>{t.customerName}</td>
                      <td>{t.serviceType}</td>
                      <td className="tt-status">{t.status}</td>
                      <td>{t.priority ?? t.urgency ?? ""}</td>
                      <td>{t.createdAt}</td>
                      <td>{t.createdAt}</td>
                      <td className="tt-cell-right">
                        <Link
                          to={`/tech-overview/${t.taskId}`}
                          className="tt-btn"
                          style={{ textDecoration:"none", display:"inline-block" }}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {loadError && <p className="tt-error">{loadError}</p>}
        </div>
      </div>
    </div>
  );
}

export default TechTaskOverview;

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TechNav from "../Nav/TechNav";
import "./TaskDetails.css";

const API = "http://localhost:5000";
const TASKS_URL = `${API}/tasks`;

function mapsEmbedUrl(address) {
  const q = encodeURIComponent(address || "");
  return `https://www.google.com/maps?q=${q}&output=embed`;
}

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [contact, setContact] = useState(null);
  const [issue, setIssue] = useState(null);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [status, setStatus] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");

    const loadAll = async () => {
      try {
        const [taskRes, contactRes, issueRes, histRes] = await Promise.all([
          axios.get(`${TASKS_URL}/${id}`),
          axios.get(`${TASKS_URL}/${id}/contact`),
          axios.get(`${TASKS_URL}/${id}/issue`),
          axios.get(`${TASKS_URL}/${id}/history`),
        ]);

        if (!active) return;

        const taskData = Array.isArray(taskRes.data) ? taskRes.data[0] : taskRes.data?.task ?? taskRes.data;
        setTask(taskData || null);
        setStatus((taskData?.status ?? "").toString());

        setContact(contactRes.data?.contact ?? null);
        setIssue(issueRes.data?.issue ?? null);
        setHistory(histRes.data?.history ?? []);
      } catch (e) {
        console.error(e);
        setLoadError("Failed to load task details");
      } finally {
        active && setLoading(false);
      }
    };

    loadAll();
    return () => { active = false; };
  }, [id]);

  const customerName = useMemo(() => task?.customerName ?? "", [task]);
  const customerPhone = useMemo(() => contact?.customerPhone ?? "", [contact]);
  const address = useMemo(() => contact?.address ?? "", [contact]);
  const description = useMemo(() => issue?.issueDescription ?? "", [issue]);

  const appendHistory = async ({ fromStatus, toStatus, reason }) => {
    try {
      await axios.post(`${TASKS_URL}/${id}/history`, { fromStatus, toStatus, reason });
      setHistory((prev) => [
        { taskId: id, fromStatus, toStatus, reason, createdAt: new Date().toISOString() },
        ...prev,
      ]);
    } catch (e) {
      console.error(e);
      alert("Failed to write status history");
    }
  };

  const acceptTask = async () => {
    if (status === "accepted") return;
    setSaving(true);
    try {
      await appendHistory({ fromStatus: status, toStatus: "accepted", reason: "" });
      setStatus("accepted");
    } finally {
      setSaving(false);
    }
  };

  const rejectTask = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason to reject.");
      return;
    }
    setSaving(true);
    try {
      await appendHistory({ fromStatus: status, toStatus: "rejected", reason: rejectReason.trim() });
      setStatus("rejected");
      setRejectReason("");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (next) => {
    setSaving(true);
    try {
      await appendHistory({ fromStatus: status, toStatus: next, reason: "" });
      setStatus(next);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div><TechNav /><div className="td2-container"><p className="td2-state">Loading…</p></div></div>;
  if (loadError) return <div><TechNav /><div className="td2-container"><p className="td2-error">{loadError}</p></div></div>;
  if (!task) return <div><TechNav /><div className="td2-container"><p className="td2-state">Task not found</p></div></div>;

  return (
    <div className="td2-root">
      
      <div className="td2-container">
        <TechNav />
        <div style={{ height: 12 }} />
        <div className="td2-hero" />
        <h1 className="td2-title">Task #{task.taskId ?? id}</h1>

        <div className="td2-grid">
          {/* Left: details */}
          <section className="td2-card">
            <h2 className="td2-h2">Details</h2>

            {/* Customer */}
            <div className="td2-block">
              <div className="td2-block-title">Customer</div>
              <div>Name: {customerName || "—"}</div>
              <div>Phone: {customerPhone || "—"}</div>
            </div>

            {/* Address + map */}
            <div className="td2-block">
              <div className="td2-block-title">Address</div>
              <div className="td2-muted" style={{ marginBottom: 8 }}>{address || "—"}</div>
              {address ? (
                <div className="td2-map">
                  <iframe
                    title="map"
                    src={mapsEmbedUrl(address)}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : null}
            </div>

            {/* Issue */}
            <div className="td2-block">
              <div className="td2-block-title">Issue</div>
              <div className="td2-pre">{description || "—"}</div>
            </div>

            {/* History preview */}
            <div className="td2-block">
              <div className="td2-block-title">Status history</div>
              {history.length === 0 ? (
                <div className="td2-muted">—</div>
              ) : (
                <ul className="td2-list">
                  {history.map((h, i) => (
                    <li key={i}>
                      {new Date(h.createdAt).toLocaleString()} — {h.fromStatus || "none"} → {h.toStatus}
                      {h.reason ? ` (${h.reason})` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Right: actions */}
          <aside className="td2-card" style={{ height: "fit-content" }}>
            <div className="td2-block">
              <div className="td2-block-title">Current status</div>
              <div className="td2-status">{status || "unknown"}</div>
            </div>

            <div className="td2-actions">
              <button className="td2-btn td2-btn-primary" onClick={acceptTask} disabled={saving || status === "accepted"}>
                {saving && status !== "accepted" ? "Saving..." : "Accept task"}
              </button>
              <button className="td2-btn td2-btn-danger" onClick={rejectTask} disabled={saving}>
                Reject task
              </button>
            </div>

            <div className="td2-block">
              <label className="td2-label">Reason for rejection</label>
              <textarea
                className="td2-textarea"
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Provide reason if rejecting"
              />
            </div>

            <div className="td2-block">
              <div className="td2-block-title">Update status</div>
              <div className="td2-actions">
                <button className="td2-btn" onClick={() => updateStatus("in-progress")} disabled={saving}>In Progress</button>
                <button className="td2-btn" onClick={() => updateStatus("on-hold")} disabled={saving}>On Hold</button>
                <button className="td2-btn" onClick={() => updateStatus("completed")} disabled={saving}>Completed</button>
              </div>
            </div>

            <div className="td2-back">
              <button className="td2-btn" onClick={() => navigate(-1)}>Back</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

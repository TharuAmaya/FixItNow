// REQUIRED CSS
import "react-big-calendar/lib/css/react-big-calendar.css";

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import TechNav from "../Nav/TechNav";
import "./TechnicianDashboard.css";

const localizer = momentLocalizer(moment);

const API = "http://localhost:5000";
const TASKS_URL = `${API}/tasks`;
const TECHNICIANS_URL = `${API}/technicians`;

const TECH_ID = "TECH001";
const TECH_NAME = "Jane Smith";
const STATUS_OPTIONS = ["pending", "accepted", "in-progress", "on-hold", "completed"];

const LS_KEY = `techProfile:${TECH_ID}`;
const DEFAULT_AVATAR = "https://i.pinimg.com/736x/db/ae/6e/dbae6eacd21ef7b944452f24e90e574a.jpg";

function toDate(d) {
  if (!d) return null;
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

export default function TechnicianDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [tech, setTech] = useState(null);

  const [profileForm, setProfileForm] = useState({ phone: "", avatarUrl: "", bio: "" });
  const [profileMsg, setProfileMsg] = useState("");

  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.WEEK);

  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const [tasksRes, techRes] = await Promise.all([
          axios.get(TASKS_URL),
          axios.get(`${TECHNICIANS_URL}/${TECH_ID}`)
        ]);
        if (!active) return;

        const allTasks = Array.isArray(tasksRes.data) ? tasksRes.data : tasksRes.data?.tasks ?? [];
        const myTasks = (Array.isArray(allTasks) ? allTasks : []).filter(
          (t) => (t.assignedTechnician ?? "").toString().trim().toLowerCase() === TECH_NAME.toLowerCase()
        );
        setTasks(myTasks);

        const techDoc = techRes.data?.technician ?? techRes.data;
        setTech(techDoc || null);

        const saved = localStorage.getItem(LS_KEY);
        if (saved) {
          try { setProfileForm(JSON.parse(saved)); } catch {}
        }
      } catch (e) {
        console.error(e);
        setLoadError("Failed to load technician dashboard");
      } finally {
        active && setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const events = useMemo(() => {
    const q = (searchQuery ?? "").trim().toLowerCase();
    return tasks
      .filter((t) => !filterStatus || (t.status ?? "").toLowerCase() === filterStatus.toLowerCase())
      .filter((t) => {
        if (!q) return true;
        const blob = `${t.taskId} ${t.customerName} ${t.serviceType} ${t.status}`.toLowerCase();
        return blob.includes(q);
      })
      .map((t) => {
        const start = toDate(t.createdAt) || new Date();
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        const title = `${t.serviceType ?? "Task"} — ${t.customerName ?? t.taskId}`;
        return { id: t.taskId, title, start, end, status: t.status, raw: t };
      });
  }, [tasks, filterStatus, searchQuery]);

  const eventPropGetter = (event) => {
    const colors = {
      pending: "#ffd166",
      accepted: "#8ecae6",
      "in-progress": "#90be6d",
      "on-hold": "#ef476f",
      completed: "#6c757d",
    };
    const bg = colors[(event.status || "").toLowerCase()] || "#3a86ff";
    return { style: { backgroundColor: bg, border: "none", color: "#fff" } };
  };

  const components = {
    event: ({ event }) => (
      <Link to={`/tech/tasks/${event.id}`} style={{ color: "inherit", textDecoration: "none" }}>
        {event.title}
      </Link>
    )
  };

  const saveProfile = () => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(profileForm));
      setProfileMsg("Profile saved locally");
      setTimeout(() => setProfileMsg(""), 2500);
    } catch (e) {
      console.error(e);
      setProfileMsg("Failed to save");
      setTimeout(() => setProfileMsg(""), 2500);
    }
  };

  const avatarSrc = (profileForm.avatarUrl || "").trim() || DEFAULT_AVATAR;

  return (
    <div className="td-root">
      
      <div className="td-container">
        <TechNav />
        <div style={{ height: 12 }} />
        <div className="td-hero" />
        <h1 className="td-title">{TECH_NAME} — Dashboard</h1>

        {loading ? (
          <p>Loading…</p>
        ) : loadError ? (
          <p className="td-error">{loadError}</p>
        ) : (
          <div className="td-grid">
            {/* Calendar card */}
            <section className="td-card">
              <div className="td-filters">
                <input
                  className="td-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Search my tasks..."
                />
                <select
                  className="td-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All statuses</option>
                  {STATUS_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
                <button className="td-btn" onClick={() => { setSearchQuery(""); setFilterStatus(""); }}>
                  Clear
                </button>
              </div>

              <Calendar
                localizer={localizer}
                date={date}
                view={view}
                onNavigate={(d) => setDate(d)}
                onView={(v) => setView(v)}
                defaultView={Views.WEEK}
                views={[Views.DAY, Views.WEEK, Views.MONTH]}
                step={30}
                timeslots={2}
                events={events}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={eventPropGetter}
                components={components}
                className="td-calendar"
              />
            </section>

            {/* Profile (client-only) */}
            <aside className="td-card" style={{ height: "fit-content" }}>
              <div className="td-aside-header">My Profile</div>

              <div className="td-avatar-wrap">
                <img
                  className="td-avatar"
                  src={avatarSrc}
                  alt="avatar"
                  onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR; }}
                />
              </div>

              <div className="td-field">
                <div className="td-field-label">Name</div>
                <div className="td-field-value">{tech?.name || TECH_NAME}</div>
              </div>
              <div className="td-field">
                <div className="td-field-label">Technician ID</div>
                <div className="td-field-value">{tech?.technicianId || TECH_ID}</div>
              </div>
              <div className="td-field">
                <div className="td-field-label">Skills</div>
                <div className="td-field-value">{(tech?.skills || []).join(", ") || "—"}</div>
              </div>
              <div className="td-field">
                <div className="td-field-label">Availability</div>
                <div className="td-field-value">
                  {tech?.availability
                    ? `${(tech.availability.days || []).join(", ")} ${tech.availability.startHour ?? ""}-${tech.availability.endHour ?? ""}`
                    : "—"}
                </div>
              </div>

              <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                <div className="td-label">Phone (local)</div>
                <input
                  className="td-field-input"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />

                <div className="td-label">Avatar URL (local)</div>
                <input
                  className="td-field-input"
                  value={profileForm.avatarUrl}
                  onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                />

                <div className="td-label">Bio (local)</div>
                <textarea
                  className="td-textarea"
                  rows={3}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                />

                <button className="td-btn td-save" onClick={saveProfile}>Save</button>
                {profileMsg && <div className="td-msg">{profileMsg}</div>}
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

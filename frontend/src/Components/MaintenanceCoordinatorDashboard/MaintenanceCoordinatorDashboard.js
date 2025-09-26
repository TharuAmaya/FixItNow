// REQUIRED CSS (must be before component code)
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import "./MaintenanceCoordinatorDashboard.css";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Nav from "../Nav/Nav";
import axios from "axios";
import moment from "moment";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

// React DnD providers for mouse + touch
import { DndProvider } from "react-dnd-multi-backend";
import { MultiBackend } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const TASKS_URL = "http://localhost:5000/tasks";
const DEFAULT_DURATION_MIN = 60;
const UNASSIGNED = "(Unassigned)";

function toDate(d) {
  if (!d) return null;
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function MaintenanceCoordinatorDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.WORK_WEEK);

  const [profile, setProfile] = useState({
    name: "Alex Fernando",
    role: "Maintenance Coordinator",
    email: "alex.fernando@example.com",
    phone: "+94 76 891 6723",
    office: "Colombo HQ",
    avatarUrl: "https://i.pinimg.com/1200x/9b/93/62/9b9362e4b998a73745da74cdc3adb4a9.jpg"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);

  const ranOnceRef = useRef(false);
  useEffect(() => {
    if (ranOnceRef.current) return;
    ranOnceRef.current = true;
    const load = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const res = await axios.get(TASKS_URL);
        const incoming = Array.isArray(res.data) ? res.data : res.data?.tasks ?? [];
        const arr = Array.isArray(incoming) ? incoming : [];
        setTasks(arr);
      } catch {
        setLoadError("Failed to load schedule");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const resources = useMemo(() => {
    const names = new Set([UNASSIGNED]);
    for (const t of tasks) {
      const tech = (t.assignedTechnician ?? "").toString().trim();
      if (tech) names.add(tech);
    }
    return Array.from(names).map((name) => ({ id: name, title: name }));
  }, [tasks]);

  const events = useMemo(() => {
    return tasks
      .map((t) => {
        const start = toDate(t.createdAt) || new Date();
        const end = new Date(start.getTime() + DEFAULT_DURATION_MIN * 60 * 1000);
        const resourceId = (t.assignedTechnician ?? "").toString().trim() || UNASSIGNED;
        const title = `${t.serviceType ?? "Task"} - ${t.customerName ?? t.taskId}`;
        return { id: t.taskId, title, start, end, resourceId, status: t.status, raw: t };
      })
      .filter((e) => e.start instanceof Date && e.end instanceof Date);
  }, [tasks]);

  const onEventDrop = async ({ event, start, end, resourceId }) => {
    try {
      const newCreatedAt = start instanceof Date ? start : new Date(start);
      const newTech = resourceId ?? event.resourceId ?? UNASSIGNED;
      await axios.patch(`${TASKS_URL}/${event.id}`, {
        createdAt: newCreatedAt,
        assignedTechnician: newTech === UNASSIGNED ? "" : newTech,
      });
      setTasks((prev) =>
        prev.map((t) =>
          t.taskId === event.id
            ? {
                ...t,
                createdAt: newCreatedAt.toISOString(),
                assignedTechnician: newTech === UNASSIGNED ? "" : newTech,
              }
            : t
        )
      );
    } catch {
      alert("Failed to move task");
    }
  };

  const onEventResize = async ({ event, start }) => {
    try {
      const newCreatedAt = start instanceof Date ? start : new Date(start);
      await axios.patch(`${TASKS_URL}/${event.id}`, { createdAt: newCreatedAt });
      setTasks((prev) =>
        prev.map((t) => (t.taskId === event.id ? { ...t, createdAt: newCreatedAt.toISOString() } : t))
      );
    } catch {
      alert("Failed to resize task");
    }
  };

  const longPressThreshold = 150;

  const startEdit = () => { setForm(profile); setIsEditing(true); };
  const cancelEdit = () => { setIsEditing(false); setForm(profile); };
  const saveEdit = async () => {
    try {
      setSaving(true);
      setProfile(form);
      setIsEditing(false);
    } finally { setSaving(false); }
  };
  const updateField = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="mcd-root">
      
      <div className="mcd-container">
        <Nav />
        <div style={{ height: 12 }} />
        {/* Optional hero banner */}
        <div className="mcd-hero" />

        <h1 className="mcd-title">Maintenance Coordinator Dashboard</h1>

        {loading ? (
          <p className="mcd-loading">Loading schedule…</p>
        ) : loadError ? (
          <p className="mcd-error">{loadError}</p>
        ) : (
          <div className="mcd-grid">
            {/* Left: Calendar card */}
            <div className="mcd-calendar-card">
              <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                <DnDCalendar
                  localizer={localizer}
                  date={date}
                  view={view}
                  onNavigate={(d) => setDate(d)}
                  onView={(v) => setView(v)}
                  defaultView={Views.WORK_WEEK}
                  views={[Views.DAY, Views.WORK_WEEK, Views.MONTH]}
                  step={30}
                  timeslots={2}
                  selectable
                  longPressThreshold={longPressThreshold}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  draggableAccessor={() => true}
                  resizable
                  onEventDrop={onEventDrop}
                  onEventResize={onEventResize}
                  resources={resources}
                  resourceIdAccessor="id"
                  resourceTitleAccessor="title"
                  eventPropGetter={(event) => {
                    const colors = {
                      pending: "#ffd166",
                      accepted: "#8ecae6",
                      "in-progress": "#90be6d",
                      "on-hold": "#ef476f",
                      completed: "#6c757d",
                    };
                    const bg = colors[event.status] || "#3a86ff";
                    return { style: { backgroundColor: bg, border: "none", color: "#fff" } };
                  }}
                />
              </DndProvider>
            </div>

            {/* Right: Profile panel */}
            <aside className="mcd-aside">
              <div className="mcd-aside-header">Coordinator Profile</div>

              <div className="mcd-avatar-wrap">
                <img className="mcd-avatar" src={isEditing ? form.avatarUrl : profile.avatarUrl} alt="Coordinator avatar" />
                {isEditing && (
                  <div style={{ marginTop: 10 }}>
                    <input
                      className="mcd-input"
                      type="url"
                      placeholder="Avatar URL"
                      value={form.avatarUrl}
                      onChange={updateField("avatarUrl")}
                    />
                  </div>
                )}
              </div>

              {!isEditing ? (
                <div style={{ marginTop: 12 }}>
                  <div className="mcd-field">
                    <div className="mcd-field-label">Full name</div>
                    <div className="mcd-field-value">{profile.name}</div>
                  </div>
                  <div className="mcd-field">
                    <div className="mcd-field-label">Role</div>
                    <div className="mcd-field-value">{profile.role}</div>
                  </div>
                  <div className="mcd-field">
                    <div className="mcd-field-label">Email</div>
                    <div className="mcd-field-value">{profile.email}</div>
                  </div>
                  <div className="mcd-field">
                    <div className="mcd-field-label">Phone</div>
                    <div className="mcd-field-value">{profile.phone}</div>
                  </div>
                  <div className="mcd-field">
                    <div className="mcd-field-label">Office</div>
                    <div className="mcd-field-value">{profile.office}</div>
                  </div>
                  <div className="mcd-btn-row">
                    <button className="mcd-btn mcd-btn-ghost" onClick={startEdit}>Edit</button>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                  <div className="mcd-label">Full name</div>
                  <input className="mcd-input" value={form.name} onChange={updateField("name")} />
                  <div className="mcd-label">Role</div>
                  <input className="mcd-input" value={form.role} onChange={updateField("role")} />
                  <div className="mcd-label">Email</div>
                  <input className="mcd-input" type="email" value={form.email} onChange={updateField("email")} />
                  <div className="mcd-label">Phone</div>
                  <input className="mcd-input" type="tel" value={form.phone} onChange={updateField("phone")} />
                  <div className="mcd-label">Office</div>
                  <input className="mcd-input" value={form.office} onChange={updateField("office")} />
                  <div className="mcd-btn-row">
                    <button className="mcd-btn mcd-btn-primary" onClick={saveEdit} disabled={saving}>
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button className="mcd-btn mcd-btn-ghost" onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              )}
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default MaintenanceCoordinatorDashboard;

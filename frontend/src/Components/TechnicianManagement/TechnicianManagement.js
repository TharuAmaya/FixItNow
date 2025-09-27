import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";
import "./TechnicianManagement.css";

const BASE_URL = "http://localhost:5000/technicians";
const norm = (v) => (v ?? "").toString().trim().toLowerCase();

const emptyForm = {
  technicianId: "",
  name: "",
  skills: "",
  days: "mon,tue,wed,thu,fri",
  startHour: 9,
  endHour: 17,
  workload: 0,
};

function TechnicianManagement() {
  const [techs, setTechs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterDay, setFilterDay] = useState("");
  const [filterSkill, setFilterSkill] = useState("");
  const [filterMaxWorkload, setFilterMaxWorkload] = useState("");

  const [panelOpen, setPanelOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");
    axios.get(BASE_URL)
      .then((res) => {
        if (!active) return;
        const list = Array.isArray(res.data?.technicians) ? res.data.technicians : [];
        setTechs(list);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Failed to load technicians", err);
        setLoadError("Failed to load technicians");
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const skillOptions = useMemo(() => {
    const all = new Set();
    techs.forEach((t) => (t.skills || []).forEach((s) => all.add(s)));
    return Array.from(all).sort();
  }, [techs]);

  const dayOptions = ["mon","tue","wed","thu","fri","sat","sun"];

  const filteredTechs = useMemo(() => {
    const q = norm(searchQuery);
    const day = norm(filterDay);
    const skill = norm(filterSkill);
    const maxW = filterMaxWorkload === "" ? null : Number(filterMaxWorkload);
    return techs.filter((t) => {
      const skills = Array.isArray(t.skills) ? t.skills : [];
      const days = t?.availability?.days || [];
      const startHour = t?.availability?.startHour;
      const endHour = t?.availability?.endHour;

      const searchBlob = [
        t.technicianId, t.name, ...skills, ...days,
        String(startHour), String(endHour), String(t.workload),
      ].map(norm).join(" ");

      const matchesSearch = !q || searchBlob.includes(q);
      const matchesDay = !day || days.map(norm).includes(day);
      const matchesSkill = !skill || skills.map(norm).includes(skill);
      const matchesWorkload = maxW === null || Number(t.workload || 0) <= maxW;

      return matchesSearch && matchesDay && matchesSkill && matchesWorkload;
    });
  }, [techs, searchQuery, filterDay, filterSkill, filterMaxWorkload]);

  const openAdd = () => { setEditMode(false); setForm(emptyForm); setPanelOpen(true); };
  const openEdit = (t) => {
    setEditMode(true);
    setForm({
      technicianId: t.technicianId || "",
      name: t.name || "",
      skills: (t.skills || []).join(","),
      days: (t?.availability?.days || []).join(",") || "mon,tue,wed,thu,fri",
      startHour: t?.availability?.startHour ?? 9,
      endHour: t?.availability?.endHour ?? 17,
      workload: t.workload ?? 0,
    });
    setPanelOpen(true);
  };
  const closePanel = () => setPanelOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      technicianId: form.technicianId?.trim(),
      name: form.name?.trim(),
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      availability: {
        days: form.days.split(",").map((d) => d.trim().toLowerCase()).filter(Boolean),
        startHour: Number(form.startHour),
        endHour: Number(form.endHour),
      },
      workload: Number(form.workload) || 0,
    };
    try {
      if (editMode) {
        const { technicianId } = payload;
        if (!technicianId) { alert("technicianId is required"); return; }
        const res = await axios.put(`${BASE_URL}/${technicianId}`, payload);
        const updated = res.data?.technician;
        if (updated) setTechs((prev) => prev.map((t) => (t.technicianId === technicianId ? updated : t)));
        alert("Technician updated successfully");
      } else {
        const res = await axios.post(BASE_URL, payload);
        const created = res.data?.technician || res.data?.newTech || res.data;
        if (created) setTechs((prev) => [created, ...prev]);
        alert("Technician created successfully");
      }
      closePanel();
    } catch (err) {
      console.error("Save technician failed", err);
      alert("Failed to save technician");
    }
  };

  const handleDelete = async (technicianId) => {
    const ok = window.confirm("Delete this technician?");
    if (!ok) return;
    try {
      await axios.delete(`${BASE_URL}/${technicianId}`);
      setTechs((prev) => prev.filter((t) => t.technicianId !== technicianId));
      alert("Technician deleted successfully");
    } catch (err) {
      console.error("Delete technician failed", err);
      alert("Failed to delete technician");
    }
  };

  return (
    <div className="tm-root">
      
      <div className="tm-container">
        <Nav />
        <div style={{ height: 12 }} />
        <div className="tm-hero" />
        <h1 className="tm-title">
          Technician Management
          <span className="tm-chip">{techs.length} total</span>
        </h1>

        {/* Filters */}
        <div className="tm-filters">
          <input
            className="tm-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search name, skills, day..."
          />
          <input
            className="tm-input"
            list="day-list"
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
            type="text"
            placeholder="Filter by day (e.g., mon)"
          />
          <datalist id="day-list">
            {dayOptions.map((d) => (<option key={d} value={d} />))}
          </datalist>

          <input
            className="tm-input"
            list="skill-list"
            value={filterSkill}
            onChange={(e) => setFilterSkill(e.target.value)}
            type="text"
            placeholder="Filter by skill (e.g., plumbing)"
          />
          <datalist id="skill-list">
            {skillOptions.map((s) => (<option key={s} value={s} />))}
          </datalist>

          <input
            className="tm-number"
            value={filterMaxWorkload}
            onChange={(e) => setFilterMaxWorkload(e.target.value)}
            type="number"
            placeholder="Max workload"
          />

          <button
            className="tm-btn"
            onClick={() => { setSearchQuery(""); setFilterDay(""); setFilterSkill(""); setFilterMaxWorkload(""); }}
          >
            Clear filters
          </button>

          <button className="tm-btn tm-btn-primary" onClick={openAdd}>
            + Add Technician
          </button>
        </div>

        {/* Table / states */}
        <div className="tm-card">
          {loading ? (
            <div className="tm-state">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#0A1E54" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" stroke="#C8B39B"/><path d="M12 7v5l3 2" />
              </svg>
              <h3>Loading…</h3>
              <p>Please wait while technicians are fetched.</p>
            </div>
          ) : loadError ? (
            <div className="tm-state">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#ef476f" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><circle cx="12" cy="16" r="1"/>
              </svg>
              <h3>Failed to load technicians</h3>
              <p>{loadError}</p>
            </div>
          ) : filteredTechs.length === 0 ? (
            <div className="tm-state" style={{padding:32}}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#0A1E54" strokeWidth="1.5">
                <path d="M3 20l3-3 4 2 6-6 5 4" stroke="#C8B39B"/>
                <circle cx="7" cy="7" r="2.5" />
                <path d="M14 4h7M14 8h7M14 12h4" />
              </svg>
              <h3>No technicians found</h3>
              <p>Try adjusting filters or add a new technician.</p>
            </div>
          ) : (
            <div className="tm-table-wrap">
              <table className="tm-table">
                <thead>
                  <tr>
                    <th>Technician ID</th>
                    <th>Name</th>
                    <th>Skills</th>
                    <th>Availability</th>
                    <th>Workload</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTechs.map((t) => {
                    const days = t?.availability?.days || [];
                    const startHour = t?.availability?.startHour ?? "";
                    const endHour = t?.availability?.endHour ?? "";
                    return (
                      <tr key={t.technicianId}>
                        <td>{t.technicianId}</td>
                        <td>{t.name}</td>
                        <td>
                          {(t.skills || []).map((s) => (
                            <span className="tm-chip-skill" key={s}>{s}</span>
                          ))}
                        </td>
                        <td>
                          {days.join(", ")}{" "}
                          {startHour !== "" && endHour !== "" ? `(${startHour}:00 - ${endHour}:00)` : ""}
                        </td>
                        <td>{t.workload ?? 0}</td>
                        <td>
                          <div className="tm-actions">
                            <button className="tm-btn" onClick={() => openEdit(t)}>Update</button>
                            <button className="tm-btn" onClick={() => handleDelete(t.technicianId)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right-side panel */}
        {panelOpen && (
          <div className="tm-panel">
            <div className="tm-panel-header">
              <h3 className="tm-panel-title">{editMode ? "Update Technician" : "Add Technician"}</h3>
              <button className="tm-panel-close" onClick={closePanel}>Close</button>
            </div>
            <form className="tm-form" onSubmit={handleSubmit}>
              <label className="tm-label">Technician ID</label>
              <input
                className="tm-field"
                type="text"
                value={form.technicianId}
                onChange={(e) => setForm((f) => ({ ...f, technicianId: e.target.value }))}
                placeholder="Unique ID (e.g., T-1001)"
                required
                disabled={editMode}
              />
              <label className="tm-label">Name</label>
              <input
                className="tm-field"
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Technician name"
                required
              />
              <label className="tm-label">Skills (comma-separated)</label>
              <input
                className="tm-field"
                type="text"
                value={form.skills}
                onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
                placeholder="e.g., plumbing, electrical"
              />
              <label className="tm-label">Availability days (comma-separated)</label>
              <input
                className="tm-field"
                type="text"
                value={form.days}
                onChange={(e) => setForm((f) => ({ ...f, days: e.target.value }))}
                placeholder="e.g., mon,tue,wed,thu,fri"
              />
              <div className="tm-form-row">
                <div style={{ flex: 1 }}>
                  <label className="tm-label">Start hour</label>
                  <input
                    className="tm-field"
                    type="number"
                    min={0}
                    max={23}
                    value={form.startHour}
                    onChange={(e) => setForm((f) => ({ ...f, startHour: e.target.value }))}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="tm-label">End hour</label>
                  <input
                    className="tm-field"
                    type="number"
                    min={1}
                    max={24}
                    value={form.endHour}
                    onChange={(e) => setForm((f) => ({ ...f, endHour: e.target.value }))}
                  />
                </div>
              </div>
              <label className="tm-label">Workload</label>
              <input
                className="tm-field"
                type="number"
                min={0}
                value={form.workload}
                onChange={(e) => setForm((f) => ({ ...f, workload: e.target.value }))}
              />
              <button className="tm-submit" type="submit">
                {editMode ? "Save changes" : "Create technician"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default TechnicianManagement;

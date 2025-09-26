import React,{useEffect,useState,useRef} from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateTask.css';

const STATUS_OPTIONS = ["pending","accepted","in-progress","on-hold","completed"];
const URGENCY_OPTIONS = ["low","medium","high"];

function UpdateTask() {
  const [task, setTask] = useState({
    taskId: "",
    customerName: "",
    serviceType: "",
    assignedTechnician: "",
    status: "pending",
    urgency: "medium",
    createdAt: new Date().toISOString().slice(0,10),
  });
  const [techs, setTechs] = useState([]);
  const [techsLoading, setTechsLoading] = useState(true);
  const [techsError, setTechsError] = useState("");

  const techSelectRef = useRef(null);
  const history = useNavigate();
  const { id } = useParams();

  // Load task
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/tasks/${id}`);
        const data = res.data?.task || {};
        const createdDate = data.createdAt ? new Date(data.createdAt) : new Date();
        setTask((prev) => ({
          ...prev,
          taskId: data.taskId ?? "",
          customerName: data.customerName ?? "",
          serviceType: data.serviceType ?? "",
          assignedTechnician: data.assignedTechnician ?? "",
          status: data.status ?? "pending",
          urgency: data.urgency ?? "medium",
          createdAt: new Date(createdDate.getTime() - createdDate.getTimezoneOffset()*60000)
            .toISOString()
            .slice(0,10),
        }));
      } catch (err) {
        console.error("Failed to load task", err);
        alert("Failed to load task");
      }
    };
    if (id) fetchTask();
  }, [id]);

  // Load technicians
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

  const sendRequest = async () => {
    const techName = String(task.assignedTechnician).replace(/\s+/g, " ").trim();
    await axios.put(`http://localhost:5000/tasks/${id}`, {
      taskId: String(task.taskId),
      customerName: String(task.customerName),
      serviceType: String(task.serviceType),
      assignedTechnician: techName,
      status: String(task.status),
      urgency: String(task.urgency),
      createdAt: String(task.createdAt),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.assignedTechnician && techs.length > 0) {
      alert("Please select a technician");
      techSelectRef.current?.focus();
      return;
    }
    try {
      await sendRequest();
      window.alert("Task Updated Successfully");
      history("/overview");
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update task");
    }
  };

  return (
    <div className="ut-root">
      <div className="ut-container">
        <div className="ut-hero" />
        <h1 className="ut-title">Update Task</h1>
        <h2 className="ut-subtitle">Modify task details and save changes</h2>

        <div className="ut-card">
          <form className="ut-form" onSubmit={handleSubmit}>
            <div className="col-span-2">
              <label className="ut-label">Task ID</label>
              <input
                className="ut-field"
                type="text"
                name="taskId"
                value={task.taskId}
                onChange={handleChange}
                placeholder="Unique ID (e.g., TSK-1024)"
                required
              />
            </div>

            <div>
              <label className="ut-label">Customer Name</label>
              <input
                className="ut-field"
                type="text"
                name="customerName"
                value={task.customerName}
                onChange={handleChange}
                placeholder="Customer full name"
                required
              />
            </div>

            <div>
              <label className="ut-label">Service Type</label>
              <input
                className="ut-field"
                type="text"
                name="serviceType"
                value={task.serviceType}
                onChange={handleChange}
                placeholder="e.g., plumbing, electrical"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="ut-label">Assigned Technician</label>
              {techsLoading ? (
                <div className="ut-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0A1E54" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9" stroke="#C8B39B"/><path d="M12 7v5l3 2" />
                  </svg>
                  Loading technicians…
                </div>
              ) : techsError ? (
                <>
                  <div className="ut-error">{techsError}</div>
                  <input
                    className="ut-field"
                    type="text"
                    name="assignedTechnician"
                    value={task.assignedTechnician}
                    onChange={handleChange}
                    placeholder="Type technician name"
                    required
                  />
                </>
              ) : techs.length === 0 ? (
                <>
                  <div className="ut-help">No technicians found. Enter a name manually.</div>
                  <input
                    className="ut-field"
                    type="text"
                    name="assignedTechnician"
                    value={task.assignedTechnician}
                    onChange={handleChange}
                    placeholder="Type technician name"
                    required
                  />
                </>
              ) : (
                <select
                  ref={techSelectRef}
                  className="ut-field"
                  name="assignedTechnician"
                  value={task.assignedTechnician}
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
              )}
            </div>

            <div>
              <label className="ut-label">Status</label>
              <select
                className="ut-field"
                name="status"
                value={task.status}
                onChange={handleChange}
                required
              >
                {STATUS_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>

            <div>
              <label className="ut-label">Urgency</label>
              <select
                className="ut-field"
                name="urgency"
                value={task.urgency}
                onChange={handleChange}
                required
              >
                {URGENCY_OPTIONS.map((u) => (<option key={u} value={u}>{u}</option>))}
              </select>
            </div>

            <div>
              <label className="ut-label">Created At</label>
              <input
                className="ut-field"
                type="date"
                name="createdAt"
                value={task.createdAt}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-span-2 ut-actions">
              <button className="ut-btn ut-btn-primary" type="submit">Save Changes</button>
              <button
                type="button"
                className="ut-btn"
                onClick={() =>
                  setTask((prev) => ({
                    ...prev,
                    assignedTechnician: "",
                    status: "pending",
                    urgency: "medium",
                  }))
                }
              >
                Reset fields
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateTask;

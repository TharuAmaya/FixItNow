import React, { useCallback, useEffect, useMemo, useState } from "react";
import TechNav from "../Nav/TechNav";
import "./TechNotifications.css";

const typeToStyle = {
  info:    { label: "Info",    icon: "ℹ️", cls: "tn-info" },
  warning: { label: "Warning", icon: "⚠️", cls: "tn-warning" },
  error:   { label: "Alert",   icon: "⛔", cls: "tn-error" }
};

const LS_KEY = "techNotifications:v1";

function seedDefaults() {
  const now = Date.now();
  return [
    {
      id: `seed-${now}-1`,
      type: "info",
      message: "Welcome back! You have 2 tasks scheduled today.",
      createdAt: new Date(now - 2 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: `seed-${now}-2`,
      type: "info",
      message: "New task assigned: T012 @ " + new Date(now + 60 * 60 * 1000).toLocaleString(),
      createdAt: new Date(now - 60 * 1000).toISOString(),
      read: false,
      taskId: "T012"
    },
    {
      id: `seed-${now}-3`,
      type: "warning",
      message: "Task T007 starts in 30 minutes.",
      createdAt: new Date(now - 30 * 1000).toISOString(),
      read: false,
      taskId: "T007"
    }
  ];
}

function TechNotifications() {
  const [open, setOpen] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let restored = [];
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) restored = parsed;
      }
    } catch {}
    if (!restored || restored.length === 0) {
      restored = seedDefaults();
      try { localStorage.setItem(LS_KEY, JSON.stringify(restored)); } catch {}
    }
    setItems(restored);
  }, []);

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const unreadCount = useMemo(() => items.filter((i) => !i.read).length, [items]);

  const addNotification = useCallback((message, type = "info", meta = {}) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const row = { id, type, message, createdAt: new Date().toISOString(), read: false, ...meta };
    setItems((prev) => [row, ...prev]);
  }, []);

  const pushAssigned = useCallback((taskId, when) => {
    addNotification(
      `New task assigned: ${taskId}${when ? ` @ ${new Date(when).toLocaleString()}` : ""}`,
      "info",
      { taskId }
    );
  }, [addNotification]);

  const pushRescheduled = useCallback((taskId, oldTime, newTime) => {
    addNotification(
      `Task rescheduled by Admin: ${taskId} ${oldTime ? `from ${new Date(oldTime).toLocaleString()}` : ""} to ${new Date(newTime).toLocaleString()}`,
      "info",
      { taskId }
    );
  }, [addNotification]);

  const markAsRead = useCallback((id) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
  }, []);

  const removeOne = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
    try { localStorage.removeItem(LS_KEY); } catch {}
  }, []);

  return (
    <div className="tn-root">
      
      <div className="tn-container">
        <TechNav />
        <div style={{ height: 12 }} />
        <div className="tn-hero" />
        <div className="tn-inner">
          <h1 className="tn-title">Notifications</h1>

          {/* Header with unread badge */}
          <div className="tn-header">
            <button className="tn-toggle" onClick={() => setOpen((o) => !o)}>
              <span role="img" aria-label="bell">🔔</span>
              Notifications
              {unreadCount > 0 && <span className="tn-badge">{unreadCount}</span>}
            </button>
          </div>

          {/* Drawer */}
          {open && (
            <div className="tn-drawer">
              {/* Sticky header */}
              <div className="tn-drawer-header">
                <div>Notifications</div>
                <div className="tn-drawer-actions">
                  <button className="tn-btn tn-btn-soft" onClick={markAllAsRead}>Mark all read</button>
                  <button className="tn-btn" onClick={clearAll}>Clear all</button>
                </div>
              </div>

              {/* List */}
              <div className="tn-list">
                {items.length === 0 ? (
                  <div className="tn-empty">No notifications</div>
                ) : (
                  items.map((n) => {
                    const t = typeToStyle[n.type] || typeToStyle.info;
                    const stateClass = n.read ? "read" : "unread";
                    return (
                      <div
                        key={n.id}
                        className={`tn-item ${t.cls} ${stateClass}`}
                        onClick={() => markAsRead(n.id)}
                        title={n.read ? "Read" : "Unread"}
                      >
                        <div className="tn-icon">{t.icon}</div>
                        <div>
                          <div className="tn-title-item">{t.label}</div>
                          <div className="tn-message">{n.message}</div>
                          <div className="tn-meta">{new Date(n.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="tn-item-actions">
                          {!n.read && (
                            <button
                              className="tn-chip-btn"
                              onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                            >
                              Mark read
                            </button>
                          )}
                          <button
                            className="tn-chip-btn"
                            onClick={(e) => { e.stopPropagation(); removeOne(n.id); }}
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Demo triggers */}
              <div className="tn-drawer-footer">
                <button className="tn-btn tn-btn-soft" onClick={() => pushAssigned("T009", Date.now())}>
                  + New task assigned
                </button>
                <button
                  className="tn-btn tn-btn-soft"
                  onClick={() => pushRescheduled("T003", Date.now() - 3600000, Date.now() + 7200000)}
                >
                  + Task rescheduled by Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TechNotifications;

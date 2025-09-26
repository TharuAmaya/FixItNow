import React, { useCallback, useMemo, useState } from "react";
import Nav from "../Nav/Nav";
import "./Notifications.css";

const typeToStyle = {
  info:   { label: "Info",    icon: "ℹ️",  cls: "nt-info" },
  warning:{ label: "Warning", icon: "⚠️",  cls: "nt-warning" },
  error:  { label: "Alert",   icon: "⛔",  cls: "nt-error" },
};

function Notifications() {
  const [open, setOpen] = useState(true);
  const [items, setItems] = useState([
    { id: "n1", type: "error",   message: "Technician unavailable — reassign needed", createdAt: new Date().toISOString(), read: false },
    { id: "n2", type: "warning", message: "Task overdue", createdAt: new Date().toISOString(), read: false },
    { id: "n3", type: "info",    message: "New request received", createdAt: new Date().toISOString(), read: false },
  ]);

  const unreadCount = useMemo(() => items.filter((i) => !i.read).length, [items]);

  const addNotification = useCallback((message, type = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setItems((prev) => [{ id, type, message, createdAt: new Date().toISOString(), read: false }, ...prev]);
  }, []);

  const markAsRead = useCallback((id) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
  }, []);

  const removeOne = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearAll = useCallback(() => { setItems([]); }, []);

  return (
    <div className="nt-root">
      
      <div className="nt-container">
        <Nav />
        <div style={{ height: 12 }} />
        <div className="nt-hero" />
        <div className="nt-inner">
          <h1 className="nt-titlebar">Notifications</h1>

          {/* Header bar with badge */}
          <div className="nt-header">
            <button className="nt-toggle" onClick={() => setOpen((o) => !o)}>
              <span role="img" aria-label="bell">🔔</span>
              Notifications
              {unreadCount > 0 && <span className="nt-badge">{unreadCount}</span>}
            </button>
          </div>

          {/* Drawer */}
          {open && (
            <div className="nt-drawer">
              {/* Sticky header */}
              <div className="nt-drawer-header">
                <div>Notifications</div>
                <div className="nt-drawer-actions">
                  <button className="nt-btn nt-btn-soft" onClick={markAllAsRead}>Mark all read</button>
                  <button className="nt-btn" onClick={clearAll}>Clear all</button>
                </div>
              </div>

              {/* List */}
              <div className="nt-list">
                {items.length === 0 ? (
                  <div className="nt-empty">No notifications</div>
                ) : (
                  items.map((n) => {
                    const t = typeToStyle[n.type] || typeToStyle.info;
                    const stateClass = n.read ? "read" : "unread";
                    return (
                      <div
                        key={n.id}
                        className={`nt-item ${t.cls} ${stateClass}`}
                        onClick={() => markAsRead(n.id)}
                        title={n.read ? "Read" : "Unread"}
                      >
                        <div className="nt-icon">{t.icon}</div>
                        <div>
                          <div className="nt-title">{t.label}</div>
                          <div className="nt-message">{n.message}</div>
                          <div className="nt-meta">{new Date(n.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="nt-item-actions">
                          {!n.read && (
                            <button
                              className="nt-chip-btn"
                              onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                            >
                              Mark read
                            </button>
                          )}
                          <button
                            className="nt-chip-btn"
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

              {/* Sticky footer demo triggers (remove in prod) */}
              <div className="nt-drawer-footer">
                <button className="nt-btn nt-btn-soft" onClick={() => addNotification("New request received", "info")}>+ New request</button>
                <button className="nt-btn" onClick={() => addNotification("Task overdue", "warning")}>+ Task overdue</button>
                <button className="nt-btn" onClick={() => addNotification("Technician unavailable — reassign needed", "error")}>+ Tech unavailable</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;

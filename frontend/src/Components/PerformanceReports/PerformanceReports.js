import React, { useMemo } from "react";
import Nav from "../Nav/Nav";
import "./PerformanceReports.css";

// Helper: format minutes to h:mm
function fmtMinutes(totalMin) {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// Mini bar component using classes
function MiniBar({ label, value, max, color = "#0A1E54" }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="mini">
      <div className="mini-row">
        <span className="mini-label">{label}</span>
        <span className="mini-value">{value}</span>
      </div>
      <div className="mini-track">
        <div className="mini-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function PerformanceReports() {
  // Mock inputs (swap with real API data)
  const ratings = [
    { tech: "Jane Smith", rating: 4.6, reviews: 42 },
    { tech: "Bob Lee", rating: 4.3, reviews: 31 },
    { tech: "Sara White", rating: 4.8, reviews: 27 },
  ];

  const completedTasks = [
    { id: "T001", tech: "Jane Smith", completionMin: 95, responseMin: 18, serviceType: "AC Repair", completedAt: "2025-08-05" },
    { id: "T003", tech: "Sara White", completionMin: 120, responseMin: 22, serviceType: "Electrical Installation", completedAt: "2025-08-21" },
    { id: "T007", tech: "Jane Smith", completionMin: 80, responseMin: 15, serviceType: "Electrical Inspection", completedAt: "2025-09-01" },
    { id: "T009", tech: "Bob Lee", completionMin: 140, responseMin: 35, serviceType: "Plumbing Repair", completedAt: "2025-09-10" },
    { id: "T010", tech: "Jane Smith", completionMin: 105, responseMin: 20, serviceType: "AC Repair", completedAt: "2025-09-14" },
  ];

  // Summary metrics
  const overallRating = useMemo(() => {
    if (!ratings.length) return 0;
    const totalWeighted = ratings.reduce((acc, r) => acc + r.rating * (r.reviews || 1), 0);
    const totalReviews = ratings.reduce((acc, r) => acc + (r.reviews || 1), 0);
    return totalReviews ? (totalWeighted / totalReviews) : 0;
  }, [ratings]);

  const avgCompletionMin = useMemo(() => {
    if (!completedTasks.length) return 0;
    const sum = completedTasks.reduce((acc, t) => acc + (t.completionMin || 0), 0);
    return Math.round(sum / completedTasks.length);
  }, [completedTasks]);

  const avgResponseMin = useMemo(() => {
    if (!completedTasks.length) return 0;
    const sum = completedTasks.reduce((acc, t) => acc + (t.responseMin || 0), 0);
    return Math.round(sum / completedTasks.length);
  }, [completedTasks]);

  // Completed per month (YYYY-MM)
  const perMonth = useMemo(() => {
    const map = new Map();
    for (const t of completedTasks) {
      const d = new Date(t.completedAt);
      if (Number.isNaN(d.getTime())) continue;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map.set(key, (map.get(key) || 0) + 1);
    }
    const arr = Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
    return arr.map(([month, count]) => ({ month, count }));
  }, [completedTasks]);

  // Service type trends
  const perServiceType = useMemo(() => {
    const map = new Map();
    for (const t of completedTasks) {
      const key = t.serviceType || "Other";
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries()).map(([serviceType, count]) => ({ serviceType, count }));
  }, [completedTasks]);

  const maxMonth = Math.max(1, ...perMonth.map((x) => x.count));
  const maxSvc = Math.max(1, ...perServiceType.map((x) => x.count));

  // Technician leaderboard
  const leaderboard = useMemo(() => {
    const counts = completedTasks.reduce((acc, t) => {
      acc[t.tech] = (acc[t.tech] || 0) + 1;
      return acc;
    }, {});
    const rateByTech = ratings.reduce((acc, r) => {
      acc[r.tech] = r.rating;
      return acc;
    }, {});
    const allTechs = Array.from(new Set([...Object.keys(counts), ...ratings.map((r) => r.tech)]));
    return allTechs
      .map((tech) => ({ tech, rating: rateByTech[tech] ?? 0, completed: counts[tech] ?? 0 }))
      .sort((a, b) => b.rating - a.rating || b.completed - a.completed);
  }, [completedTasks, ratings]);

  return (
    <div className="pr-root">
      
      <div className="pr-container">
        <Nav />
        <div style={{ height: 12 }} />
        <div className="pr-hero" />
        <h1 className="pr-title">Performance Reports</h1>

        {/* Summary cards */}
        <div className="pr-summary-grid">
          <div className="pr-card">
            <div className="pr-card-label">Technician rating</div>
            <div className="pr-card-value">{overallRating.toFixed(2)} / 5</div>
          </div>
          <div className="pr-card">
            <div className="pr-card-label">Avg completion time</div>
            <div className="pr-card-value">{fmtMinutes(avgCompletionMin)}</div>
          </div>
          <div className="pr-card">
            <div className="pr-card-label">Avg response time</div>
            <div className="pr-card-value">{fmtMinutes(avgResponseMin)}</div>
          </div>
        </div>

        {/* Charts row */}
        <div className="pr-charts">
          <section className="pr-section">
            <div className="pr-section-title">Completed tasks per month</div>
            {perMonth.length === 0 ? (
              <div className="pr-nodata">No data</div>
            ) : (
              <div>
                {perMonth.map((m) => (
                  <MiniBar key={m.month} label={m.month} value={m.count} max={maxMonth} color="#3b82f6" />
                ))}
              </div>
            )}
          </section>

          <section className="pr-section">
            <div className="pr-section-title">Service type trends</div>
            {perServiceType.length === 0 ? (
              <div className="pr-nodata">No data</div>
            ) : (
              <div>
                {perServiceType.map((s) => (
                  <MiniBar key={s.serviceType} label={s.serviceType} value={s.count} max={maxSvc} color="#10b981" />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Leaderboard */}
        <div style={{ marginTop: 12 }}>
          <section className="pr-section">
            <div className="pr-section-title">Technician leaderboard</div>
            {leaderboard.length === 0 ? (
              <div className="pr-nodata">No data</div>
            ) : (
              <div className="pr-table-wrap">
                <table className="pr-table">
                  <thead>
                    <tr>
                      <th>Technician</th>
                      <th>Rating</th>
                      <th>Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((row) => (
                      <tr key={row.tech}>
                        <td>{row.tech}</td>
                        <td>{row.rating.toFixed(2)}</td>
                        <td>{row.completed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

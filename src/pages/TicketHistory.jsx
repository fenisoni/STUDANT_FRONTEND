import React, { useState, useEffect } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import {
  Ticket,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  X,
  MessageSquare,
  Calendar,
  Sparkles
} from "lucide-react";

export default function TicketHistory() {
  const { user, setActiveTab } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = () => {
    setLoading(true);
    api.getMyTickets()
      .then((data) => {
        setTickets(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setTickets([]);
        setLoading(false);
      });
  };

  const safeTickets = Array.isArray(tickets) ? tickets : [];
  const filteredTickets = safeTickets.filter((t) => {
    const matchesSearch =
      t.ticket_id.toLowerCase().includes(search.toLowerCase()) ||
      t.query_text.toLowerCase().includes(search.toLowerCase()) ||
      (t.department_name && t.department_name.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px 0" }}>
      {/* Header Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <span className="badge badge-primary">Silver Oak College of Computer Application</span>
          </div>
          <h1 style={{ fontSize: "clamp(20px, 4vw, 24px)", fontWeight: 800, color: "#062051", letterSpacing: "-0.5px" }}>
            Ticket History & Resolution Tracker
          </h1>
          <p style={{ fontSize: "12.5px", color: "#64748b" }}>
            Track escalated academic queries and review official faculty replies
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setActiveTab("chat")}>
          <MessageSquare size={15} /> New AI Inquiry
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-card"
        style={{
          padding: "14px 16px",
          marginBottom: "16px",
          display: "flex",
          gap: "12px",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          background: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "220px" }}>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type="text"
              className="input-field"
              placeholder="Search by Ticket ID, subject, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: "36px", fontSize: "13px" }}
            />
            <Search size={15} color="#64748b" style={{ position: "absolute", left: "12px", top: "12px" }} />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: "#475569", display: "flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
            <Filter size={13} /> Filter:
          </span>
          <select
            className="input-field"
            style={{ width: "auto", minWidth: "130px", padding: "6px 10px", fontSize: "12.5px", cursor: "pointer" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="Answered">Answered</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="glass-card" style={{ overflow: "hidden", background: "#ffffff" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Loading ticket records...</div>
        ) : filteredTickets.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <Ticket size={40} color="#94a3b8" style={{ margin: "0 auto 12px" }} />
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#062051", marginBottom: "4px" }}>No tickets found</div>
            <p style={{ fontSize: "13px", color: "#64748b" }}>
              {search || statusFilter !== "All"
                ? "Try adjusting your search filters to see matching records."
                : "You have not raised any faculty support tickets yet."}
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
                <th style={{ padding: "14px 20px", fontSize: "12px", fontWeight: 700, color: "#062051", textTransform: "uppercase" }}>Ticket ID</th>
                <th style={{ padding: "14px 20px", fontSize: "12px", fontWeight: 700, color: "#062051", textTransform: "uppercase" }}>Query / Subject</th>
                <th style={{ padding: "14px 20px", fontSize: "12px", fontWeight: 700, color: "#062051", textTransform: "uppercase" }}>Department</th>
                <th style={{ padding: "14px 20px", fontSize: "12px", fontWeight: 700, color: "#062051", textTransform: "uppercase" }}>Status</th>
                <th style={{ padding: "14px 20px", fontSize: "12px", fontWeight: 700, color: "#062051", textTransform: "uppercase" }}>Date</th>
                <th style={{ padding: "14px 20px", fontSize: "12px", fontWeight: 700, color: "#062051", textTransform: "uppercase", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((t) => (
                <tr
                  key={t.ticket_id}
                  style={{ borderBottom: "1px solid #e2e8f0", transition: "background 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "16px 20px", fontWeight: 700, color: "#062051", fontSize: "13px" }}>
                    {t.ticket_id}
                  </td>
                  <td style={{ padding: "16px 20px", maxWidth: "380px" }}>
                    <div style={{ fontWeight: 600, fontSize: "14px", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {t.query_text}
                    </div>
                    {t.faculty_reply && (
                      <div style={{ fontSize: "12px", color: "#059669", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <CheckCircle2 size={12} /> Faculty responded
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: "13px", color: "#475569" }}>
                    {t.department_name || t.dept_id}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span
                      className={`badge ${
                        t.status === "Resolved"
                          ? "badge-success"
                          : t.status === "Answered"
                          ? "badge-primary"
                          : "badge-warning"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: "12px", color: "#64748b" }}>
                    {t.created_at ? t.created_at.slice(0, 10) : "Today"}
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedTicket(t)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(6, 32, 81, 0.6)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px",
            zIndex: 100,
          }}
          onClick={() => setSelectedTicket(null)}
        >
          <div
            className="glass-card animate-fade-in"
            style={{
              maxWidth: "640px",
              width: "100%",
              padding: "20px 16px",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 40px -10px rgba(6, 32, 81, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: "6px" }}>{selectedTicket.ticket_id}</span>
                <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#062051" }}>Ticket Information & Status</h2>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "11.5px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>
                  Student Inquiry
                </div>
                <div style={{ fontSize: "14.5px", lineHeight: 1.5, color: "#0f172a", fontWeight: 600 }}>{selectedTicket.query_text}</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>Department</div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#062051" }}>{selectedTicket.department_name || selectedTicket.dept_id}</div>
                </div>
                <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>Assigned Faculty</div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#062051" }}>{selectedTicket.faculty_name || "Department Staff"}</div>
                </div>
              </div>

              {selectedTicket.faculty_reply ? (
                <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "18px", borderRadius: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "#047857" }}>
                    <CheckCircle2 size={18} />
                    <span style={{ fontWeight: 700, fontSize: "13px" }}>Official Faculty Resolution</span>
                  </div>
                  <div style={{ fontSize: "14px", lineHeight: 1.6, color: "#065f46" }}>
                    {selectedTicket.faculty_reply}
                  </div>
                </div>
              ) : (
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", padding: "16px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <Clock size={20} color="#b45309" />
                  <div style={{ fontSize: "13px", color: "#92400e" }}>
                    This ticket is assigned and awaiting faculty response. A notification will be dispatched as soon as an update is posted.
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="btn btn-secondary" onClick={() => setSelectedTicket(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

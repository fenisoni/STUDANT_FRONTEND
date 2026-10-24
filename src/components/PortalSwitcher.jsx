import React, { useState, useRef, useEffect } from "react";
import { ExternalLink, ChevronDown, CheckCircle, Server, GraduationCap, Briefcase, ShieldCheck } from "lucide-react";

export default function PortalSwitcher({ currentPortal = "student" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  const backendDocsUrl = isLocal ? "http://127.0.0.1:8000/docs" : "https://silver-oak-university-ai-student-help.onrender.com/docs";
  const backendHealthUrl = isLocal ? "http://127.0.0.1:8000/api/health" : "https://silver-oak-university-ai-student-help.onrender.com/api/health";

  const portals = [
    {
      id: "student",
      title: "Student Portal",
      badge: "Unified",
      icon: GraduationCap,
      color: "#2563eb",
      bgColor: "#eff6ff",
      desc: "AI Query Desk, 11 ERP Modules, Digital Hall Ticket & PARI Risk",
    },
    {
      id: "faculty",
      title: "Faculty & HOD Portal",
      badge: "Unified",
      icon: Briefcase,
      color: "#d97706",
      bgColor: "#fef3c7",
      desc: "Assigned Tickets Workbench, HOD Department Escalations & CC Oversight",
    },
    {
      id: "admin",
      title: "Admin Command Centre",
      badge: "Unified",
      icon: ShieldCheck,
      color: "#059669",
      bgColor: "#ecfdf5",
      desc: "Knowledge Base Management, SLA Audit Logs & Governance",
    },
    {
      id: "backend",
      title: isLocal ? "FastAPI Backend (Local)" : "FastAPI Backend (Render)",
      badge: isLocal ? "Port 8000" : "Render Live",
      url: backendDocsUrl,
      icon: Server,
      color: "#7c3aed",
      bgColor: "#f5f3ff",
      desc: "FastAPI REST Server, 10-Agent Pipeline & OpenAPI Interactive Docs",
    },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentInfo = portals.find((p) => p.id === currentPortal) || portals[0];

  return (
    <div style={{ position: "relative", display: "inline-block" }} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-sm btn-secondary"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "#f8fafc",
          border: "1px solid #cbd5e1",
          color: "#062051",
          fontWeight: 700,
          fontSize: "11.5px",
          padding: "5px 10px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
        title="Switch between Local Frontends & Backend"
      >
        <span style={{ display: "inline-block", width: "7px", height: "7px", borderRadius: "50%", background: "#10b981" }} />
        <span className="hide-on-mobile">Local Portals:</span>
        <span style={{ color: currentInfo.color, fontWeight: 800 }}>{currentInfo.badge}</span>
        <ChevronDown size={13} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 6px)",
            width: "330px",
            background: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e2e8f0",
            padding: "10px",
            zIndex: 1000,
            animation: "fadeIn 0.15s ease",
          }}
        >
          <div style={{ padding: "4px 8px 8px", borderBottom: "1px solid #f1f5f9", marginBottom: "6px" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#062051" }}>Silver Oak Local Network</div>
            <div style={{ fontSize: "10.5px", color: "#64748b" }}>
              4 Local Services (3 Frontends + 1 Backend) connected
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {portals.map((p) => {
              const isCurrent = p.id === currentPortal;
              const Icon = p.icon;
              return (
                <a
                  key={p.id}
                  href={p.url}
                  target={isCurrent ? "_self" : "_blank"}
                  rel="noreferrer"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    background: isCurrent ? p.bgColor : "#ffffff",
                    border: isCurrent ? `1px solid ${p.color}40` : "1px solid transparent",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrent) e.currentTarget.style.background = "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrent) e.currentTarget.style.background = "#ffffff";
                  }}
                >
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "6px",
                      background: p.bgColor,
                      color: p.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  >
                    <Icon size={16} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a" }}>
                        {p.title}
                      </span>
                      <span
                        style={{
                          fontSize: "9.5px",
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: "4px",
                          background: isCurrent ? p.color : "#f1f5f9",
                          color: isCurrent ? "#ffffff" : "#475569",
                        }}
                      >
                        {isCurrent ? "Active" : p.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: "10.5px", color: "#64748b", marginTop: "2px", lineHeight: 1.3 }}>
                      {p.desc}
                    </div>
                  </div>

                  {!isCurrent && (
                    <ExternalLink size={12} color="#94a3b8" style={{ marginTop: "4px", flexShrink: 0 }} />
                  )}
                </a>
              );
            })}
          </div>

          <div
            style={{
              marginTop: "8px",
              paddingTop: "8px",
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "10.5px",
              color: "#64748b",
            }}
          >
            <span>API Docs: <a href={backendDocsUrl} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontWeight: 600 }}>/docs</a></span>
            <span>Health: <a href={backendHealthUrl} target="_blank" rel="noreferrer" style={{ color: "#16a34a", fontWeight: 600 }}>/health</a></span>
          </div>
        </div>
      )}
    </div>
  );
}

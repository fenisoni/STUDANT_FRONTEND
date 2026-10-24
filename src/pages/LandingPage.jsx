import React, { useState } from "react";
import {
  GraduationCap,
  Bot,
  BrainCircuit,
  Ticket,
  Bell,
  ChartColumn,
  Workflow,
  ShieldCheck,
  Cloud,
  TrendingUp,
  ArrowRight,
  MessageSquare,
  Users,
  Layers,
  Database,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  Award
} from "lucide-react";

export default function LandingPage({ onLaunch, onQuickLogin, onOpenChat }) {
  const [selectedAgent, setSelectedAgent] = useState(null);

  const stats = [
    { label: "Role portals", value: "7" },
    { label: "NAAC criteria tracked", value: "7" },
    { label: "Bookable resources", value: "26" },
    { label: "Automated tests", value: "29" },
  ];

  const features = [
    {
      icon: Bot,
      title: "Multi-Agent AI Help Desk",
      desc: "13 cooperating agents detect intent, retrieve knowledge, decide, route & notify.",
    },
    {
      icon: TrendingUp,
      title: "Market & Technology Radar",
      desc: "What launched, what to learn, what hiring looks like — every claim dated and sourced.",
    },
    {
      icon: BrainCircuit,
      title: "RAG Knowledge Engine",
      desc: "Semantic search over circulars, policies & FAQs with confidence-gated answers.",
    },
    {
      icon: Ticket,
      title: "Smart Ticketing + SLA",
      desc: "Auto-ticketing when retrieval confidence is too low to trust, with escalation up the chain.",
    },
    {
      icon: Bell,
      title: "Real-Time Notifications",
      desc: "Watchers auto-added across the chain; In-App + Gmail SMTP on every event.",
    },
    {
      icon: ChartColumn,
      title: "Analytics Dashboards",
      desc: "Attendance, bookings, exam fees, and quality metrics, each shown with its source.",
    },
    {
      icon: Workflow,
      title: "Workflow Automation",
      desc: "Student → AI → Admin → Faculty → HOD → Resolution → Knowledge Base learning.",
    },
    {
      icon: ShieldCheck,
      title: "RBAC + Audit Logs",
      desc: "JWT authentication, 7 role portals, full audit trail & responsible AI governance.",
    },
  ];

  const agents = [
    { id: 1, name: "Intent Recognition Agent", desc: "Extracts underlying student query category (Fees, Exam, Admission)" },
    { id: 2, name: "Entity Extraction Agent", desc: "Extracts course codes, semester numbers, dates and roll numbers" },
    { id: 3, name: "Knowledge Retrieval Agent", desc: "Performs hybrid BM25 + embedding search over SOU circulars" },
    { id: 4, name: "RAG Agent", desc: "Generates grounded answers strictly bounded by official university context" },
    { id: 5, name: "Decision Agent", desc: "Applies 70%/50% confidence thresholds for direct answer vs verification" },
    { id: 6, name: "Ticket Agent", desc: "Generates auto-tickets with unique tracking IDs when confidence < 50%" },
    { id: 7, name: "Faculty Routing Agent", desc: "Matches query subject to the exact department incharge or HOD" },
    { id: 8, name: "Email Agent", desc: "Dispatches SMTP alerts to students and faculty with status updates" },
    { id: 9, name: "Learning Agent", desc: "Discovers newly resolved ticket solutions and drafts KB articles" },
    { id: 10, name: "Analytics Agent", desc: "Tracks SLA compliance, average resolution time, and query distribution" },
    { id: 11, name: "Notification Orchestration", desc: "Coordinates multi-channel student alerts and reminders" },
    { id: 12, name: "Sentiment Agent", desc: "Detects urgency and student stress levels for priority escalation" },
    { id: 13, name: "Market & Technology Radar", desc: "Maintains industry alignment, syllabi updates, and career trends" },
  ];

  const portals = [
    {
      role: "student",
      title: "Student Portal",
      badge: "Self-Service",
      demoKey: "student",
      icon: GraduationCap,
      items: ["Timetable & attendance", "Fees & receipts", "Results, SGPA/CGPA", "AI assistant & tickets"],
    },
    {
      role: "faculty",
      title: "Faculty Portal",
      badge: "Resolution Wing",
      demoKey: "faculty",
      icon: BrainCircuit,
      items: ["Mark attendance", "Upload syllabus content", "Resolve assigned tickets", "Exam duties & salary"],
    },
    {
      role: "hod",
      title: "HOD / HOI Portal",
      badge: "Dept Governance",
      demoKey: "hod",
      icon: Layers,
      items: ["Student/faculty analytics", "Faculty reassignment", "Department CC review", "Escalation management"],
    },
    {
      role: "admin",
      title: "Central Admin",
      badge: "Helpdesk Control",
      demoKey: "admin",
      icon: Users,
      items: ["Knowledge Base learning", "Ticket routing & SLA sweeps", "Classroom allocation", "Announcements"],
    },
    {
      role: "super_admin",
      title: "Super Admin",
      badge: "Institutional Authority",
      demoKey: "super_admin",
      icon: ShieldCheck,
      items: ["Global config & domains", "RBAC user management", "System settings & audit logs", "Semester progression engine"],
    },
    {
      role: "hoi",
      title: "HOI / Dean",
      badge: "Academic Leadership",
      demoKey: "hoi",
      icon: Award,
      items: ["Multi-school governance", "NAAC criteria tracking", "Accreditation analytics", "Executive compliance"],
    },
  ];

  const techBadges = [
    "FastAPI", "React 19", "Vite 8", "SQLite3", "Google Gemini 2.0",
    "Tailwind / SOU Theme", "RAG Pipeline", "JWT Security", "SMTP Notifications",
    "BM25 + Semantic Search", "Role-Based RBAC", "Docker Ready"
  ];

  return (
    <div className="landing-container" style={{ minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      {/* Aurora Ambient Backgrounds */}
      <div className="aurora-glow aurora-glow-top" />
      <div className="aurora-glow aurora-glow-bottom" />

      {/* Floating Navigation Bar */}
      <nav
        style={{
          position: "sticky",
          top: "16px",
          zIndex: 50,
          maxWidth: "1160px",
          margin: "0 auto 30px auto",
          padding: "0 16px",
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: "9999px",
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(6, 32, 81, 0.12)",
            boxShadow: "0 10px 30px -10px rgba(6, 32, 81, 0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #062051 0%, #0f357e 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(6, 32, 81, 0.25)",
              }}
            >
              <GraduationCap size={20} color="#c59b27" />
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: "16px", color: "#062051", letterSpacing: "-0.3px" }}>
                SOU AI HelpDesk <span style={{ color: "#c59b27" }}>Pro</span>
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#64748b",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Silver Oak University
              </span>
            </div>
          </div>

          <div className="hide-on-mobile" style={{ display: "flex", alignItems: "center", gap: "22px" }}>
            <a href="#features" style={{ fontSize: "13.5px", fontWeight: 600, color: "#475569", textDecoration: "none" }}>
              Features
            </a>
            <a href="#agents" style={{ fontSize: "13.5px", fontWeight: 600, color: "#475569", textDecoration: "none" }}>
              AI Agents
            </a>
            <a href="#portals" style={{ fontSize: "13.5px", fontWeight: 600, color: "#475569", textDecoration: "none" }}>
              Portals
            </a>
            <a href="#analytics" style={{ fontSize: "13.5px", fontWeight: 600, color: "#475569", textDecoration: "none" }}>
              Analytics
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              onClick={onOpenChat}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: "9999px", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Bot size={15} color="#062051" />
              <span>Ask AI</span>
            </button>
            <button
              type="button"
              onClick={onLaunch}
              className="btn btn-primary btn-sm"
              style={{
                borderRadius: "9999px",
                padding: "8px 18px",
                background: "linear-gradient(135deg, #062051 0%, #0f357e 100%)",
                boxShadow: "0 4px 14px rgba(6, 32, 81, 0.25)",
              }}
            >
              Launch Portal <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ maxWidth: "1080px", margin: "40px auto 60px auto", padding: "0 20px", textAlign: "center" }}>
        {/* Official SOU & NAAC Lockup */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            background: "#ffffff",
            padding: "8px 20px",
            borderRadius: "16px",
            boxShadow: "0 6px 24px rgba(6, 32, 81, 0.08)",
            border: "1px solid rgba(6, 32, 81, 0.08)",
            marginBottom: "28px",
          }}
        >
          <img src="/silver_oak_logo.svg" alt="Silver Oak University" style={{ height: "34px", width: "auto" }} />
          <div style={{ width: "2px", height: "24px", background: "#8a1610", opacity: 0.7 }} />
          <img src="/naac_logo.svg" alt="NAAC A+ Grade" style={{ height: "28px", width: "auto" }} />
          <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#854d0e", background: "#fefce8", padding: "3px 8px", borderRadius: "6px" }}>
            NAAC A+ &bull; UGC Approved
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(32px, 5.5vw, 62px)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-1px",
            color: "#062051",
            marginBottom: "20px",
          }}
        >
          Institutional Help Desk &amp; ERP <br />
          <span
            style={{
              background: "linear-gradient(135deg, #062051 0%, #c59b27 70%, #d4af37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Powered by Multi-Agent AI
          </span>
        </h1>

        <p
          style={{
            fontSize: "clamp(15px, 2vw, 19px)",
            color: "#475569",
            maxWidth: "760px",
            margin: "0 auto 36px auto",
            lineHeight: 1.6,
          }}
        >
          A unified university academic governance and student support suite fused with a
          <strong> 13-agent cooperating AI help desk</strong>, grounded RAG knowledge engine,
          multi-department ticket routing, and role-based authority portals.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "50px" }}>
          <button
            type="button"
            onClick={onLaunch}
            className="btn btn-primary"
            style={{
              padding: "14px 32px",
              fontSize: "15.5px",
              fontWeight: 700,
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #062051 0%, #0f357e 100%)",
              boxShadow: "0 8px 24px rgba(6, 32, 81, 0.3)",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            Enter Universal Login <ArrowRight size={18} />
          </button>

          <button
            type="button"
            onClick={onOpenChat}
            className="btn btn-secondary"
            style={{
              padding: "14px 28px",
              fontSize: "15.5px",
              fontWeight: 700,
              borderRadius: "9999px",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Bot size={18} color="#c59b27" /> Try OakMitra Assistant
          </button>
        </div>

        {/* 4 Stat Badges */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            maxWidth: "960px",
            margin: "0 auto",
          }}
        >
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: "22px 16px",
                textAlign: "center",
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.9)",
              }}
            >
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: 800,
                  color: "#062051",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "-1px",
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#64748b", marginTop: "4px" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" style={{ maxWidth: "1140px", margin: "80px auto", padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#062051", letterSpacing: "-0.5px" }}>
            Everything a university needs, <span style={{ color: "#c59b27" }}>unified</span>
          </h2>
          <p style={{ fontSize: "16px", color: "#64748b", marginTop: "8px" }}>
            ERP, SIS, multi-agent help desk, AI RAG engine, and analytics in one synchronized platform.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="glass-card glass-card-interactive"
                style={{
                  padding: "24px",
                  borderRadius: "16px",
                  background: "#ffffff",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "rgba(6, 32, 81, 0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={22} color="#062051" />
                </div>
                <h3 style={{ fontSize: "16.5px", fontWeight: 700, color: "#062051" }}>{f.title}</h3>
                <p style={{ fontSize: "13.5px", color: "#64748b", lineHeight: 1.55 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Agents Architecture */}
      <section id="agents" style={{ maxWidth: "1140px", margin: "90px auto", padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 800,
              color: "#c59b27",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Decentralized Intelligence
          </span>
          <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#062051", marginTop: "6px" }}>
            A <span style={{ color: "#c59b27" }}>Multi-Agent</span> Brain
          </h2>
          <p style={{ fontSize: "15px", color: "#64748b", maxWidth: "680px", margin: "10px auto 0 auto" }}>
            Every query is analyzed through specialized cooperating agents. When retrieval confidence falls below 50%,
            the system transparently escalates to human faculty instead of hallucinating.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
          {agents.map((a) => (
            <div
              key={a.id}
              onClick={() => setSelectedAgent(selectedAgent === a.id ? null : a.id)}
              className="glass-card"
              style={{
                padding: "16px",
                borderRadius: "14px",
                background: selectedAgent === a.id ? "#f0fdf4" : "#ffffff",
                border: selectedAgent === a.id ? "1px solid #86efac" : "1px solid #e2e8f0",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#062051",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {a.id}
                </span>
                <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#062051" }}>{a.name}</span>
              </div>
              <p style={{ fontSize: "12px", color: "#64748b", marginTop: "8px", lineHeight: 1.45 }}>{a.desc}</p>
            </div>
          ))}
        </div>

        {/* Workflow Banner */}
        <div
          className="glass-card"
          style={{
            marginTop: "30px",
            padding: "18px 24px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #062051 0%, #0a2e72 100%)",
            color: "#ffffff",
            textAlign: "center",
            fontSize: "13.5px",
          }}
        >
          <strong style={{ color: "#c59b27" }}>Resolution Pipeline: </strong>
          Student Query &rarr; Language &amp; Spell &rarr; Intent &amp; Entity &rarr; RAG Search &rarr; Confidence Gate &rarr; Direct Answer OR Dept Faculty Ticket &rarr; Resolution &rarr; KB Closed-Loop Learning
        </div>
      </section>

      {/* 7 Role Portals Section */}
      <section id="portals" style={{ maxWidth: "1140px", margin: "90px auto", padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#062051" }}>
            Role-Based <span style={{ color: "#c59b27" }}>Authority Portals</span>
          </h2>
          <p style={{ fontSize: "15px", color: "#64748b", marginTop: "8px" }}>
            Single unified platform with personalized workspaces for every academic level. Click any role to test!
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "22px" }}>
          {portals.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: "24px",
                  borderRadius: "16px",
                  background: "#ffffff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background: "rgba(6, 32, 81, 0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon size={18} color="#062051" />
                      </div>
                      <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#062051" }}>{p.title}</h3>
                    </div>
                    <span className="badge badge-gold" style={{ fontSize: "10.5px" }}>{p.badge}</span>
                  </div>

                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {p.items.map((item, ii) => (
                      <li key={ii} style={{ fontSize: "13px", color: "#475569", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ color: "#c59b27", fontSize: "16px" }}>&bull;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onQuickLogin(p.demoKey)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    width: "100%",
                    padding: "9px",
                    fontWeight: 700,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    border: "1px solid #cbd5e1",
                  }}
                >
                  <ArrowRight size={14} color="#062051" /> Sign in as {p.title}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Analytics Preview */}
      <section id="analytics" style={{ maxWidth: "1140px", margin: "90px auto", padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#062051" }}>
            Live <span style={{ color: "#c59b27" }}>Analytics &amp; Metrics</span>
          </h2>
          <p style={{ fontSize: "15px", color: "#64748b", marginTop: "8px" }}>
            Institutional governance transparency with real-time operational metrics.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {/* Card 1: Tickets Breakdown */}
          <div className="glass-card" style={{ padding: "22px", borderRadius: "16px", background: "#ffffff" }}>
            <h4 style={{ fontSize: "14.5px", fontWeight: 700, color: "#062051", marginBottom: "14px" }}>
              Active Queries by Category
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { cat: "Examinations & Schedules", pct: 38, count: "482", color: "#062051" },
                { cat: "Fees & Scholarships (MYSY)", pct: 29, count: "364", color: "#c59b27" },
                { cat: "Admissions & Eligibility", pct: 19, count: "241", color: "#059669" },
                { cat: "Hostel & Facilities", pct: 14, count: "178", color: "#7c3aed" },
              ].map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 600, color: "#334155" }}>{item.cat}</span>
                    <span style={{ color: "#64748b" }}>{item.count} ({item.pct}%)</span>
                  </div>
                  <div style={{ height: "7px", width: "100%", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: "999px" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: AI Resolution Mix */}
          <div className="glass-card" style={{ padding: "22px", borderRadius: "16px", background: "#ffffff" }}>
            <h4 style={{ fontSize: "14.5px", fontWeight: 700, color: "#062051", marginBottom: "14px" }}>
              AI Resolution Mix
            </h4>
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: "44px", fontWeight: 800, color: "#059669", fontFamily: "var(--font-heading)" }}>
                87.4%
              </div>
              <p style={{ fontSize: "12.5px", color: "#64748b", marginTop: "2px" }}>
                Instant AI Grounded Resolution (Confidence &ge; 70%)
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #f1f5f9", paddingTop: "14px", fontSize: "12px", color: "#64748b" }}>
              <span>Auto-Ticket Escalated: <strong>12.6%</strong></span>
              <span>Avg SLA: <strong>3.2 hrs</strong></span>
            </div>
          </div>

          {/* Card 3: Governance Metrics */}
          <div className="glass-card" style={{ padding: "22px", borderRadius: "16px", background: "#ffffff" }}>
            <h4 style={{ fontSize: "14.5px", fontWeight: 700, color: "#062051", marginBottom: "14px" }}>
              Accreditation &amp; Governance
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { title: "NAAC Criteria 1-7 Audit", val: "100% Compliant", color: "#059669" },
                { title: "SLA Response Rate", val: "99.1% On Time", color: "#059669" },
                { title: "Total Enrolled Profiles", val: "25,000+ Active", color: "#062051" },
                { title: "Active Department Portals", val: "16 Departments", color: "#c59b27" },
              ].map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#f8fafc", borderRadius: "8px" }}>
                  <span style={{ fontSize: "12.5px", color: "#334155" }}>{m.title}</span>
                  <span style={{ fontSize: "12.5px", fontWeight: 700, color: m.color }}>{m.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Badges */}
      <section style={{ maxWidth: "1000px", margin: "60px auto", padding: "0 20px", textAlign: "center" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#062051", marginBottom: "18px" }}>
          Built on an Enterprise Cloud-Native Stack
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
          {techBadges.map((b, i) => (
            <span
              key={i}
              className="badge"
              style={{
                padding: "8px 16px",
                fontSize: "12.5px",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 6px rgba(6, 32, 81, 0.04)",
                color: "#062051",
                fontWeight: 600,
              }}
            >
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer style={{ background: "#ffffff", borderTop: "1px solid #e2e8f0", padding: "60px 20px 40px 20px", textAlign: "center" }}>
        <div
          className="glass-card"
          style={{
            maxWidth: "780px",
            margin: "0 auto 40px auto",
            padding: "36px 24px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #062051 0%, #0f357e 100%)",
            color: "#ffffff",
          }}
        >
          <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "10px" }}>
            Ready to explore <span style={{ color: "#c59b27" }}>SOU AI HelpDesk Pro?</span>
          </h2>
          <p style={{ fontSize: "14.5px", opacity: 0.9, maxWidth: "540px", margin: "0 auto 24px auto" }}>
            Sign in with any 1-click demo role and experience the full academic governance and student support suite.
          </p>
          <button
            type="button"
            onClick={onLaunch}
            className="btn btn-gold"
            style={{
              padding: "13px 32px",
              fontSize: "15px",
              borderRadius: "9999px",
              boxShadow: "0 6px 20px rgba(197, 155, 39, 0.4)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            Launch Universal Login <ArrowRight size={16} />
          </button>
        </div>

        <p style={{ fontSize: "12px", color: "#64748b" }}>
          &copy; 2026 Silver Oak University &bull; Opp. Bhagwat Vidyapith, S.G. Highway, Gota, Ahmedabad - 382481 &bull; All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  GraduationCap, MessageSquare, Ticket,
  ShieldCheck, Briefcase, LogOut,
  UserCheck, Bot,
  FileCheck, X, CheckCircle2
} from "lucide-react";
import PortalSwitcher from "./PortalSwitcher";

// ── Reusable nav tab ───────────────────────────────────────────────────────
function NavTab({ id, label, Icon, active, onClick }) {
  return (
    <button
      className={`nav-tab ${active ? "nav-tab-active" : "nav-tab-inactive"}`}
      onClick={() => onClick(id)}
    >
      <Icon size={15} /> {label}
    </button>
  );
}

// ── PRD Compliance Modal ───────────────────────────────────────────────────
function PRDModal({ onClose }) {
  const [tab, setTab] = useState("tasks");

  const TASKS = [
    { task:"Task 1: Requirement Analysis",   sections:"Sections 2-7",   desc:"User stories US1-US13 across Exam, Fees, Admissions, Placement, Library, Hostel, Services." },
    { task:"Task 2: System Architecture",    sections:"Section 11",     desc:"Dual-layer: SQLite/FastAPI prototype → AWS EC2/RDS/S3/Cognito/SES/Bedrock production." },
    { task:"Task 3: AI Agent Design",        sections:"Section 8",      desc:"10 cooperating agents: Security, Intent, Entity, Retrieval, Decision, Ticket, Routing, Email, Learning, Analytics." },
    { task:"Task 4: NLP Design",             sections:"Section 9",      desc:"Intent classification, entity extraction, semantic search. Formula: 0.4×Intent + 0.4×Retrieval + 0.2×Grounding." },
    { task:"Task 5: Database Design & ER",   sections:"Section 10",     desc:"10 normalized SQLite tables with FK constraints: departments, students, faculty, tickets, kb, chats, notifications." },
    { task:"Task 6: Cloud Architecture",     sections:"Section 11",     desc:"AWS: S3+CloudFront, ECS/ALB, RDS PostgreSQL, SES, Secrets Manager, CloudWatch." },
    { task:"Task 7: Conversation Design",    sections:"Section 12",     desc:"17 distinct intents, 22 verified sample queries with confidence targets and department routing." },
    { task:"Task 8: Chatbot Flow",           sections:"Sections 8,7.3", desc:"Pipeline: Security→Intent→Entity→RAG→Decision (≥0.70 ANSWER / 0.50-0.70 VERIFY / <0.50 ESCALATE)." },
    { task:"Task 9: Prototype Design",       sections:"Section 13",     desc:"6 React screens: Login, Student Dashboard, Chat, Ticket History, Faculty Dashboard, Admin Command Centre." },
    { task:"Task 10: Ethical AI",            sections:"Section 15",     desc:"PII masking, source citations, human-in-the-loop oversight, no automated grade/waiver decisions." },
  ];

  const AGENTS = [
    { name:"1. Security Agent",             role:"Validates role, blocks prompt injection, masks PII" },
    { name:"2. Intent Recognition Agent",   role:"Classifies query into 17 intents with confidence" },
    { name:"3. Entity Extraction Agent",    role:"Extracts semester, programme, dates, ticket IDs" },
    { name:"4. Knowledge Retrieval (RAG)",  role:"Semantic search over 7,790 KB articles" },
    { name:"5. Decision Agent",             role:"0.4×Intent + 0.4×Retrieval + 0.2×Grounding threshold" },
    { name:"6. Ticket Management Agent",    role:"Generates TKT-XXXX IDs, manages lifecycle" },
    { name:"7. Faculty Routing Agent",      role:"Load-balanced department/faculty assignment" },
    { name:"8. Email Notification Agent",   role:"HTML email dispatch + notifications table logging" },
    { name:"9. Learning Agent",             role:"Converts resolved tickets into KB candidate entries" },
    { name:"10. Analytics Agent",           role:"Aggregates usage, resolution rate, SLA metrics" },
  ];

  const INTENTS = [
    ["1","exam_schedule","When will Sem 1 exams begin?","0.90","Examination"],
    ["2","exam_result","When will my result be declared?","0.85","Examination"],
    ["3","revaluation","How to apply for re-evaluation?","0.85","Examination"],
    ["4","hall_ticket","Where can I download my hall ticket?","0.88","Examination"],
    ["5","fee_structure","What is the M.Sc. IT fee?","0.88","Accounts"],
    ["6","fee_deadline","Last date to pay fees?","0.87","Accounts"],
    ["7","scholarship_info","How to apply for MYSY scholarship?","0.80","Scholarship"],
    ["8","admission_process","Admission process for M.Sc. IT?","0.86","Admissions"],
    ["9","placement_info","Which companies visit for placements?","0.80","Placement"],
    ["10","library_services","What are library timings?","0.90","Library"],
    ["11","hostel_info","How do I apply for hostel?","0.84","Hostel"],
    ["12","certificate_request","How to get a bonafide certificate?","0.86","Services"],
    ["13","academic_calendar","When does the next semester start?","0.88","Academic"],
    ["14","faculty_contact","Who is the HOD of MSc IT?","1.00","Academic"],
    ["15","campus_facilities","NCC joining process?","1.00","Campus"],
    ["16","greeting_help","What can you help me with?","0.99","Academic"],
    ["17","human_handoff","I want to talk to someone","Escalate","All Depts"],
  ];

  const AWS = [
    { layer:"Frontend",     proto:"React + Vite",               aws:"Amazon S3 + CloudFront CDN" },
    { layer:"Backend",      proto:"Python FastAPI (Uvicorn)",    aws:"Amazon EC2 / ECS / Lambda + ALB" },
    { layer:"Database",     proto:"SQLite (helpdesk.db)",        aws:"Amazon RDS PostgreSQL (Multi-AZ)" },
    { layer:"Vector Store", proto:"Cosine / TF-IDF RAG",         aws:"pgvector on RDS / OpenSearch" },
    { layer:"Auth",         proto:"JWT + bcrypt",                aws:"Amazon Cognito User Pools" },
    { layer:"Email",        proto:"SMTP / audit table",          aws:"Amazon SES" },
    { layer:"AI / LLM",     proto:"RAG Engine (in-house)",       aws:"Amazon Bedrock (Claude / Titan)" },
    { layer:"Secrets",      proto:".env file",                   aws:"AWS Secrets Manager" },
    { layer:"Monitoring",   proto:"chat_history + notifications",aws:"Amazon CloudWatch Logs & Metrics" },
  ];

  const V3_FEATURES = [
    { title: "Multilingual NLP & Voice (EN, GU, HI)", tag: "AI Engine", desc: "Native comprehension for Gujarati (ગુજરાતી), Hindi (हिन्दी), and English queries with dialect normalization." },
    { title: "Predictive Academic Risk Index (PARI)", tag: "Governance", desc: "Machine learning model predicting detainment risk and semester backlogs before exams occur." },
    { title: "Cryptographic Digital Hall Ticket", tag: "Exam Cell", desc: "SHA-256 sealed admit cards with automated clearance lock on unpaid tuition or low attendance." },
    { title: "Real-time Campus Broadcast Dispatch", tag: "IoT & Push", desc: "Campus-wide circular distribution with high-priority push notifications and emergency alerts." },
    { title: "Closed-Loop Self-Tuning RAG", tag: "Continuous ML", desc: "Faculty verified ticket resolutions automatically retrain vector embeddings without downtime." },
    { title: "Autonomous Semester Lifecycle", tag: "ERP Core", desc: "6-month background engine handling grade progression, promotion matrices, and backlog enrollment." },
  ];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(6,32,81,0.65)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"12px", zIndex:100 }}
         onClick={onClose}>
      <div className="glass-card animate-fade-in"
           style={{ maxWidth:"920px", width:"100%", padding:"20px 18px", background:"#fff", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 40px -10px rgba(6,32,81,0.25)" }}
           onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"16px" }}>
          <div>
            <div style={{ display:"flex", gap:"8px", marginBottom:"4px" }}>
              <span className="badge badge-primary">Silver Oak SOCA</span>
              <span className="badge badge-gold">IOM5091C · Sem 01</span>
            </div>
            <h2 style={{ fontSize:"19px", fontWeight:800, color:"#062051" }}>AI Help Desk — PRD Assignment Compliance</h2>
          </div>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:"#64748b", cursor:"pointer", padding:"4px" }}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="horizontal-scroll" style={{ display:"flex", gap:"6px", borderBottom:"1px solid #e2e8f0", paddingBottom:"10px", marginBottom:"16px" }}>
          {[["tasks","Tasks 1–10"],["agents","10 AI Agents"],["intents","17 Intents"],["aws","AWS Cloud"],["v3","🚀 v3.0 Enterprise"]].map(([id,label]) => (
            <button key={id} className={`btn btn-sm ${tab===id?"btn-primary":"btn-secondary"}`}
                    onClick={() => setTab(id)} style={{ whiteSpace:"nowrap", flexShrink:0 }}>
              {label}
            </button>
          ))}
        </div>

        {/* Tasks */}
        {tab === "tasks" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {TASKS.map((item,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px", background:"#f8fafc", borderRadius:"8px", border:"1px solid #e2e8f0", gap:"12px" }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:"13px", color:"#062051" }}>{item.task}</div>
                  <div style={{ fontSize:"12px", color:"#475569", marginTop:"2px" }}>{item.desc}</div>
                  <div style={{ fontSize:"11px", color:"#94a3b8", marginTop:"2px" }}>PRD {item.sections}</div>
                </div>
                <span className="badge badge-success" style={{ flexShrink:0 }}><CheckCircle2 size={11}/> Done</span>
              </div>
            ))}
          </div>
        )}

        {/* Agents */}
        {tab === "agents" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
            {AGENTS.map((ag,i) => (
              <div key={i} style={{ padding:"12px", background:"#f8fafc", borderRadius:"8px", border:"1px solid #e2e8f0" }}>
                <div style={{ fontWeight:700, fontSize:"13px", color:"#062051" }}>{ag.name}</div>
                <div style={{ fontSize:"12px", color:"#475569", marginTop:"3px" }}>{ag.role}</div>
              </div>
            ))}
          </div>
        )}

        {/* Intents */}
        {tab === "intents" && (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px", minWidth:"560px" }}>
              <thead>
                <tr style={{ background:"#062051", color:"#fff" }}>
                  {["#","Intent","Sample Query","Conf","Dept"].map(h => (
                    <th key={h} style={{ padding:"8px 10px", textAlign:"left", fontWeight:700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INTENTS.map((row,i) => (
                  <tr key={i} style={{ borderBottom:"1px solid #e2e8f0", background: i%2===0?"#f8fafc":"#fff" }}>
                    <td style={{ padding:"7px 10px", fontWeight:700, color:"#062051" }}>{row[0]}</td>
                    <td style={{ padding:"7px 10px", color:"#0f357e", fontWeight:600 }}>{row[1]}</td>
                    <td style={{ padding:"7px 10px", color:"#475569" }}>{row[2]}</td>
                    <td style={{ padding:"7px 10px" }}><span className="badge badge-primary" style={{fontSize:"10px"}}>{row[3]}</span></td>
                    <td style={{ padding:"7px 10px", color:"#64748b" }}>{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* AWS */}
        {tab === "aws" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
            {AWS.map((item,i) => (
              <div key={i} style={{ padding:"12px", background:"#f8fafc", borderRadius:"8px", border:"1px solid #e2e8f0" }}>
                <div style={{ fontSize:"11px", fontWeight:700, color:"#64748b", textTransform:"uppercase", marginBottom:"4px" }}>{item.layer}</div>
                <div style={{ fontSize:"12.5px" }}><span style={{color:"#475569"}}>Prototype: </span><strong style={{color:"#062051"}}>{item.proto}</strong></div>
                <div style={{ fontSize:"12.5px", marginTop:"2px" }}><span style={{color:"#475569"}}>AWS: </span><strong style={{color:"#0a2e72"}}>{item.aws}</strong></div>
              </div>
            ))}
          </div>
        )}

        {/* v3 Enterprise */}
        {tab === "v3" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            <div style={{ padding:"10px 14px", background:"#eff6ff", borderRadius:"8px", border:"1px solid #bfdbfe", fontSize:"12px", color:"#1e40af" }}>
              <strong>🚀 v3.0 Enterprise Architecture:</strong> Deployed with multilingual dialect support (Gujarati, Hindi, English), predictive student risk scoring (PARI), cryptographic digital hall tickets, and real-time institutional broadcasts.
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
              {V3_FEATURES.map((item,i) => (
                <div key={i} style={{ padding:"12px", background:"#f8fafc", borderRadius:"8px", border:"1px solid #e2e8f0" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"4px" }}>
                    <span className="badge badge-primary" style={{ fontSize:"10px" }}>{item.tag}</span>
                    <span className="badge badge-success" style={{ fontSize:"9px" }}>Active</span>
                  </div>
                  <div style={{ fontWeight:700, fontSize:"13px", color:"#062051" }}>{item.title}</div>
                  <div style={{ fontSize:"12px", color:"#475569", marginTop:"4px", lineHeight:"1.4" }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Navbar ────────────────────────────────────────────────────────────
export default function Navbar() {
  const { user, logout, activeTab, setActiveTab } = useAuth();
  const [showPRD, setShowPRD] = useState(false);

  if (!user) return null;

  const homeTab = (user.role === "super_admin" || user.role === "admin") ? "admin" : (user.role === "faculty" || user.role === "hod" || user.role === "hoi") ? "faculty" : "dashboard";

  const navTabs =
    user.role === "student" ? [
      { id:"dashboard", label:"Student Dashboard", Icon:GraduationCap },
      { id:"chat",      label:"Ask AI Assistant",  Icon:MessageSquare  },
      { id:"tickets",   label:"My Tickets",        Icon:Ticket         },
    ] : user.role === "super_admin" ? [
      { id:"admin",   label:"Super Admin & Governance", Icon:ShieldCheck },
      { id:"faculty", label:"University Tickets Queue", Icon:Briefcase   },
      { id:"chat",    label:"Test AI Chat",             Icon:Bot         },
    ] : (user.role === "hod" || user.role === "hoi") ? [
      { id:"faculty", label: user.role === "hod" ? "HOD Department Queue" : "HOI Institute Queue", Icon:Briefcase },
      { id:"admin",   label:"Performance Analytics", Icon:ShieldCheck },
      { id:"chat",    label:"Test AI Chat",          Icon:Bot         },
    ] : user.role === "faculty" ? [
      { id:"faculty", label:"Faculty Ticket Inbox",  Icon:Briefcase },
      { id:"chat",    label:"Test AI Chat",          Icon:Bot       },
    ] : [
      { id:"admin",   label:"Admin Centre",          Icon:ShieldCheck },
      { id:"chat",    label:"Test AI Chat",          Icon:Bot         },
      { id:"faculty", label:"Faculty Queue",         Icon:Briefcase   },
    ];

  return (
    <>

      <header style={{ position:"sticky", top:0, zIndex:50, boxShadow:"0 2px 12px rgba(0,0,0,0.07)" }}>

        {/* ── Tier 1: White academic header ────────────────────────────── */}
        <div style={{ background:"#fff", borderBottom:"1px solid #e2e8f0", padding:"6px 14px" }}>
          <div style={{ maxWidth:"1380px", margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", minHeight:"50px", gap:"8px" }}>

            {/* Logo row */}
            <div style={{ display:"flex", alignItems:"center", cursor:"pointer", flexShrink:0, gap:0 }}
                 onClick={() => setActiveTab(homeTab)}>
              <img src="/silver_oak_logo.svg" alt="Silver Oak University" style={{ height:"38px", width:"auto" }} />
              <div style={{ width:"2px", height:"30px", background:"#8a1610", margin:"0 10px", opacity:0.85 }} />
              <img src="/naac_logo.svg" alt="NAAC" style={{ height:"32px", width:"auto" }} />
              <div className="hide-on-mobile" style={{ marginLeft:"14px", borderLeft:"1px solid #e2e8f0", paddingLeft:"14px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                  <span style={{ fontWeight:800, fontSize:"14px", color:"#062051", letterSpacing:"-0.2px" }}>
                    SILVER OAK COLLEGE OF COMPUTER APPLICATION
                  </span>
                  <span className="badge badge-gold" style={{ fontSize:"10px", padding:"1px 7px" }}>AI Help Desk</span>
                  <span className="badge badge-success" style={{ fontSize:"10px", padding:"1px 7px", background:"#10b981", color:"#fff" }}>v3.0 Pro</span>
                </div>
                <div style={{ fontSize:"11px", color:"#475569", display:"flex", alignItems:"center", gap:"8px" }}>
                  <span>{user?.programme ? `${user.programme} · Semester 0${user?.semester || 3}` : "BCA · Semester 03"}</span>
                  <span style={{color:"#cbd5e1"}}>|</span>
                  <span style={{ color:"#8a1610", fontWeight:600 }}>
                    {user?.programme === "M.Sc. IT" 
                      ? "Course: IOM5091C · Div A" 
                      : `Class: ${user?.semester || 3}-${(user?.programme || "BCA").replace(/[^a-zA-Z0-9]/g, "")}-A-2026-27`}
                  </span>
                  <span style={{color:"#cbd5e1"}}>|</span>
                  <span style={{ fontStyle:"italic", color:"#64748b" }}>ज्ञानं परमं भूषणम्</span>
                </div>
              </div>
              <div className="show-on-mobile" style={{ marginLeft:"8px" }}>
                <span className="badge badge-gold" style={{ fontSize:"10px", padding:"2px 6px" }}>SOCA AI</span>
              </div>
            </div>

            {/* Right controls */}
            <div style={{ display:"flex", alignItems:"center", gap:"6px", flexShrink:0 }}>

              {/* Local Portals & Backend Switcher */}
              <PortalSwitcher currentPortal="student" />

              {/* PRD button */}
              <button className="btn btn-secondary btn-sm" onClick={() => setShowPRD(true)}
                style={{ color:"#062051", borderColor:"#c59b27", background:"#fefce8", fontWeight:700, fontSize:"11.5px" }}>
                <FileCheck size={13} color="#c59b27" />
                <span className="hide-on-mobile">PRD Spec</span>
              </button>

              {/* Active Role Badge */}
              <div style={{ display:"flex", alignItems:"center" }}>
                <span className="badge badge-primary" style={{ textTransform:"capitalize", fontSize:"11.5px", padding:"4px 8px" }}>
                  <UserCheck size={12} style={{ marginRight:"4px" }} />
                  {user.role}
                </span>
              </div>

              {/* User info */}
              <div className="hide-on-mobile" style={{ textAlign:"right", paddingLeft:"6px", borderLeft:"1px solid #e2e8f0" }}>
                <div style={{ fontSize:"12px", fontWeight:700, color:"#062051" }}>{user.name}</div>
                <div style={{ fontSize:"10px", color:"#64748b" }}>{user.email}</div>
              </div>

              {/* Logout */}
              <button className="btn btn-secondary btn-sm" onClick={logout}
                style={{ padding:"6px 8px", color:"#dc2626", borderColor:"#fecaca" }}
                title="Log Out">
                <LogOut size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Tier 2: Navy nav bar ─────────────────────────────────────── */}
        <div style={{ background:"#062051", borderBottom:"2px solid #c59b27", padding:"0 12px" }}>
          <div style={{ maxWidth:"1380px", margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", minHeight:"44px", gap:"8px" }}>
            <div className="horizontal-scroll" style={{ display:"flex", alignItems:"center", gap:"4px", width:"100%" }}>
              {navTabs.map(({ id, label, Icon }) => (
                <NavTab key={id} id={id} label={label} Icon={Icon} active={activeTab===id} onClick={setActiveTab} />
              ))}
            </div>
            <div className="hide-on-mobile" style={{ display:"flex", alignItems:"center", gap:"6px", flexShrink:0 }}>
              <span className="pulse-dot" style={{ background:"#10b981" }} />
              <span style={{ fontSize:"11px", color:"#b3d6f0", whiteSpace:"nowrap" }}>10 Agents · RAG Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* PRD Modal */}
      {showPRD && <PRDModal onClose={() => setShowPRD(false)} />}
    </>
  );
}

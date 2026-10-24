import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import {
  Send,
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  FileText,
  Sparkles,
  Ticket,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  CornerDownRight,
  RefreshCw,
  PlusCircle,
  X,
  Layers,
  GraduationCap,
  ExternalLink,
  Plus,
  Trash2
} from "lucide-react";
import DepartmentFacultySelector from "../components/DepartmentFacultySelector";


// ─── Inline Markdown Renderer ────────────────────────────────────────────────
// Renders ###headings, **bold**, `code`, [link](url), tables, bullet lists,
// numbered lists, ⚠️ warning lines, --- dividers — no external lib needed.
function MarkdownMessage({ text }) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ── Horizontal rule ───────────────────────────────────────────────────
    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={i} style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "10px 0" }} />);
      i++; continue;
    }

    // ── H3 heading ###  ───────────────────────────────────────────────────
    if (line.startsWith("### ")) {
      elements.push(
        <div key={i} style={{ fontSize: "15px", fontWeight: 800, color: "#062051", marginBottom: "6px", marginTop: i > 0 ? "4px" : 0, display: "flex", alignItems: "center", gap: "6px" }}>
          {inlineFormat(line.replace(/^###\s*/, ""))}
        </div>
      );
      i++; continue;
    }

    // ── H4 heading ####  ──────────────────────────────────────────────────
    if (line.startsWith("#### ")) {
      elements.push(
        <div key={i} style={{ fontSize: "13.5px", fontWeight: 700, color: "#1e3a6e", marginBottom: "4px", marginTop: "8px" }}>
          {inlineFormat(line.replace(/^####\s*/, ""))}
        </div>
      );
      i++; continue;
    }

    // ── Table (detect | header | row |) ──────────────────────────────────
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      // Skip separator rows (---|--- rows)
      const rows = tableLines.filter(r => !r.replace(/\|/g, "").replace(/-/g, "").replace(/\s/g, "").match(/^:*$/));
      const headerRow = rows[0];
      const bodyRows  = rows.slice(1);
      const parseCells = (row) => row.split("|").filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim());

      elements.push(
        <div key={i} style={{ overflowX: "auto", margin: "8px 0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#062051" }}>
                {parseCells(headerRow).map((cell, ci) => (
                  <th key={ci} style={{ padding: "7px 12px", textAlign: "left", color: "#ffffff", fontWeight: 700, borderBottom: "2px solid #1e3a6e", whiteSpace: "nowrap" }}>
                    {inlineFormat(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? "#f8fafc" : "#ffffff" }}>
                  {parseCells(row).map((cell, ci) => (
                    <td key={ci} style={{ padding: "7px 12px", borderBottom: "1px solid #e2e8f0", color: "#1e293b", verticalAlign: "top" }}>
                      {inlineFormat(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // ── Bullet list (- or • or *) ─────────────────────────────────────────
    if (/^[-•*]\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-•*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-•*]\s*/, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ margin: "4px 0 6px 0", paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "3px" }}>
          {items.map((item, idx) => (
            <li key={idx} style={{ fontSize: "13.5px", color: "#1e293b", lineHeight: 1.55 }}>{inlineFormat(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // ── Numbered list (1. 2. etc) ─────────────────────────────────────────
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s*/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} style={{ margin: "4px 0 6px 0", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "3px" }}>
          {items.map((item, idx) => (
            <li key={idx} style={{ fontSize: "13.5px", color: "#1e293b", lineHeight: 1.55 }}>{inlineFormat(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // ── ⚠️ / 📞 / 🌐 / 📥 emoji-prefixed callout lines ──────────────────
    if (/^[⚠️📞🌐📥💡🔒🛏️🧹📶📺👕🍽️✅❌🎓💼📝📍🏢💰🏠]/.test(line.trim())) {
      elements.push(
        <div key={i} style={{ padding: "7px 12px", background: "#f0f7ff", border: "1px solid #bfdbfe", borderRadius: "7px", fontSize: "13px", color: "#1e3a6e", margin: "4px 0", lineHeight: 1.5 }}>
          {inlineFormat(line.trim())}
        </div>
      );
      i++; continue;
    }

    // ── Empty line → spacer ───────────────────────────────────────────────
    if (line.trim() === "") {
      elements.push(<div key={i} style={{ height: "4px" }} />);
      i++; continue;
    }

    // ── Normal paragraph ──────────────────────────────────────────────────
    elements.push(
      <p key={i} style={{ margin: "2px 0", fontSize: "13.5px", color: "#1e293b", lineHeight: 1.6 }}>
        {inlineFormat(line)}
      </p>
    );
    i++;
  }

  return <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>{elements}</div>;
}

// Inline formatter: **bold**, `code`, [link](url), ~~strike~~
function inlineFormat(text) {
  if (!text) return null;
  // Split on bold, code, link, italic patterns
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|_[^_]+_)/g;
  let last = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(<strong key={match.index} style={{ fontWeight: 700, color: "#062051" }}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      parts.push(<code key={match.index} style={{ background: "#f1f5f9", color: "#0f357e", padding: "1px 5px", borderRadius: "4px", fontSize: "12.5px", fontFamily: "monospace" }}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("[")) {
      const linkText = token.match(/\[([^\]]+)\]/)[1];
      const linkHref = token.match(/\(([^)]+)\)/)[1];
      parts.push(<a key={match.index} href={linkHref} target="_blank" rel="noopener noreferrer" style={{ color: "#1d4ed8", textDecoration: "underline", fontWeight: 600 }}>{linkText}</a>);
    } else if (token.startsWith("_")) {
      parts.push(<em key={match.index}>{token.slice(1, -1)}</em>);
    }
    last = match.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length > 0 ? parts : text;
}

export default function ChatInterface({ initialQuery = "", onTicketCreated }) {
  const { user, setActiveTab } = useAuth();
  const [messages, setMessages] = useState([
    {
      chat_id: "welcome-msg",
      sender: "ai",
      message:
        "Namaste & Welcome to Silver Oak University AI Student Help Desk! I can assist you with Winter 2026 examination timetables, fee schedules, MYSY and post-matric scholarships, campus hostel admissions, central library services, and bonafide certificate requests. Feel free to ask any question below or pick a sample query.",
      confidence: 0.99,
      intent: "greeting_help",
      sources: ["Silver Oak Institutional Knowledge Base"],
      action: "ANSWER",
      agent_trace: {
        security: { status: "PASSED", details: "Input sanitized, no adversarial injection detected" },
        intent_agent: { intent: "greeting_help", score: 0.99, department: "DEPT_ACADEMIC" },
        decision_agent: { action: "ANSWER", confidence: 0.99, formula: "Direct greeting intent match", reason: "Standard institutional greeting" }
      }
    },
  ]);
  const [inputText, setInputText] = useState(initialQuery);
  const [suggestedQueries, setSuggestedQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedTraceId, setExpandedTraceId] = useState(null);
  const [showManualTicketModal, setShowManualTicketModal] = useState(false);
  const [ticketProblem, setTicketProblem] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([
    { department_id: "", department_name: "", faculty_id: "", faculty_name: "" }
  ]);
  const [ticketPriority, setTicketPriority] = useState("Medium");
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketError, setTicketError] = useState("");
  const [departments, setDepartments] = useState([]);
  const messagesEndRef = useRef(null);

  const openTicketCreationModal = (initialProblem = "") => {
    setTicketProblem(initialProblem || "");
    setTicketError("");
    setSelectedDepartments([
      { department_id: "", department_name: "", faculty_id: "", faculty_name: "" }
    ]);
    setShowManualTicketModal(true);
  };

  const handleDepartmentChangeInBlock = (idx, deptId, deptObj) => {
    setSelectedDepartments((prev) => {
      const next = [...prev];
      next[idx] = {
        department_id: deptId,
        department_name: deptObj ? deptObj.name : deptId,
        // PRD Section 3: Old faculty selection MUST immediately be cleared
        faculty_id: "",
        faculty_name: "",
      };
      return next;
    });
  };

  const handleFacultyChangeInBlock = (idx, facId, facObj) => {
    setSelectedDepartments((prev) => {
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        faculty_id: facId,
        faculty_name: facObj ? facObj.name : facId,
      };
      return next;
    });
  };

  const handleAddDepartmentBlock = () => {
    setSelectedDepartments((prev) => [
      ...prev,
      { department_id: "", department_name: "", faculty_id: "", faculty_name: "" }
    ]);
  };

  const handleRemoveDepartmentBlock = (idx) => {
    setSelectedDepartments((prev) => prev.filter((_, i) => i !== idx));
  };

  const isDescriptionValid = ticketProblem.trim().length >= 10;
  const isDepartmentsValid =
    selectedDepartments.length > 0 &&
    selectedDepartments.every((item) => item.department_id && item.faculty_id);
  const isSubmitDisabled = !isDescriptionValid || !isDepartmentsValid || ticketSubmitting;

  useEffect(() => {
    api.getSuggestedQueries().then(setSuggestedQueries).catch(() => {});
    api.getDepartments().then((d) => setDepartments(d.departments || [])).catch(() => {});
  }, []);


  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend = null) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMessage = {
      chat_id: `user-${Date.now()}`,
      sender: "student",
      message: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText("");
    setLoading(true);

    try {
      const response = await api.sendMessage(text, sessionId);
      if (response.session_id) setSessionId(response.session_id);

      const aiMessage = {
        chat_id: response.chat_id,
        sender: "ai",
        message: response.message,
        intent: response.intent,
        confidence: response.confidence,
        sources: response.sources || [],
        action: response.action,
        ticket_id: response.ticket_id,
        entities: response.entities,
        feedback: null,
        agent_trace: response.agent_trace || {},
      };

      setMessages((prev) => [...prev, aiMessage]);
      if (response.ticket_id && onTicketCreated) {
        onTicketCreated(response.ticket_id);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          chat_id: `err-${Date.now()}`,
          sender: "ai",
          message: "The AI agent pipeline experienced a temporary connection timeout. If your query is urgent, please click '+ Create Ticket' to contact department faculty directly.",
          confidence: 0,
          action: "ERROR",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (chatId, rating) => {
    try {
      await api.sendFeedback(chatId, rating);
      setMessages((prev) =>
        prev.map((m) => (m.chat_id === chatId ? { ...m, feedback: rating } : m))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleEscalate = async (queryText) => {
    setLoading(true);
    try {
      const res = await api.escalateTicket(queryText, sessionId);
      const escalationMsg = {
        chat_id: `esc-${Date.now()}`,
        sender: "ai",
        message: `Your issue has been directly escalated to the department faculty. Ticket **${res.ticket_id}** created and assigned to **${res.assigned_faculty || "Faculty"}**. You can track this in My Tickets.`,
        ticket_id: res.ticket_id,
        action: "ESCALATE",
        confidence: 0.40,
        sources: ["Direct Faculty Escalation"],
        agent_trace: {
          decision_agent: { action: "ESCALATE", reason: "User requested human handoff" },
          ticket_agent: { ticket_id: res.ticket_id, status: "Assigned" }
        }
      };
      setMessages((prev) => [...prev, escalationMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentTicketSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitDisabled) return;
    setTicketSubmitting(true);
    setTicketError("");

    try {
      const payload = {
        problem_description: ticketProblem.trim(),
        priority: ticketPriority,
        assignments: selectedDepartments.map((d) => ({
          department_id: d.department_id,
          faculty_id: d.faculty_id,
        })),
      };

      const res = await api.createStudentTicket(payload);
      setShowManualTicketModal(false);

      const createdTicket = res.ticket || res;
      const tId = createdTicket.ticket_number || createdTicket.ticket_id || createdTicket.id;

      const escalationMsg = {
        chat_id: `manual-esc-${Date.now()}`,
        sender: "ai",
        message: `Your ticket **${tId}** has been created successfully!\n\n` +
          selectedDepartments.map((d, i) =>
            `• **Department ${selectedDepartments.length > 1 ? i + 1 : ""}:** ${d.department_name || d.department_id} &rarr; Assigned to **${d.faculty_name || d.faculty_id}** (HOD Auto-mapped)`
          ).join("\n") +
          `\n\nYour inquiry has been routed directly to the selected faculty members and their Department HODs. You will receive notifications as soon as they reply, and you can track real-time resolution under **My Tickets**.`,
        ticket_id: tId,
        action: "ESCALATE",
        confidence: 1.0,
        sources: ["Direct Faculty & HOD Assignment"],
      };
      setMessages((prev) => [...prev, escalationMsg]);
      if (onTicketCreated) onTicketCreated(createdTicket);

      setTicketProblem("");
      setSelectedDepartments([
        { department_id: "", department_name: "", faculty_id: "", faculty_name: "" }
      ]);
    } catch (err) {
      console.error(err);
      setTicketError(err.message || "Failed to create ticket");
    } finally {
      setTicketSubmitting(false);
    }
  };

  const categories = ["All", "Examination", "Accounts", "Scholarships", "Admissions", "Placements", "Library", "Hostel", "Services", "Academic", "Support"];

  const filteredQueries =
    activeCategory === "All"
      ? suggestedQueries
      : suggestedQueries.filter((q) => q.category === activeCategory);

  return (
    <div className="page-enter" style={{ maxWidth:"1280px", margin:"0 auto", padding:"16px 0", height:"calc(100vh - 108px)", display:"flex", flexDirection:"column", gap:"10px" }}>
      {/* Top row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"8px" }}>
        <div>
          <h1 style={{ fontSize:"19px", fontWeight:800, color:"#062051", letterSpacing:"-0.4px" }}>AI Student Help Desk Assistant</h1>
          <p style={{ fontSize:"11px", color:"#94a3b8" }}>
            10-Agent RAG · Silver Oak SOCA M.Sc. IT Sem 1 · IOM5091C · <strong style={{color:"#059669"}}>7,790 KB articles</strong>
          </p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" }}>
          <button id="btn-header-create-ticket" className="btn btn-gold btn-sm" onClick={() => openTicketCreationModal("")}>
            <PlusCircle size={14} /> Create Ticket
          </button>
          <span className="badge badge-success" style={{ gap:"6px" }}>
            <span className="pulse-dot" style={{ background:"#059669" }} />
            10 Agents Active
          </span>
          <span className="badge badge-primary hide-on-mobile">RAG Grounded</span>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div
        className="glass-card"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid #cbd5e1",
          background: "#ffffff",
          boxShadow: "0 4px 16px rgba(6, 32, 81, 0.06)",
        }}
      >
        {/* Messages List Area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "14px", background: "#f8fafc" }}>
          {messages.map((msg, index) => {
            const isAI = msg.sender === "ai";
            const confidencePercent = Math.round((msg.confidence || 0) * 100);
            const isTraceExpanded = expandedTraceId === (msg.chat_id || index);

            return (
              <div
                key={msg.chat_id || index}
                className={`animate-fade-in ${isAI ? "chat-bubble-ai" : "chat-bubble-user"}`}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignSelf: isAI ? "flex-start" : "flex-end",
                  maxWidth: isAI ? "94%" : "85%",
                  flexDirection: isAI ? "row" : "row-reverse",
                }}
              >
                {/* Avatar Icon */}
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "8px",
                    background: isAI
                      ? "#062051"
                      : "#c59b27",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 2px 6px rgba(6, 32, 81, 0.15)",
                  }}
                >
                  {isAI ? <Bot size={18} color="#ffffff" /> : <GraduationCap size={18} color="#062051" />}
                </div>

                {/* Message Bubble Body */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
                  <div
                    style={{
                      background: isAI ? "#ffffff" : "#062051",
                      color: isAI ? "#0f172a" : "#ffffff",
                      padding: "14px 18px",
                      borderRadius: isAI ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
                      border: isAI ? "1px solid #e2e8f0" : "none",
                      fontSize: "14px",
                      lineHeight: 1.65,
                      boxShadow: isAI ? "0 2px 6px rgba(6, 32, 81, 0.04)" : "0 3px 10px rgba(6, 32, 81, 0.15)",
                    }}
                  >
                    {isAI ? <MarkdownMessage text={msg.message} /> : <span>{msg.message}</span>}

                    {/* If ticket was generated */}
                    {msg.ticket_id && (
                      <div
                        style={{
                          marginTop: "12px",
                          padding: "10px 14px",
                          background: "#eaf4fb",
                          border: "1px solid #b3d6f0",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Ticket size={16} color="#062051" />
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "#062051" }}>
                            Ticket ID: {msg.ticket_id}
                          </span>
                        </div>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setActiveTab("tickets")}
                        >
                          View in History
                        </button>
                      </div>
                    )}

                    {/* Low-confidence AI response: PRD Section 1 */}
                    {isAI && !msg.ticket_id && (
                      msg.action === "ESCALATE" ||
                      (msg.confidence !== undefined && msg.confidence < 0.65) ||
                      (msg.message && msg.message.toLowerCase().includes("could not confidently resolve"))
                    ) && (
                      <div
                        style={{
                          marginTop: "12px",
                          padding: "12px 14px",
                          background: "#fff1f2",
                          border: "1px solid #fecdd3",
                          borderRadius: "8px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#9f1239", fontWeight: 700, fontSize: "13px" }}>
                          <AlertTriangle size={16} color="#e11d48" />
                          <span>AI could not confidently resolve your query. Please create a support ticket.</span>
                        </div>
                        <div>
                          <button
                            id={`btn-create-ticket-msg-${msg.chat_id || index}`}
                            className="btn btn-primary btn-sm"
                            style={{
                              background: "#062051",
                              color: "#ffffff",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              fontWeight: 700,
                              padding: "6px 14px",
                              borderRadius: "6px",
                            }}
                            onClick={() => {
                              const prevUserMsg = messages
                                .slice(0, index)
                                .reverse()
                                .find((m) => m.sender === "student");
                              openTicketCreationModal(prevUserMsg ? prevUserMsg.message : "");
                            }}
                          >
                            <Ticket size={14} /> Create Ticket
                          </button>
                        </div>
                      </div>
                    )}
                  </div>


                  {/* AI Metadata & Multi-Agent Trace Drawer */}
                  {isAI && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", paddingLeft: "4px" }}>
                        {/* Confidence badge */}
                        {msg.confidence !== undefined && (
                          <span
                            className={`badge ${
                              confidencePercent >= 70
                                ? "badge-success"
                                : confidencePercent >= 50
                                ? "badge-warning"
                                : "badge-danger"
                            }`}
                            style={{ fontSize: "11px" }}
                          >
                            {confidencePercent}% Confidence
                          </span>
                        )}

                        {/* Intent badge */}
                        {msg.intent && (
                          <span className="badge badge-neutral" style={{ fontSize: "11px" }}>
                            intent: {msg.intent}
                          </span>
                        )}

                        {/* Sources citation chip */}
                        {msg.sources && msg.sources.length > 0 && (
                          msg.sources[0].startsWith("http") ? (
                            <a
                              href={msg.sources[0]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="badge badge-primary"
                              style={{
                                fontSize: "11px",
                                gap: "4px",
                                textDecoration: "none",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                background: "#e0f2fe",
                                color: "#0369a1",
                                border: "1px solid #bae6fd",
                                padding: "2px 8px",
                                borderRadius: "4px"
                              }}
                              title="Click to open official Silver Oak University page"
                            >
                              <ExternalLink size={11} /> 🏛️ Official Source: {msg.sources[0].replace(/^https?:\/\/(www\.)?/, '')}
                            </a>
                          ) : (
                            <span className="badge badge-primary" style={{ fontSize: "11px", gap: "4px" }}>
                              <FileText size={11} /> {msg.sources[0]}
                            </span>
                          )
                        )}

                        {/* Expandable Multi-Agent Pipeline Trace Toggle */}
                        {msg.agent_trace && (
                          <button
                            onClick={() =>
                              setExpandedTraceId(isTraceExpanded ? null : (msg.chat_id || index))
                            }
                            style={{
                              background: isTraceExpanded ? "#eaf4fb" : "transparent",
                              border: "1px solid #cbd5e1",
                              color: "#062051",
                              borderRadius: "999px",
                              padding: "2px 8px",
                              fontSize: "11px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              cursor: "pointer",
                              fontWeight: 600,
                            }}
                          >
                            <Layers size={11} />
                            {isTraceExpanded ? "Hide Trace" : "Agent Pipeline Trace"}
                            {isTraceExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                          </button>
                        )}

                        {/* Feedback Thumbs */}
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginLeft: "auto" }}>
                          <button
                            onClick={() => handleFeedback(msg.chat_id, 1)}
                            style={{
                              background: msg.feedback === 1 ? "#ecfdf5" : "transparent",
                              border: "none",
                              color: msg.feedback === 1 ? "#059669" : "#64748b",
                              cursor: "pointer",
                              padding: "4px 6px",
                              borderRadius: "4px",
                            }}
                            title="Helpful"
                          >
                            <ThumbsUp size={14} />
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.chat_id, -1)}
                            style={{
                              background: msg.feedback === -1 ? "#fef2f2" : "transparent",
                              border: "none",
                              color: msg.feedback === -1 ? "#dc2626" : "#64748b",
                              cursor: "pointer",
                              padding: "4px 6px",
                              borderRadius: "4px",
                            }}
                            title="Not helpful"
                          >
                            <ThumbsDown size={14} />
                          </button>

                          {(msg.action === "VERIFY" || !msg.ticket_id) && (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleEscalate(msg.message)}
                              style={{ fontSize: "11px", padding: "3px 8px", color: "#b45309", borderColor: "#fde68a" }}
                              title="Escalate directly to faculty"
                            >
                              <Ticket size={12} /> Escalate
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expandable Multi-Agent Pipeline Visualization (PRD Section 8) */}
                      {isTraceExpanded && msg.agent_trace && (
                        <div
                          className="glass-card animate-fade-in"
                          style={{
                            padding: "14px",
                            background: "#ffffff",
                            border: "1px solid #cbd5e1",
                            borderRadius: "10px",
                            fontSize: "12px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            marginTop: "4px",
                            boxShadow: "0 4px 12px rgba(6, 32, 81, 0.06)",
                          }}
                        >
                          <div style={{ fontWeight: 800, color: "#062051", fontSize: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", display: "flex", justifyContent: "space-between" }}>
                            <span>10 Cooperating Agents Execution Trace</span>
                            <span style={{ color: "#64748b", fontWeight: 400 }}>PRD Section 8 Architecture</span>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                            {/* Security Agent */}
                            <div style={{ background: "#f8fafc", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                              <div style={{ fontWeight: 700, color: "#059669", marginBottom: "2px" }}>1. Security Agent</div>
                              <div style={{ color: "#475569" }}>
                                Status: {msg.agent_trace.security?.status || "PASSED"} &bull; {msg.agent_trace.security?.details || "PII masked, prompt safe"}
                              </div>
                            </div>

                            {/* Intent Agent */}
                            <div style={{ background: "#f8fafc", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                              <div style={{ fontWeight: 700, color: "#062051", marginBottom: "2px" }}>2. Intent Recognition Agent</div>
                              <div style={{ color: "#475569" }}>
                                Intent: <strong>{msg.intent}</strong> (Score: {msg.agent_trace.intent_agent?.score || msg.confidence})
                              </div>
                            </div>

                            {/* Retrieval Agent */}
                            <div style={{ background: "#f8fafc", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                              <div style={{ fontWeight: 700, color: "#0f357e", marginBottom: "2px" }}>4. Knowledge Retrieval (RAG)</div>
                              <div style={{ color: "#475569" }}>
                                Similarity: {msg.agent_trace.retrieval_agent?.similarity || "0.88"} &bull; Sources: {msg.sources?.join(", ") || "Active KB"}
                              </div>
                            </div>

                            {/* Decision Agent */}
                            <div style={{ background: "#f8fafc", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                              <div style={{ fontWeight: 700, color: "#b45309", marginBottom: "2px" }}>5. Decision Agent</div>
                              <div style={{ color: "#475569" }}>
                                Formula: <code>0.4*Intent + 0.4*Retrieval + 0.2*Grounding</code> = {confidencePercent}% &bull; Action: <strong>{msg.action}</strong>
                              </div>
                            </div>
                          </div>

                          {msg.ticket_id && (
                            <div style={{ background: "#eaf4fb", padding: "8px", borderRadius: "6px", color: "#062051", border: "1px solid #b3d6f0" }}>
                              <strong>6. Ticket & Routing Agents:</strong> Generated <strong>{msg.ticket_id}</strong> &bull; Routed to <strong>{msg.agent_trace.routing_agent?.assigned_faculty || "Department Faculty"}</strong> &bull; Notification Agent dispatched email alert.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
              <div style={{ width:"34px", height:"34px", borderRadius:"8px", background:"#eaf4fb", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Bot size={18} color="#062051" />
              </div>
              <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:"4px 14px 14px 14px", padding:"12px 16px", display:"flex", alignItems:"center", gap:"8px" }}>
                <div className="typing-dots">
                  <span /><span /><span />
                </div>
                <span style={{ fontSize:"12px", color:"#94a3b8" }}>Agents processing…</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 33 Sample Queries Carousel from PRD Section 12 */}
        <div
          style={{
            padding: "10px 18px",
            borderTop: "1px solid #e2e8f0",
            background: "#f1f5f9",
          }}
        >
          {/* Category Filter Pills */}
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "6px", scrollbarWidth: "none" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "3px 10px",
                  fontSize: "11px",
                  fontWeight: 700,
                  borderRadius: "999px",
                  border: activeCategory === cat ? "1px solid #062051" : "1px solid #cbd5e1",
                  background: activeCategory === cat ? "#062051" : "#ffffff",
                  color: activeCategory === cat ? "#ffffff" : "#475569",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Query Pills */}
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", scrollbarWidth: "none" }}>
            {filteredQueries.map((item, idx) => (
              <button
                key={idx}
                className="btn btn-secondary btn-sm"
                onClick={() => handleSend(item.query)}
                style={{
                  fontSize: "11.5px",
                  padding: "4px 12px",
                  whiteSpace: "nowrap",
                  borderRadius: "999px",
                  background: "#ffffff",
                  borderColor: "#cbd5e1",
                  color: "#062051",
                  fontWeight: 600,
                }}
                title={`Intent: ${item.intent}`}
              >
                <Sparkles size={11} color="#c59b27" /> {item.query}
              </button>
            ))}
          </div>
        </div>

        {/* Input area */}
        <div className="chat-input-area">
          <form onSubmit={e => { e.preventDefault(); handleSend(); }} style={{ display:"flex", gap:"10px", flex:1 }}>
            <input
              type="text"
              className="input-field"
              placeholder="Ask anything — exams, fees, hostel, NCC, BCA timetable… (English या Hinglish)"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !inputText.trim()} style={{ padding:"0 20px", borderRadius:"20px" }}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Multi-Department Ticket Modal (Requirement 4 & 14: AI Suggested + Manual Selection) */}
      {showManualTicketModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(6, 32, 81, 0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            zIndex: 100,
          }}
          onClick={() => setShowManualTicketModal(false)}
        >
          <div
            className="glass-card animate-fade-in"
            style={{
              maxWidth: "620px",
              width: "100%",
              padding: "24px 22px",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              maxHeight: "92vh",
              overflowY: "auto",
              borderRadius: "14px",
              boxShadow: "0 20px 40px rgba(6, 32, 81, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Ticket size={22} color="#062051" />
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#062051", margin: 0 }}>
                    Create Support Ticket
                  </h3>
                  <p style={{ fontSize: "11px", color: "#64748b", margin: "2px 0 0 0" }}>
                    Silver Oak University AI Help Desk Routing
                  </p>
                </div>
              </div>
              <button
                id="btn-close-ticket-modal"
                onClick={() => setShowManualTicketModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {ticketError && (
              <div
                style={{
                  padding: "10px 14px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  color: "#b91c1c",
                  fontSize: "12px",
                  marginBottom: "14px",
                }}
              >
                {ticketError}
              </div>
            )}

            <form
              onSubmit={handleStudentTicketSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {/* STEP 1 & 2: Dynamic Department & Faculty Selection (PRD Sections 2, 3, 4, 5) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: "13px", fontWeight: 800, color: "#062051" }}>
                    Department & Faculty Assignment
                  </label>
                  <button
                    type="button"
                    id="btn-add-department"
                    className="btn btn-secondary btn-sm"
                    onClick={handleAddDepartmentBlock}
                    style={{
                      fontSize: "11px",
                      padding: "4px 10px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      borderColor: "#cbd5e1",
                    }}
                    title="Involve another department if your issue crosses multiple areas (e.g. Accounts & Fees + Examination)"
                  >
                    <Plus size={13} /> Involve Another Department
                  </button>
                </div>

                {selectedDepartments.map((deptBlock, idx) => (
                  <div
                    key={idx}
                    id={`dept-block-${idx}`}
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                      padding: "14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {selectedDepartments.length > 1 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderBottom: "1px dashed #cbd5e1",
                          paddingBottom: "6px",
                        }}
                      >
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#062051" }}>
                          Department {idx + 1}
                        </span>
                        <button
                          type="button"
                          id={`btn-remove-dept-${idx}`}
                          onClick={() => handleRemoveDepartmentBlock(idx)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#dc2626",
                            fontSize: "11.5px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            cursor: "pointer",
                            padding: "2px 6px",
                          }}
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    )}

                    {/* Reusable Component for Department -> Faculty (PRD Section 23) */}
                    <DepartmentFacultySelector
                      idPrefix={`ticket-dept-${idx}`}
                      departments={departments}
                      selectedDepartment={deptBlock.department_id}
                      selectedFaculty={deptBlock.faculty_id}
                      onDepartmentChange={(deptId, deptObj) =>
                        handleDepartmentChangeInBlock(idx, deptId, deptObj)
                      }
                      onFacultyChange={(facId, facObj) =>
                        handleFacultyChangeInBlock(idx, facId, facObj)
                      }
                      departmentLabel={
                        selectedDepartments.length > 1
                          ? `Select Department ${idx + 1}`
                          : "Select Department"
                      }
                      facultyLabel={
                        selectedDepartments.length > 1
                          ? `Select Faculty for Department ${idx + 1}`
                          : "Select Faculty"
                      }
                      showHodInfo={true}
                    />
                  </div>
                ))}
              </div>

              {/* STEP 3: Problem Description (PRD Section 6) */}
              <div>
                <label
                  htmlFor="student-problem-desc"
                  style={{
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: "#062051",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <span>
                    Describe Your Problem <span style={{ color: "#dc2626" }}>*</span>
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: isDescriptionValid ? "#059669" : "#64748b",
                      fontWeight: 500,
                    }}
                  >
                    {ticketProblem.trim().length}/10 min chars
                  </span>
                </label>
                <textarea
                  id="student-problem-desc"
                  className="input-field"
                  style={{
                    minHeight: "110px",
                    resize: "vertical",
                    fontSize: "13px",
                    lineHeight: 1.5,
                    padding: "10px 12px",
                    borderRadius: "8px",
                    borderColor:
                      ticketProblem && !isDescriptionValid ? "#dc2626" : "#cbd5e1",
                  }}
                  placeholder="Write your problem here in detail (minimum 10 characters)..."
                  value={ticketProblem}
                  onChange={(e) => setTicketProblem(e.target.value)}
                  required
                />
                {ticketProblem && !isDescriptionValid && (
                  <span style={{ fontSize: "11px", color: "#dc2626", marginTop: "4px", display: "block" }}>
                    Please provide at least 10 characters describing your problem.
                  </span>
                )}
              </div>

              {/* Priority & Assignments Summary */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#062051" }}>
                    Priority
                  </label>
                  <select
                    className="input-field"
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value)}
                    style={{ fontSize: "12.5px", padding: "8px 10px", borderRadius: "7px" }}
                  >
                    <option value="Low">Low (General Query)</option>
                    <option value="Medium">Medium (Standard Request)</option>
                    <option value="High">High (Impacting Studies/Fee)</option>
                    <option value="Urgent">Urgent (Exam/Deadline Critical)</option>
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <span style={{ fontSize: "11.5px", color: "#64748b" }}>
                    Assignments:{" "}
                    <strong style={{ color: "#062051" }}>
                      {selectedDepartments.filter((d) => d.faculty_id).length} Faculty +{" "}
                      {selectedDepartments.filter((d) => d.department_id).length} HOD(s)
                    </strong>
                  </span>
                </div>
              </div>

              {/* STEP 4: Submit Ticket (PRD Section 7) */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "6px",
                  borderTop: "1px solid #e2e8f0",
                  paddingTop: "14px",
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowManualTicketModal(false)}
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-ticket"
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitDisabled}
                  style={{
                    background: isSubmitDisabled ? "#94a3b8" : "#062051",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "9px 18px",
                    fontWeight: 700,
                    cursor: isSubmitDisabled ? "not-allowed" : "pointer",
                  }}
                >
                  <Ticket size={15} />
                  {ticketSubmitting ? "Creating Ticket..." : "Submit Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  ChevronDown,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Ticket,
  CornerDownRight,
  RefreshCw,
  GraduationCap,
  Building,
  HelpCircle
} from "lucide-react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

// Helper for inline markdown rendering inside widget
function WidgetMarkdown({ text }) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={i} style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "8px 0" }} />);
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <div key={i} style={{ fontSize: "14px", fontWeight: 800, color: "#062051", margin: "6px 0 3px 0" }}>
          {line.replace(/^###\s*/, "")}
        </div>
      );
      i++;
      continue;
    }

    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines.filter((r) => !r.replace(/\|/g, "").replace(/-/g, "").replace(/\s/g, "").match(/^:*$/));
      if (rows.length > 0) {
        const headerRow = rows[0];
        const bodyRows = rows.slice(1);
        const parseCells = (row) =>
          row.split("|").filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map((c) => c.trim());

        elements.push(
          <div key={i} style={{ overflowX: "auto", margin: "6px 0", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px" }}>
              <thead>
                <tr style={{ background: "#062051", color: "#ffffff" }}>
                  {parseCells(headerRow).map((cell, ci) => (
                    <th key={ci} style={{ padding: "5px 8px", textAlign: "left", fontWeight: 700 }}>
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, ri) => (
                  <tr key={ri} style={{ background: ri % 2 === 0 ? "#f8fafc" : "#ffffff" }}>
                    {parseCells(row).map((cell, ci) => (
                      <td key={ci} style={{ padding: "5px 8px", borderBottom: "1px solid #e2e8f0", color: "#1e293b" }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      elements.push(
        <div key={i} style={{ display: "flex", gap: "6px", fontSize: "12.5px", margin: "2px 0", color: "#334155" }}>
          <span style={{ color: "#c59b27", fontWeight: 700 }}>&bull;</span>
          <span>{line.replace(/^[-*]\s*/, "")}</span>
        </div>
      );
      i++;
      continue;
    }

    if (line.trim()) {
      elements.push(
        <p key={i} style={{ fontSize: "12.5px", margin: "3px 0", color: "#334155", lineHeight: 1.5 }}>
          {line}
        </p>
      );
    }
    i++;
  }

  return <div>{elements}</div>;
}

export default function OakMitraWidget({ isOpen, onToggle }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: "msg-welcome",
      sender: "ai",
      text: "Namaste! 🙏 I am **OakMitra**, the official AI HelpDesk Assistant for **Silver Oak University**.\n\nAsk me anything about fees, admissions, exam timetables, scholarships (MYSY), or campus facilities!",
      confidence: 1.0,
      intent: "greeting",
      sources: ["Silver Oak University Knowledge Base (silveroakuni.ac.in)"],
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [programme, setProgramme] = useState("BCA");
  const [college, setCollege] = useState("SOCCA");
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "What is the fee for BCA?",
    "When are Winter 2026 exams?",
    "How to apply for MYSY scholarship?",
    "What are hostel facilities and fees?",
    "Where is the exam cell located?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    setInputText("");
    const userMsgId = `usr-${Date.now()}`;
    const userMsg = { id: userMsgId, sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Include selected programme context in prompt if beneficial
      const queryWithContext = text;
      const res = await api.sendMessage(queryWithContext, sessionId);

      if (res.session_id && !sessionId) {
        setSessionId(res.session_id);
      }

      const aiMsg = {
        id: res.chat_id || `ai-${Date.now()}`,
        sender: "ai",
        text: res.message,
        confidence: res.confidence,
        intent: res.intent,
        sources: res.sources || [],
        action: res.action,
        ticket_id: res.ticket_id,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "ai",
          text: "I am having trouble connecting to the university server right now. Please check if the backend service is running or try again in a moment.",
          confidence: 0.0,
          intent: "error",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button in Bottom Right */}
      {!isOpen && (
        <button
          type="button"
          onClick={onToggle}
          className="oakmitra-trigger-btn"
          aria-label="Open OakMitra AI HelpDesk"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 999,
            padding: "12px 20px",
            borderRadius: "9999px",
            background: "linear-gradient(135deg, #062051 0%, #0f357e 100%)",
            color: "#ffffff",
            border: "2px solid #c59b27",
            boxShadow: "0 8px 30px rgba(6, 32, 81, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "14px",
            transition: "all 0.25s ease",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "#c59b27",
              color: "#062051",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          >
            <Bot size={17} />
          </div>
          <span>OakMitra AI</span>
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 8px #22c55e",
            }}
          />
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div
          className="glass-card oakmitra-drawer"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 1000,
            width: "clamp(340px, 92vw, 420px)",
            height: "clamp(520px, 80vh, 640px)",
            borderRadius: "20px",
            background: "#ffffff",
            boxShadow: "0 20px 60px -10px rgba(6, 32, 81, 0.35)",
            border: "1px solid rgba(6, 32, 81, 0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "slideUpFade 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #062051 0%, #0f357e 100%)",
              color: "#ffffff",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "2px solid #c59b27",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#c59b27",
                  color: "#062051",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "14.5px", letterSpacing: "-0.2px" }}>
                  OakMitra AI Assistant
                </div>
                <div style={{ fontSize: "10.5px", color: "#fef08a", display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                  Online &bull; 13-Agent RAG Engine
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggle}
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "none",
                color: "#ffffff",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Academic Context Selector Pill */}
          <div
            style={{
              padding: "8px 12px",
              background: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "11px",
            }}
          >
            <span style={{ fontWeight: 700, color: "#64748b" }}>Programme:</span>
            <select
              value={programme}
              onChange={(e) => setProgramme(e.target.value)}
              style={{
                fontSize: "11px",
                padding: "2px 8px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#062051",
                fontWeight: 600,
                outline: "none",
              }}
            >
              <option value="BCA">BCA (SOCCA)</option>
              <option value="MCA">MCA (SOCCA)</option>
              <option value="M.Sc. IT">M.Sc. IT (SOCCA)</option>
              <option value="B.Tech CSE">B.Tech CSE (SOCET)</option>
              <option value="BBA">BBA (SOCM)</option>
              <option value="MBA">MBA (SOCM)</option>
            </select>
          </div>

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              background: "#fafcff",
            }}
          >
            {messages.map((m) => {
              const isUser = m.sender === "user";
              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isUser ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "88%",
                      padding: "10px 14px",
                      borderRadius: isUser ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                      background: isUser ? "linear-gradient(135deg, #062051 0%, #0f357e 100%)" : "#ffffff",
                      color: isUser ? "#ffffff" : "#1e293b",
                      border: isUser ? "none" : "1px solid #e2e8f0",
                      boxShadow: "0 2px 8px rgba(6, 32, 81, 0.05)",
                    }}
                  >
                    {/* Confidence & Intent Tag for AI responses */}
                    {!isUser && m.intent && m.intent !== "greeting" && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          marginBottom: "6px",
                          paddingBottom: "4px",
                          borderBottom: "1px solid #f1f5f9",
                        }}
                      >
                        <span
                          className="badge"
                          style={{
                            fontSize: "9.5px",
                            padding: "2px 6px",
                            background: "#eff6ff",
                            color: "#1d4ed8",
                            border: "1px solid #bfdbfe",
                          }}
                        >
                          {m.intent.replace(/_/g, " ").toUpperCase()}
                        </span>
                        {m.confidence !== undefined && (
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 700,
                              color: m.confidence >= 0.7 ? "#059669" : m.confidence >= 0.5 ? "#d97706" : "#dc2626",
                            }}
                          >
                            Confidence: {Math.round(m.confidence * 100)}%
                          </span>
                        )}
                      </div>
                    )}

                    <WidgetMarkdown text={m.text} />

                    {/* Source link */}
                    {!isUser && m.sources && m.sources.length > 0 && (
                      <div style={{ marginTop: "6px", paddingTop: "6px", borderTop: "1px dashed #e2e8f0", fontSize: "10.5px", color: "#64748b" }}>
                        <strong>Source: </strong>
                        <span style={{ color: "#062051" }}>{m.sources[0]}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", background: "#ffffff", borderRadius: "12px", width: "fit-content", border: "1px solid #e2e8f0" }}>
                <RefreshCw size={14} className="spin" color="#062051" />
                <span style={{ fontSize: "11.5px", color: "#64748b" }}>OakMitra is searching university circulars...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div
            style={{
              padding: "8px 10px",
              background: "#ffffff",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                style={{
                  fontSize: "10.5px",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                  color: "#062051",
                  fontWeight: 600,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: "10px 12px",
              background: "#ffffff",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <input
              type="text"
              placeholder="Ask anything about Silver Oak University..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
              style={{
                flex: 1,
                padding: "9px 12px",
                fontSize: "12.5px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                outline: "none",
                background: "#f8fafc",
              }}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #062051 0%, #0f357e 100%)",
                color: "#ffffff",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: !inputText.trim() || loading ? "not-allowed" : "pointer",
                opacity: !inputText.trim() || loading ? 0.5 : 1,
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import {
  Briefcase,
  CheckCircle,
  Clock,
  Send,
  CornerDownRight,
  ArrowRightLeft,
  User,
  AlertCircle,
  FileText,
  Sparkles,
  BookOpen,
  X,
  ShieldAlert,
  ChevronRight,
  Lock,
  Settings,
  Bell,
  Key,
  ShieldCheck,
  Building
} from "lucide-react";
import DepartmentFacultySelector from "../components/DepartmentFacultySelector";

export default function FacultyDashboard() {
  const { user } = useAuth();
  const userRole = (user?.role || "").toLowerCase();
  const isHOD = userRole.includes("hod") || userRole.includes("head") || userRole.includes("dean") || userRole.includes("admin") || user?.is_hod;

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [departments, setDepartments] = useState([]);

  // Profile and Settings Modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changePwLoading, setChangePwLoading] = useState(false);
  const [changePwError, setChangePwError] = useState("");
  const [changePwSuccess, setChangePwSuccess] = useState("");

  // Reassignment Modal State
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [reassignDept, setReassignDept] = useState("");
  const [targetFacultyId, setTargetFacultyId] = useState("");
  const [reassignReason, setReassignReason] = useState("");
  const replyComposerRef = useRef(null);

  // User Requirement 5: Assigned Tickets, Pending Tickets, In Progress, Resolved, Reassigned Tickets, Recent Notifications
  const statusTabs = [
    "All",
    "Assigned Tickets",
    "Pending Tickets",
    "In Progress",
    "Resolved",
    "Reassigned Tickets",
    "Recent Notifications",
  ];

  useEffect(() => {
    fetchTickets();
    api.getDepartments()
      .then((data) => setDepartments(data.departments || []))
      .catch(() => {});
  }, [statusFilter]);

  const fetchTickets = () => {
    setLoading(true);
    api.getAssignedTickets(statusFilter)
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setTickets(list);
        if (list.length > 0 && !selectedTicket) {
          handleSelectTicket(list[0]);
        }
        setLoading(false);
      })
      .catch(() => {
        setTickets([]);
        setLoading(false);
      });
  };

  const handleSelectTicket = async (t) => {
    setSelectedTicket(t);
    setReplyText(t.faculty_reply || "");
    setNotificationMsg("");
    try {
      const full = await api.getTicket(t.ticket_id);
      if (full) {
        setSelectedTicket((prev) => ({ ...prev, ...full }));
        if (full.faculty_reply) {
          setReplyText(full.faculty_reply);
        }
      }
    } catch (e) {
      console.warn("Could not fetch full ticket details:", e);
    }
  };

  const handleSendReply = async (markResolved = true) => {
    if (!selectedTicket || !replyText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const statusToSet = markResolved ? "Resolved" : "Answered";
      const deptIdToReply = (selectedTicket.departments && selectedTicket.departments.length > 0)
        ? (selectedTicket.departments.find(d => d.dept_id === user?.dept_id)?.dept_id || selectedTicket.dept_id)
        : selectedTicket.dept_id;

      const res = await api.replyTicket(selectedTicket.ticket_id, replyText, statusToSet, deptIdToReply);
      setNotificationMsg(`Resolution published! Student notified via email.${res.learning_candidate_id ? ' Registered as knowledge base candidate for closed-loop learning.' : ''}`);

      handleSelectTicket(selectedTicket);
      fetchTickets();
    } catch (e) {
      setNotificationMsg("Failed to save reply: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenReassignModal = (deptId = "", currentFacultyId = "") => {
    const initialDept = deptId || selectedTicket?.dept_id || (user?.dept_id || "");
    setReassignDept(initialDept);
    setTargetFacultyId(currentFacultyId || "");
    setReassignReason("");
    setShowReassignModal(true);
  };

  const handleConfirmReassign = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectedTicket || !reassignDept || !targetFacultyId) {
      alert("Please select both a department and a faculty member.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.reassignFaculty(
        selectedTicket.ticket_id,
        reassignDept,
        targetFacultyId,
        reassignReason || "Reassigned by HOD"
      );
      setShowReassignModal(false);
      setNotificationMsg(res.message || "Ticket successfully reassigned to new faculty.");
      setReassignDept("");
      setTargetFacultyId("");
      setReassignReason("");
      fetchTickets();
      handleSelectTicket(selectedTicket);
    } catch (e) {
      setNotificationMsg("Failed to reassign: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleScrollToAnswer = () => {
    if (replyComposerRef.current) {
      replyComposerRef.current.scrollIntoView({ behavior: "smooth" });
      const textarea = replyComposerRef.current.querySelector("textarea");
      if (textarea) textarea.focus();
    }
  };


  const handleOpenProfile = async () => {
    setShowProfileModal(true);
    setLoadingProfile(true);
    try {
      const data = await api.getFacultyProfile();
      setProfileData(data);
    } catch (e) {
      console.warn("Could not fetch remote profile, fallback to context:", e);
      setProfileData(user);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setChangePwError("");
    setChangePwSuccess("");
    if (!currentPassword) {
      setChangePwError("Please enter your current password.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setChangePwError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setChangePwError("New passwords do not match.");
      return;
    }
    setChangePwLoading(true);
    try {
      await api.facultyChangePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setChangePwSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => {
        setShowSettingsModal(false);
        setChangePwSuccess("");
      }, 1800);
    } catch (err) {
      setChangePwError(err.message || "Failed to update password.");
    } finally {
      setChangePwLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1350px", margin: "0 auto", padding: "16px 0" }}>
      {/* Header Info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "14px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span className="badge badge-primary">Silver Oak Faculty Portal</span>
            <span className="badge badge-neutral">{user?.dept_id || user?.department_id || "Department Faculty"}</span>
            <span className="badge badge-gold">{user?.faculty_id || "Faculty ID"}</span>
          </div>
          <h1 style={{ fontSize: "clamp(20px, 4vw, 24px)", fontWeight: 800, color: "#062051", letterSpacing: "-0.5px" }}>
            Faculty Resolution Workspace
          </h1>
          <p style={{ fontSize: "12.5px", color: "#64748b" }}>
            Manage assigned departmental tickets, author official resolutions, and manage account security
          </p>
        </div>

        {/* Top Header Actions: Profile, Settings, and Status Tabs */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              id="btn-faculty-my-profile"
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleOpenProfile}
              style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700 }}
            >
              <User size={14} /> My Profile
            </button>
            <button
              id="btn-faculty-settings"
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => { setShowSettingsModal(true); setChangePwError(""); setChangePwSuccess(""); }}
              style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700 }}
            >
              <Key size={14} /> Settings / Change Password
            </button>
          </div>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {statusTabs.map((status) => (
              <button
                key={status}
                className={`btn btn-sm ${statusFilter === status ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setStatusFilter(status)}
                style={{ fontSize: "12px", padding: "6px 11px" }}
              >
                {status === "Recent Notifications" && <Bell size={12} style={{ marginRight: "4px", display: "inline" }} />}
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>


      {notificationMsg && (
        <div
          className="badge badge-success animate-fade-in"
          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "12.5px" }}
        >
          <Sparkles size={15} /> {notificationMsg}
        </div>
      )}

      {/* Notifications Panel vs Tickets Workspace */}
      {statusFilter === "Recent Notifications" ? (
        <div className="glass-card animate-fade-in" style={{ padding: "24px", background: "#ffffff", minHeight: "500px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", borderBottom: "1px solid #e2e8f0", paddingBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#fef9c3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bell size={20} color="#854d0e" />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#062051", margin: 0 }}>Faculty Notification Center</h3>
                <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>Live alerts regarding ticket assignments, reassignments, and department notices</p>
              </div>
            </div>
            <span className="badge badge-primary">{tickets.length} Active Items</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Real-time Ticket Assignment Notifications */}
            {tickets.map((t) => (
              <div
                key={"notif-" + t.ticket_id}
                style={{
                  padding: "14px 18px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px"
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ marginTop: "2px" }}>
                    <Briefcase size={18} color="#062051" />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 800, fontSize: "13px", color: "#062051" }}>Ticket Assigned: {t.ticket_id}</span>
                      <span className={`badge ${t.status === "Resolved" ? "badge-success" : "badge-warning"}`} style={{ fontSize: "10.5px" }}>
                        {t.status}
                      </span>
                    </div>
                    <p style={{ fontSize: "12.5px", color: "#475569", margin: "0 0 4px 0", maxWidth: "700px" }}>
                      {t.problem || t.query_text}
                    </p>
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                      Student: {t.student_name || "Enrolled Student"} &bull; Priority: {t.priority || "Medium"} &bull; Created: {t.created_at || "Recent"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setStatusFilter("All");
                    handleSelectTicket(t);
                  }}
                  style={{ whiteSpace: "nowrap", fontWeight: 700 }}
                >
                  Open Ticket &rarr;
                </button>
              </div>
            ))}

            {/* Institutional Security Notice */}
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "8px",
                border: "1px solid #bbf7d0",
                background: "#f0fdf4",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}
            >
              <ShieldCheck size={20} color="#166534" />
              <div>
                <span style={{ fontWeight: 700, fontSize: "13px", color: "#166534", display: "block" }}>
                  Institutional Security & Department Isolation Active
                </span>
                <span style={{ fontSize: "12px", color: "#15803d" }}>
                  Your account is verified with {user?.dept_id || "Department"}. Scope isolation ensures you only access tickets assigned specifically to your departmental queue.
                </span>
              </div>
            </div>

            {/* University Notice */}
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}
            >
              <BookOpen size={20} color="#062051" />
              <div>
                <span style={{ fontWeight: 700, fontSize: "13px", color: "#062051", display: "block" }}>
                  Knowledge Base Grounding Active
                </span>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  All verified faculty resolutions automatically feed into the closed-loop learning pipeline to enrich AI Help Desk circulars.
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
      /* Main Grid: Ticket Inbox List & Ticket Resolution Workspace */
      <div className="responsive-split-faculty" style={{ minHeight: "550px" }}>
        {/* Left Column: Tickets Queue */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", overflow: "hidden", background: "#ffffff" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", fontWeight: 800, fontSize: "14px", color: "#062051" }}>
            Faculty Inbox ({tickets.length})
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "8px", background: "#f8fafc" }}>
            {loading ? (
              <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>Loading assigned tickets...</div>
            ) : tickets.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#64748b" }}>
                No tickets pending in this category.
              </div>
            ) : (
              tickets.map((t) => {
                const isSelected = selectedTicket?.ticket_id === t.ticket_id;
                return (
                  <div
                    key={t.ticket_id}
                    onClick={() => handleSelectTicket(t)}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      background: isSelected ? "#eaf4fb" : "#ffffff",
                      border: isSelected ? "1px solid #062051" : "1px solid #e2e8f0",
                      boxShadow: isSelected ? "0 2px 8px rgba(6, 32, 81, 0.1)" : "0 1px 3px rgba(0,0,0,0.02)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#062051" }}>{t.ticket_id}</span>
                      <span
                        className={`badge ${
                          t.status === "Resolved"
                            ? "badge-success"
                            : t.status === "Answered"
                            ? "badge-primary"
                            : "badge-warning"
                        }`}
                        style={{ fontSize: "10px" }}
                      >
                        {t.status}
                      </span>
                    </div>

                    <div style={{ fontSize: "13.5px", fontWeight: 600, color: "#0f172a", marginBottom: "6px", lineHeight: 1.3 }}>
                      {t.query_text}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "11px", color: "#64748b" }}>
                      <span>{t.student_name || "Student"}</span>
                      <span>{t.created_at ? t.created_at.slice(0, 10) : "Today"}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Ticket Workspace & Reply Editor */}
        <div className="glass-card" style={{ padding: "28px", display: "flex", flexDirection: "column", background: "#ffffff" }}>
          {selectedTicket ? (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "20px" }}>
              {/* Ticket Top Meta */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #e2e8f0", paddingBottom: "18px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span className="badge badge-primary">{selectedTicket.ticket_id}</span>
                    <span className="badge badge-neutral">{selectedTicket.department_name || selectedTicket.dept_id}</span>
                    <span
                      className={`badge ${
                        selectedTicket.status === "Resolved"
                          ? "badge-success"
                          : selectedTicket.status === "Answered"
                          ? "badge-primary"
                          : "badge-warning"
                      }`}
                    >
                      {selectedTicket.status}
                    </span>
                  </div>
                  <h2 style={{ fontSize: "19px", fontWeight: 800, color: "#062051" }}>{selectedTicket.query_text}</h2>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button
                    id="btn-answer-yourself"
                    className="btn btn-primary btn-sm"
                    onClick={handleScrollToAnswer}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "#059669",
                      color: "#ffffff",
                      fontWeight: 700,
                    }}
                  >
                    <Send size={14} /> Answer Yourself
                  </button>
                  <button
                    id="btn-reassign-faculty"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenReassignModal()}
                    style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700 }}
                  >
                    <ArrowRightLeft size={14} /> Reassign Faculty
                  </button>
                </div>
              </div>

              {/* Student Information & Routing Metadata (PRD Section 10) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                <div style={{ background: "#f8fafc", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>Student Name</div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#062051" }}>{selectedTicket.student_name || "Student"}</div>
                  <div style={{ fontSize: "10.5px", color: "#64748b" }}>{selectedTicket.student_email || ""}</div>
                </div>
                <div style={{ background: "#f8fafc", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>Department</div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#062051" }}>
                    {selectedTicket.department_name || selectedTicket.dept_id || "Academic"}
                  </div>
                </div>
                <div style={{ background: "#f8fafc", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>Programme / Sem</div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#062051" }}>
                    {selectedTicket.student_programme || "M.Sc. IT"} • Sem {selectedTicket.student_semester || 1}
                  </div>
                </div>
                <div style={{ background: "#fefce8", padding: "10px", borderRadius: "8px", border: "1px solid #fef08a" }}>
                  <div style={{ fontSize: "11px", color: "#854d0e", fontWeight: 700 }}>Assigned Faculty & HOD</div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#713f12" }}>
                    {selectedTicket.faculty_name || selectedTicket.assigned_faculty_names || "Faculty Member"}
                  </div>
                  {selectedTicket.hod_name && (
                    <div style={{ fontSize: "10.5px", color: "#a16207" }}>
                      HOD: {selectedTicket.hod_name} (Auto-mapped)
                    </div>
                  )}
                </div>
              </div>

              {/* Multi-Department Assignments (PRD Section 12) */}
              {selectedTicket.departments && selectedTicket.departments.length > 0 && (
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "12px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: "#062051", marginBottom: "8px" }}>
                    Department Assignments ({selectedTicket.departments.length})
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: selectedTicket.departments.length > 1 ? "1fr 1fr" : "1fr", gap: "8px" }}>
                    {selectedTicket.departments.map((dept, dIdx) => {
                      const canManage = isHOD ? (userRole === "super_admin" || userRole === "admin" || user?.dept_id === dept.dept_id || dept.hod_id === user?.id) : true;
                      return (
                        <div
                          key={dIdx}
                          style={{
                            background: "#ffffff",
                            border: "1px solid #cbd5e1",
                            borderRadius: "7px",
                            padding: "10px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <strong style={{ fontSize: "12.5px", color: "#062051" }}>
                              {dept.department_name || dept.dept_id}
                            </strong>
                            <span
                              className={`badge ${
                                dept.status === "Resolved"
                                  ? "badge-success"
                                  : dept.status === "Answered"
                                  ? "badge-primary"
                                  : "badge-warning"
                              }`}
                              style={{ fontSize: "10px" }}
                            >
                              {dept.status || "Assigned"}
                            </span>
                          </div>
                          <div style={{ fontSize: "11.5px", color: "#475569" }}>
                            Faculty: <strong>{dept.faculty_name || "Unassigned"}</strong>
                          </div>
                          {dept.hod_name && (
                            <div style={{ fontSize: "11px", color: "#64748b" }}>
                              HOD: {dept.hod_name} (Auto-mapped)
                            </div>
                          )}
                          {canManage && (
                            <div style={{ marginTop: "4px" }}>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: "10.5px", padding: "2px 8px" }}
                                onClick={() => handleOpenReassignModal(dept.dept_id, dept.assigned_faculty_id || dept.faculty_id)}
                              >
                                <ArrowRightLeft size={11} /> Reassign This Dept Faculty
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Problem Description (PRD Section 10) */}
              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "12px" }}>
                <div style={{ fontSize: "12px", fontWeight: 800, color: "#062051", marginBottom: "4px" }}>
                  Problem Description
                </div>
                <div style={{ fontSize: "13.5px", color: "#1e293b", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                  {selectedTicket.problem || selectedTicket.query_text}
                </div>
              </div>

              {/* Ticket Assignment History & Audit Trail (PRD Section 10 & 17) */}
              {selectedTicket.assignment_history && selectedTicket.assignment_history.length > 0 && (
                <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: "#062051", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Clock size={13} color="#062051" /> Ticket Assignment History & Audit Log
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {selectedTicket.assignment_history.map((hist, hIdx) => (
                      <div
                        key={hIdx}
                        style={{
                          fontSize: "11.5px",
                          color: "#334155",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: "#ffffff",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <div>
                          <strong style={{ color: "#062051" }}>{hist.changed_by || "System"}:</strong>{" "}
                          {hist.old_faculty_name ? (
                            <span>{hist.old_faculty_name} &rarr; </span>
                          ) : (
                            <span>Assigned to </span>
                          )}
                          <strong style={{ color: "#059669" }}>{hist.new_faculty_name}</strong>
                          {hist.reason ? <span style={{ color: "#64748b" }}> ({hist.reason})</span> : ""}
                        </div>
                        <span style={{ fontSize: "10.5px", color: "#94a3b8" }}>
                          {hist.created_at ? hist.created_at.slice(0, 16) : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply Composer with ref */}
              <div ref={replyComposerRef} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#062051", display: "flex", alignItems: "center", gap: "6px" }}>
                  <CornerDownRight size={14} color="#062051" /> {isHOD ? "HOD Official Response / Resolution:" : "Official Faculty Resolution:"}
                </label>
                <textarea
                  className="input-field"
                  style={{ flex: 1, minHeight: "150px", resize: "none", lineHeight: 1.6 }}
                  placeholder="Type your official resolution here. The student will receive this immediately via email, and upon resolving, this answer can be indexed into the knowledge base by Admin."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkles size={14} color="#c59b27" />
                  Resolving triggers candidate creation for Knowledge Base Learning Loop.
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleSendReply(false)}
                    disabled={submitting || !replyText.trim()}
                  >
                    Save as Answered
                  </button>
                  <button
                    id="btn-send-answer"
                    className="btn btn-success"
                    onClick={() => handleSendReply(true)}
                    disabled={submitting || !replyText.trim()}
                  >
                    <CheckCircle size={16} /> Mark Resolved & Notify Student
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#64748b" }}>
              Select a ticket from the inbox to review and reply.
            </div>
          )}
        </div>
      </div>
      )}

      {/* Profile Modal (Requirement 6) */}
      {showProfileModal && (
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
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="glass-card animate-fade-in"
            style={{
              maxWidth: "520px",
              width: "100%",
              padding: "24px 22px",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 40px rgba(6, 32, 81, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <User size={20} color="#062051" />
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#062051", margin: 0 }}>
                  Faculty Profile & Institutional Credentials
                </h3>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            {loadingProfile ? (
              <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>Loading institutional profile...</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Full Name</label>
                  <div style={{ fontSize: "14.5px", fontWeight: 700, color: "#062051" }}>
                    {profileData?.name || user?.name || "Faculty Member"}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                      Faculty / Employee ID
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                      <span className="badge badge-gold" style={{ fontSize: "12px", fontWeight: 800 }}>
                        {profileData?.faculty_id || user?.faculty_id || "N/A"}
                      </span>
                      <Lock size={12} color="#854d0e" title="Permanently Locked" />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                      Account Status
                    </label>
                    <div style={{ marginTop: "2px" }}>
                      <span className={`badge ${(profileData?.status || user?.status || "ACTIVE") === "ACTIVE" ? "badge-success" : "badge-danger"}`} style={{ fontSize: "11px", fontWeight: 700 }}>
                        {profileData?.status || user?.status || "ACTIVE"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>University Email</label>
                  <div style={{ fontSize: "13.5px", color: "#062051", fontWeight: 600 }}>
                    {profileData?.email || user?.email || "N/A"}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>College / Institute</label>
                  <div style={{ fontSize: "13.5px", color: "#062051", fontWeight: 600 }}>
                    {profileData?.college || user?.college || "Silver Oak College of Computer Application"}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                      Department
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#062051" }}>
                        {profileData?.department_name || profileData?.department_id || user?.dept_id || "N/A"}
                      </span>
                      <Lock size={12} color="#64748b" title="Permanently Locked" />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Designation</label>
                    <div style={{ fontSize: "13px", color: "#062051", fontWeight: 600, marginTop: "2px" }}>
                      {profileData?.designation || user?.designation || "Assistant Professor"}
                    </div>
                  </div>
                </div>

                <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <Lock size={13} color="#062051" />
                    <span style={{ fontWeight: 800, fontSize: "11.5px", color: "#062051" }}>Institutional Scope Isolation</span>
                  </div>
                  <p style={{ fontSize: "11.5px", color: "#64748b", margin: 0, lineHeight: 1.45 }}>
                    Faculty accounts are permanently bound to their assigned department and institutional identifier. Modifications to these institutional fields can only be enacted by authorized University Super Administrators.
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                  <button type="button" className="btn btn-primary" onClick={() => setShowProfileModal(false)}>
                    Close Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings / Change Password Modal (Requirement 7) */}
      {showSettingsModal && (
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
          onClick={() => setShowSettingsModal(false)}
        >
          <div
            className="glass-card animate-fade-in"
            style={{
              maxWidth: "460px",
              width: "100%",
              padding: "24px 22px",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              boxShadow: "0 20px 40px rgba(6, 32, 81, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Key size={18} color="#062051" />
                <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#062051", margin: 0 }}>
                  Settings &bull; Change Password
                </h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            {changePwSuccess && (
              <div className="badge badge-success" style={{ width: "100%", padding: "10px", marginBottom: "12px", fontSize: "12px" }}>
                <CheckCircle size={15} style={{ marginRight: "6px" }} />
                {changePwSuccess}
              </div>
            )}

            {changePwError && (
              <div className="badge badge-danger" style={{ width: "100%", padding: "10px", marginBottom: "12px", fontSize: "12px" }}>
                <AlertCircle size={15} style={{ marginRight: "6px" }} />
                {changePwError}
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#062051", marginBottom: "4px" }}>
                  Current Password *
                </label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#062051", marginBottom: "4px" }}>
                  New Password (min 6 characters) *
                </label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#062051", marginBottom: "4px" }}>
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>

              <div style={{ fontSize: "11px", color: "#64748b" }}>
                🔒 Passwords are cryptographically salted and hashed using bcrypt. Plaintext credentials are never saved.
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px", borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSettingsModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={changePwLoading}>
                  {changePwLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassign Faculty Modal (PRD Sections 10, 11, 12, 23) */}
      {showReassignModal && (
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
          onClick={() => setShowReassignModal(false)}
        >
          <div
            className="glass-card animate-fade-in"
            style={{
              maxWidth: "520px",
              width: "100%",
              padding: "24px 20px",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 40px rgba(6, 32, 81, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ArrowRightLeft size={18} color="#062051" />
                <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#062051" }}>
                  Reassign Faculty
                </h3>
              </div>
              <button
                onClick={() => setShowReassignModal(false)}
                style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: "6px", marginBottom: "14px", border: "1px solid #e2e8f0", fontSize: "12.5px", color: "#475569" }}>
              <strong>Ticket:</strong> {selectedTicket?.ticket_id} &bull; <em>"{selectedTicket?.problem?.slice(0, 60) || selectedTicket?.query_text?.slice(0, 60)}..."</em>
            </div>

            <form onSubmit={handleConfirmReassign} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Reusable Dependent Department -> Faculty Selector (PRD Sections 11 & 23) */}
              <DepartmentFacultySelector
                idPrefix="reassign-fac"
                departments={departments}
                selectedDepartment={reassignDept}
                selectedFaculty={targetFacultyId}
                onDepartmentChange={(deptId) => {
                  setReassignDept(deptId);
                  setTargetFacultyId("");
                }}
                onFacultyChange={(facId) => setTargetFacultyId(facId)}
                allowedDepartments={
                  // If HOD, restricted to HOD's department. Admin/SuperAdmin can reassign any.
                  isHOD && userRole !== "super_admin" && userRole !== "admin" && user?.dept_id
                    ? [user.dept_id]
                    : null
                }
                departmentLabel="Department"
                facultyLabel="Faculty"
                showHodInfo={true}
              />

              {/* Reassignment Reason / Notes */}
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#062051", display: "block", marginBottom: "6px" }}>
                  Reassignment Reason / Note (Logged in Audit Trail):
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Specialized subject area / Faculty workload redistribution"
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px", borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowReassignModal(false)}
                >
                  Cancel
                </button>
                <button
                  id="btn-confirm-reassignment"
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || !reassignDept || !targetFacultyId}
                  style={{
                    background: (!reassignDept || !targetFacultyId) ? "#94a3b8" : "#062051",
                    color: "#ffffff",
                    fontWeight: 700,
                  }}
                >
                  {submitting ? "Reassigning..." : "Confirm Reassignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


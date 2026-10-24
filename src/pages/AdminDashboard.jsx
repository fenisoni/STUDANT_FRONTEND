import React, { useState, useEffect } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import DepartmentFacultySelector from "../components/DepartmentFacultySelector";
import {
  ShieldCheck,
  BarChart3,
  BookOpen,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Edit,
  Search,
  Users,
  Building,
  RefreshCw,
  TrendingUp,
  Clock,
  ThumbsUp,
  FileText,
  X,
  Calendar,
  Settings,
  UserPlus,
  GraduationCap,
  Briefcase,
  Ticket,
  ArrowRight,
  Shield,
  Eye,
  Check,
  UserCheck,
  Lock,
  Key,
  Copy,
  AlertCircle,
  UserX,
  UserMinus,
  ShieldAlert
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";
  const [activeTab, setActiveTab] = useState("analytics");
  const [metrics, setMetrics] = useState(null);
  const [kbArticles, setKbArticles] = useState([]);
  const [kbSearch, setKbSearch] = useState("");
  const [kbDept, setKbDept] = useState("All");
  const [candidates, setCandidates] = useState([]);
  const [usersData, setUsersData] = useState({ students: [], faculty: [], departments: [] });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");

  // Super Admin data state
  const [superStudents, setSuperStudents] = useState([]);
  const [superFaculty, setSuperFaculty] = useState([]);
  const [superDepts, setSuperDepts] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [adminLeaves, setAdminLeaves] = useState([]);
  const [reviewingLeaveId, setReviewingLeaveId] = useState(null);
  const [sysSettings, setSysSettings] = useState({
    allowed_email_domains: "silveroakuni.ac.in, silveroak.edu.in",
    semester_progression_months: 6,
  });

  // Filter state for students
  const [studentSearch, setStudentSearch] = useState("");
  const [studentDeptFilter, setStudentDeptFilter] = useState("All");

  // Filter state for tickets
  const [ticketStatusFilter, setTicketStatusFilter] = useState("All");
  const [ticketDeptFilter, setTicketDeptFilter] = useState("All");

  // Semester Scheduler State
  const [schedulerRunning, setSchedulerRunning] = useState(false);
  const [schedulerResult, setSchedulerResult] = useState(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newArticle, setNewArticle] = useState({
    dept_id: "DEPT_EXAM",
    title: "",
    question: "",
    answer: "",
    source: "",
  });

  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDept, setUploadDept] = useState("DEPT_ACADEMIC");
  const [uploadMsg, setUploadMsg] = useState("");

  // Assign to Faculty Modal (Requirement 8)
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTicketForAssign, setSelectedTicketForAssign] = useState(null);
  const [assignDept, setAssignDept] = useState("");
  const [assignFacultyId, setAssignFacultyId] = useState("");
  const [assignNote, setAssignNote] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  // Direct Ticket Answer Modal
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [answerTicketTarget, setAnswerTicketTarget] = useState(null);
  const [adminAnswerText, setAdminAnswerText] = useState("");
  const [answeringTicket, setAnsweringTicket] = useState(false);

  // Create Student Modal
  const [showCreateStudentModal, setShowCreateStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    enrollment_no: "",
    name: "",
    email: "",
    password: "password123",
    programme: "BCA",
    department_id: "DEPT_CA",
    semester: 1,
    admission_date: "2024-07-01",
  });

  // Faculty Management State (Requirements 1, 8, 14, 15)
  const [facultySearch, setFacultySearch] = useState("");
  const [facultyDeptFilter, setFacultyDeptFilter] = useState("All");
  const [facultyStatusFilter, setFacultyStatusFilter] = useState("All");
  const [showCreateFacultyModal, setShowCreateFacultyModal] = useState(false);
  const [createFacultyError, setCreateFacultyError] = useState("");
  const [createFacultyLoading, setCreateFacultyLoading] = useState(false);
  const [createdFacultyCredentials, setCreatedFacultyCredentials] = useState(null);
  const [newFaculty, setNewFaculty] = useState({
    name: "",
    email: "",
    faculty_id: "",
    phone: "",
    college: "Silver Oak College of Computer Application",
    department_id: "DEPT_CA",
    designation: "Assistant Professor",
    password: "TempPass2026!",
    status: "ACTIVE",
    role: "faculty",
    max_workload: 10,
  });

  // Deactivate Modal with "Reassign Existing Tickets" (Requirement 14)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [deactivateNewStatus, setDeactivateNewStatus] = useState("INACTIVE");
  const [reassignActiveTickets, setReassignActiveTickets] = useState(true);
  const [deactivateReassignTo, setDeactivateReassignTo] = useState("");
  const [deactivateReason, setDeactivateReason] = useState("");
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  // Reset Password Modal (Requirement 8 & 3)
  const [showResetPwModal, setShowResetPwModal] = useState(false);
  const [resetPwTarget, setResetPwTarget] = useState(null);
  const [resetPwResult, setResetPwResult] = useState(null);
  const [resetPwLoading, setResetPwLoading] = useState(false);

  // View / Edit Faculty Modal (Requirement 8)
  const [showViewEditModal, setShowViewEditModal] = useState(false);
  const [viewEditTarget, setViewEditTarget] = useState(null);
  const [isEditingFaculty, setIsEditingFaculty] = useState(false);
  const [editFacultyData, setEditFacultyData] = useState({});
  const [editFacultyLoading, setEditFacultyLoading] = useState(false);

  // Audit Log Modal (Requirement 15)
  const [showAuditLogModal, setShowAuditLogModal] = useState(false);
  const [facultyAuditLogs, setFacultyAuditLogs] = useState([]);
  const [auditLogsLoading, setAuditLogsLoading] = useState(false);

  // Student Ticket History Modal
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedStudentHistory, setSelectedStudentHistory] = useState({ student: null, tickets: [] });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [m, kb, cand, u, sStudents, sFaculty, sDepts, sTickets, sSettings, leaves] = await Promise.all([
        api.getAdminAnalytics().catch(() => null),
        api.getKB().catch(() => []),
        api.getAdminCandidates("Pending").catch(() => []),
        api.getAdminUsers().catch(() => ({ students: [], faculty: [], departments: [] })),
        api.getSuperAdminStudents().catch(() => []),
        api.getSuperAdminFaculty().catch(() => []),
        api.getSuperAdminDepartments().catch(() => []),
        api.getAllSystemTickets().catch(() => []),
        api.getSystemSettings().catch(() => ({})),
        api.getAllAdminLeaves().catch(() => []),
      ]);

      setMetrics(m);
      setKbArticles(Array.isArray(kb) ? kb : []);
      setCandidates(Array.isArray(cand) ? cand : []);
      setUsersData(u && u.students ? u : { students: [], faculty: [], departments: [] });
      setSuperStudents(Array.isArray(sStudents) ? sStudents : []);
      setSuperFaculty(Array.isArray(sFaculty) ? sFaculty : []);
      setSuperDepts(Array.isArray(sDepts) ? sDepts : []);
      setAllTickets(Array.isArray(sTickets) ? sTickets : []);
      setAdminLeaves(Array.isArray(leaves) ? leaves : []);
      if (sSettings && Object.keys(sSettings).length > 0) {
        setSysSettings(sSettings);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewLeave = async (leaveId, action, remarks) => {
    setReviewingLeaveId(leaveId);
    try {
      await api.reviewLeave(leaveId, { action, remarks: remarks || `Reviewed and ${action} by Academic Administration` });
      notify(`Leave #${leaveId} marked as ${action}!`);
      const updated = await api.getAllAdminLeaves();
      setAdminLeaves(Array.isArray(updated) ? updated : []);
    } catch (err) {
      alert("Error reviewing leave: " + err.message);
    } finally {
      setReviewingLeaveId(null);
    }
  };

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4000);
  };

  // ── Semester Progression Handler (Requirement 2) ──────────────────────────
  const handleRunSemesterScheduler = async () => {
    setSchedulerRunning(true);
    setSchedulerResult(null);
    try {
      const res = await api.advanceSemesters();
      setSchedulerResult(res);
      notify(`Scheduler executed! ${res.promoted_count} students promoted to next semester.`);
      // Refresh students
      const updated = await api.getSuperAdminStudents();
      setSuperStudents(updated);
    } catch (err) {
      alert("Scheduler error: " + err.message);
    } finally {
      setSchedulerRunning(false);
    }
  };

  const handleUpdateStudentSemester = async (studentId, semester) => {
    try {
      await api.updateStudentSemester(studentId, semester);
      setSuperStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, semester } : s))
      );
      notify("Semester updated successfully!");
    } catch (err) {
      alert("Failed to update semester: " + err.message);
    }
  };

  // ── Assign Ticket to Faculty (Requirement 8) ──────────────────────────────
  const handleOpenAssignModal = (ticket) => {
    setSelectedTicketForAssign(ticket);
    const initialDept = ticket.dept_id || (ticket.departments && ticket.departments[0]?.dept_id) || "";
    setAssignDept(initialDept);
    setAssignFacultyId(ticket.assigned_faculty_id || "");
    setAssignNote("");
    setShowAssignModal(true);
  };

  const handleAssignTicketSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTicketForAssign || !assignDept || !assignFacultyId) return;
    setAssignLoading(true);
    try {
      try {
        await api.reassignFaculty(selectedTicketForAssign.id || selectedTicketForAssign.ticket_id, {
          dept_id: assignDept,
          new_faculty_id: assignFacultyId,
          reason: assignNote || "Assigned by Administrator",
        });
      } catch (eReassign) {
        await api.assignFacultyToTicket(selectedTicketForAssign.id || selectedTicketForAssign.ticket_id, {
          department_id: assignDept,
          faculty_id: assignFacultyId,
          assignment_note: assignNote,
        });
      }
      setShowAssignModal(false);
      notify(`Ticket successfully assigned to department faculty.`);
      const updated = await api.getAllSystemTickets(ticketStatusFilter, ticketDeptFilter);
      setAllTickets(updated);
    } catch (err) {
      alert("Failed to assign ticket: " + err.message);
    } finally {
      setAssignLoading(false);
    }
  };

  // ── Admin Direct Answer (Requirement 8) ───────────────────────────────────
  const handleAdminDirectAnswer = async (e) => {
    e.preventDefault();
    if (!answerTicketTarget || !adminAnswerText.trim()) return;
    setAnsweringTicket(true);
    try {
      await api.replyTicket(answerTicketTarget.id || answerTicketTarget.ticket_id, adminAnswerText, "Resolved");
      setShowAnswerModal(false);
      setAdminAnswerText("");
      notify("Ticket resolved and resolution dispatched to student!");
      const updated = await api.getAllSystemTickets(ticketStatusFilter, ticketDeptFilter);
      setAllTickets(updated);
    } catch (err) {
      alert("Error replying to ticket: " + err.message);
    } finally {
      setAnsweringTicket(false);
    }
  };

  // ── Create Student Account ────────────────────────────────────────────────
  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      await api.createSuperAdminStudent(newStudent);
      setShowCreateStudentModal(false);
      notify("Student account created successfully!");
      const updated = await api.getSuperAdminStudents();
      setSuperStudents(updated);
    } catch (err) {
      alert("Error creating student: " + err.message);
    }
  };

  // ── Create Faculty / Leadership Account (Requirement 1) ───────────────────
  const handleCreateFaculty = async (e) => {
    e.preventDefault();
    setCreateFacultyError("");
    if (!newFaculty.name.trim() || !newFaculty.email.trim() || !newFaculty.department_id || !newFaculty.college.trim()) {
      setCreateFacultyError("Full Name, University Email, Department, and College/Institute are mandatory.");
      return;
    }
    setCreateFacultyLoading(true);
    try {
      const res = await api.createSuperAdminFaculty(newFaculty);
      setShowCreateFacultyModal(false);
      setCreatedFacultyCredentials({
        name: newFaculty.name,
        faculty_id: res.faculty_id || newFaculty.faculty_id,
        email: newFaculty.email,
        temporary_password: newFaculty.password,
        department_id: newFaculty.department_id,
        college: newFaculty.college,
      });
      notify(`Faculty account created for ${newFaculty.name}!`);
      // Reset form
      setNewFaculty({
        name: "",
        email: "",
        faculty_id: "",
        phone: "",
        college: "Silver Oak College of Computer Application",
        department_id: "DEPT_CA",
        designation: "Assistant Professor",
        password: "TempPass2026!",
        status: "ACTIVE",
        role: "faculty",
        max_workload: 10,
      });
      const updated = await api.getSuperAdminFaculty();
      setSuperFaculty(updated);
    } catch (err) {
      setCreateFacultyError(err.message || "Failed to create faculty account.");
    } finally {
      setCreateFacultyLoading(false);
    }
  };

  // Status Lifecycle (Activate, Deactivate, Suspend) (Requirements 8 & 14)
  const handleOpenDeactivateModal = (faculty, statusToSet = "INACTIVE") => {
    setDeactivateTarget(faculty);
    setDeactivateNewStatus(statusToSet);
    setDeactivateReason("");
    setReassignActiveTickets(true);
    const peers = superFaculty.filter(
      (f) => (f.faculty_id || f.id) !== (faculty.faculty_id || faculty.id) &&
             f.department_id === faculty.department_id &&
             (f.status === "ACTIVE" || !f.status)
    );
    setDeactivateReassignTo(peers.length > 0 ? (peers[0].faculty_id || peers[0].id) : "");
    setShowDeactivateModal(true);
  };

  const handleConfirmDeactivateStatus = async (e) => {
    e.preventDefault();
    if (!deactivateTarget) return;
    setDeactivateLoading(true);
    try {
      const payload = {
        status: deactivateNewStatus,
        reason: deactivateReason || `Account set to ${deactivateNewStatus} by administrator`,
        reassign_to_faculty_id: reassignActiveTickets && deactivateReassignTo ? deactivateReassignTo : null,
      };
      const res = await api.updateSuperAdminFacultyStatus(deactivateTarget.faculty_id || deactivateTarget.id, payload);
      setShowDeactivateModal(false);
      notify(res.message || `Faculty account status updated to ${deactivateNewStatus}.`);
      const updated = await api.getSuperAdminFaculty();
      setSuperFaculty(updated);
      const tickets = await api.getAllSystemTickets(ticketStatusFilter, ticketDeptFilter);
      setAllTickets(tickets);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setDeactivateLoading(false);
    }
  };

  const handleDirectActivate = async (faculty) => {
    if (!window.confirm(`Activate account for ${faculty.name} (${faculty.faculty_id || faculty.id})?`)) return;
    try {
      await api.updateSuperAdminFacultyStatus(faculty.faculty_id || faculty.id, {
        status: "ACTIVE",
        reason: "Account reactivated by administrator",
      });
      notify(`Account activated for ${faculty.name}`);
      const updated = await api.getSuperAdminFaculty();
      setSuperFaculty(updated);
    } catch (err) {
      alert("Failed to activate: " + err.message);
    }
  };

  // Reset Password (Admin trigger) (Requirements 8 & 3)
  const handleOpenResetPassword = (faculty) => {
    setResetPwTarget(faculty);
    setResetPwResult(null);
    setShowResetPwModal(true);
  };

  const handleConfirmResetPassword = async () => {
    if (!resetPwTarget) return;
    setResetPwLoading(true);
    try {
      const res = await api.resetSuperAdminFacultyPassword(resetPwTarget.faculty_id || resetPwTarget.id);
      setResetPwResult(res);
      notify(`Password reset for ${resetPwTarget.name}`);
      const updated = await api.getSuperAdminFaculty();
      setSuperFaculty(updated);
    } catch (err) {
      alert("Failed to reset password: " + err.message);
    } finally {
      setResetPwLoading(false);
    }
  };

  // View / Edit Faculty (Requirement 8)
  const handleOpenViewEdit = (faculty) => {
    setViewEditTarget(faculty);
    setEditFacultyData({
      name: faculty.name,
      email: faculty.email,
      faculty_id: faculty.faculty_id || faculty.id,
      college: faculty.college || "Silver Oak College of Computer Application",
      department_id: faculty.department_id,
      designation: faculty.designation || "Assistant Professor",
      status: faculty.status || "ACTIVE",
      role: faculty.role || "faculty",
      max_workload: faculty.max_workload || 10,
      phone: faculty.phone || "",
    });
    setIsEditingFaculty(false);
    setShowViewEditModal(true);
  };

  const handleSaveEditFaculty = async (e) => {
    e.preventDefault();
    if (!viewEditTarget) return;
    setEditFacultyLoading(true);
    try {
      await api.updateSuperAdminFaculty(viewEditTarget.faculty_id || viewEditTarget.id, editFacultyData);
      notify(`Faculty profile updated for ${editFacultyData.name}`);
      setIsEditingFaculty(false);
      setShowViewEditModal(false);
      const updated = await api.getSuperAdminFaculty();
      setSuperFaculty(updated);
    } catch (err) {
      alert("Failed to update faculty: " + err.message);
    } finally {
      setEditFacultyLoading(false);
    }
  };

  // Audit Logs (Requirement 15)
  const handleOpenAuditLogs = async (targetFacultyId = "") => {
    setShowAuditLogModal(true);
    setAuditLogsLoading(true);
    try {
      const logs = await api.getFacultyAuditLogs(targetFacultyId);
      setFacultyAuditLogs(Array.isArray(logs) ? logs : []);
    } catch (err) {
      alert("Failed to fetch audit logs: " + err.message);
      setFacultyAuditLogs([]);
    } finally {
      setAuditLogsLoading(false);
    }
  };

  // ── View Student History ──────────────────────────────────────────────────
  const handleViewStudentHistory = async (student) => {
    try {
      const tickets = await api.getStudentTicketHistory(student.id);
      setSelectedStudentHistory({ student, tickets: Array.isArray(tickets) ? tickets : [] });
      setShowHistoryModal(true);
    } catch (err) {
      alert("Failed to load ticket history: " + err.message);
    }
  };

  // ── Update System Settings ────────────────────────────────────────────────
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.updateSystemSettings(sysSettings);
      notify("System settings updated successfully!");
    } catch (err) {
      alert("Failed to update settings: " + err.message);
    }
  };

  // ── Knowledge Base handlers ───────────────────────────────────────────────
  const handleCreateArticle = async (e) => {
    e.preventDefault();
    try {
      await api.createKB(newArticle);
      setShowAddModal(false);
      setNewArticle({ dept_id: "DEPT_EXAM", title: "", question: "", answer: "", source: "" });
      const updated = await api.getKB();
      setKbArticles(updated);
      notify("Knowledge article created!");
    } catch (err) {
      alert("Error creating article: " + err.message);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm("Archive this knowledge base article?")) return;
    try {
      await api.deleteKB(id);
      setKbArticles((prev) => prev.filter((a) => a.kb_id !== id));
      notify("Article archived.");
    } catch (err) {
      alert("Error deleting article: " + err.message);
    }
  };

  const handleReviewCandidate = async (candId, action) => {
    try {
      await api.reviewCandidate(candId, action);
      setCandidates((prev) => prev.filter((c) => c.candidate_id !== candId));
      if (action === "Approve") {
        const updated = await api.getKB();
        setKbArticles(updated);
      }
      notify(`Candidate ${action}d successfully.`);
    } catch (err) {
      alert("Error reviewing candidate: " + err.message);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;
    try {
      const res = await api.uploadKBDoc(uploadFile, uploadDept, uploadTitle || uploadFile.name);
      setUploadMsg(`Document chunked and indexed into ${res.chunks_indexed} knowledge articles!`);
      setUploadFile(null);
      setUploadTitle("");
      const updated = await api.getKB();
      setKbArticles(updated);
    } catch (err) {
      alert("Error uploading document: " + err.message);
    }
  };

  const filteredArticles = kbArticles.filter((a) => {
    const matchQuery =
      a.title.toLowerCase().includes(kbSearch.toLowerCase()) ||
      a.question.toLowerCase().includes(kbSearch.toLowerCase()) ||
      a.answer.toLowerCase().includes(kbSearch.toLowerCase());
    const matchDept = kbDept === "All" || a.dept_id === kbDept;
    return matchQuery && matchDept;
  });

  const filteredStudents = superStudents.filter((s) => {
    const matchSearch =
      !studentSearch ||
      s.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.enrollment_no?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email?.toLowerCase().includes(studentSearch.toLowerCase());
    const matchDept = studentDeptFilter === "All" || s.department_id === studentDeptFilter;
    return matchSearch && matchDept;
  });

  const filteredTickets = allTickets.filter((t) => {
    const matchStatus = ticketStatusFilter === "All" || t.status === ticketStatusFilter;
    const matchDept =
      ticketDeptFilter === "All" ||
      t.dept_id === ticketDeptFilter ||
      (t.department_ids && t.department_ids.includes(ticketDeptFilter));
    return matchStatus && matchDept;
  });

  const filteredFaculty = superFaculty.filter((f) => {
    const matchSearch =
      !facultySearch ||
      f.name?.toLowerCase().includes(facultySearch.toLowerCase()) ||
      (f.faculty_id || f.id)?.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.email?.toLowerCase().includes(facultySearch.toLowerCase());
    const matchDept = facultyDeptFilter === "All" || f.department_id === facultyDeptFilter;
    const matchStatus = facultyStatusFilter === "All" || (f.status || "ACTIVE") === facultyStatusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  return (
    <div className="page-enter" style={{ maxWidth: "1350px", margin: "0 auto", padding: "16px 0" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span className="badge badge-primary">Silver Oak University Portal</span>
            <span className="badge badge-gold">
              {isSuperAdmin ? "SUPER ADMIN COMMAND SUITE" : "ADMINISTRATION & INTELLIGENCE"}
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(20px, 4vw, 24px)", fontWeight: 800, color: "#062051", letterSpacing: "-0.5px" }}>
            {isSuperAdmin ? "Super Administrator Governance Portal" : "System Admin Command Center"}
          </h1>
          <p style={{ fontSize: "12.5px", color: "#64748b" }}>
            Institutional Hierarchy, Multi-Department Ticketing, 6-Month Semester Engine & Closed-Loop Learning
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={loadAll}>
          <RefreshCw size={13} /> Refresh Data
        </button>
      </div>

      {notification && (
        <div className="badge badge-success animate-fade-in" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
          <CheckCircle2 size={16} style={{ marginRight: "6px" }} />
          {notification}
        </div>
      )}

      {/* KPI Cards Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "20px" }}>
        <div className="glass-card" style={{ padding: "14px 16px", background: "#ffffff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 800, textTransform: "uppercase" }}>Total Queries</span>
            <BarChart3 size={16} color="#062051" />
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#062051" }}>{metrics?.total_queries ?? "—"}</div>
          <div style={{ fontSize: "11px", color: "#059669", marginTop: "2px" }}>Real-time count</div>
        </div>

        <div className="glass-card" style={{ padding: "14px 16px", background: "#ffffff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 800, textTransform: "uppercase" }}>AI Resolution</span>
            <TrendingUp size={16} color="#059669" />
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#059669" }}>
            {metrics?.ai_resolution_rate != null ? `${metrics.ai_resolution_rate}%` : "—"}
          </div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>Target: &ge; 70%</div>
        </div>

        <div className="glass-card" style={{ padding: "14px 16px", background: "#ffffff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 800, textTransform: "uppercase" }}>Open Tickets</span>
            <Clock size={16} color="#d97706" />
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#b45309" }}>{metrics?.open_tickets ?? allTickets.filter(t => t.status !== "Resolved").length}</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>Needs Attention</div>
        </div>

        <div className="glass-card" style={{ padding: "14px 16px", background: "#ffffff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 800, textTransform: "uppercase" }}>Registered Students</span>
            <GraduationCap size={16} color="#062051" />
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#062051" }}>{superStudents.length}</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>Active Directory</div>
        </div>

        <div className="glass-card" style={{ padding: "14px 16px", background: "#ffffff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 800, textTransform: "uppercase" }}>Pending KB</span>
            <Sparkles size={16} color="#c59b27" />
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: candidates.length > 0 ? "#8a1610" : "#062051" }}>
            {candidates.length}
          </div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>Learning Candidates</div>
        </div>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="horizontal-scroll" style={{ display: "flex", gap: "8px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "20px" }}>
        {[
          { id: "analytics", label: "Analytics & Trends", icon: BarChart3 },
          { id: "tickets", label: `Multi-Dept Tickets (${allTickets.length})`, icon: Ticket },
          { id: "leaves", label: `Leaves & Attendance (${adminLeaves.filter(l => l.status === "PENDING").length})`, icon: CheckCircle2 },
          { id: "semesters", label: "Semester Engine (6-Mo)", icon: Calendar },
          { id: "super_students", label: `Students (${superStudents.length})`, icon: GraduationCap },
          { id: "super_faculty", label: `Faculty & Leadership (${superFaculty.length})`, icon: Briefcase },
          { id: "super_depts", label: `Departments (${superDepts.length})`, icon: Building },
          { id: "kb", label: `Knowledge Base (${kbArticles.length})`, icon: BookOpen },
          { id: "learning", label: `Learning Loop (${candidates.length})`, icon: Sparkles },
          { id: "settings", label: "System Settings", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`btn btn-sm ${isActive ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ flexShrink: 0, whiteSpace: "nowrap" }}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: ANALYTICS ─────────────────────────────────────────────── */}
      {activeTab === "analytics" && (
        <div className="responsive-2col">
          <div className="glass-card" style={{ padding: "24px", background: "#ffffff" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#062051", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <TrendingUp size={18} color="#062051" /> Most Frequent Student Intents
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {(metrics?.top_intents || []).map((ti, i) => {
                const maxVal = Math.max(...(metrics?.top_intents || []).map((x) => x.count), 1);
                const percent = Math.round((ti.count / maxVal) * 100);
                return (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 700, color: "#062051" }}>{ti.intent}</span>
                      <span style={{ color: "#64748b" }}>{ti.count} queries</span>
                    </div>
                    <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${percent}%`,
                          background: "linear-gradient(90deg, #062051, #c59b27)",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card" style={{ padding: "24px", background: "#ffffff" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#062051", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Building size={18} color="#062051" /> Department Workload Distribution
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {superDepts.map((d) => (
                <div key={d.id || d.dept_id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: "13px", color: "#062051" }}>{d.name}</span>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>{d.school || "Silver Oak Institute"}</div>
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: "11px" }}>{d.code || d.dept_id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: MULTI-DEPARTMENT TICKETS & FACULTY ASSIGNMENT (Req 4, 5, 8) ─ */}
      {activeTab === "tickets" && (
        <div className="glass-card" style={{ padding: "24px", background: "#ffffff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#062051" }}>
                Multi-Department Support Ticket Queue
              </h3>
              <p style={{ fontSize: "12px", color: "#64748b" }}>
                Monitor cross-department issues. Admin can directly answer or assign to designated department faculty with notes.
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <select
                className="input-field"
                style={{ fontSize: "12px", padding: "6px 10px" }}
                value={ticketStatusFilter}
                onChange={(e) => setTicketStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Assigned">Assigned</option>
                <option value="Answered">Answered</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select
                className="input-field"
                style={{ fontSize: "12px", padding: "6px 10px" }}
                value={ticketDeptFilter}
                onChange={(e) => setTicketDeptFilter(e.target.value)}
              >
                <option value="All">All Departments</option>
                {superDepts.map((d) => (
                  <option key={d.id || d.dept_id} value={d.code || d.dept_id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>Ticket ID</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>Query Description</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>Target Departments</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>Assigned Faculty</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>Status</th>
                  <th style={{ padding: "10px 12px", textAlign: "right", color: "#062051" }}>Admin Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>
                      No tickets matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((t) => (
                    <tr key={t.id || t.ticket_id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 700, color: "#062051" }}>
                        {t.ticket_id || t.id}
                      </td>
                      <td style={{ padding: "10px 12px", maxWidth: "280px" }}>
                        <div style={{ fontWeight: 600, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {t.query_text || t.description}
                        </div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>
                          Student: {t.student_name || t.student_email || "Student"}
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                          {(t.department_ids && t.department_ids.length > 0) ? (
                            t.department_ids.map((dId) => (
                              <span key={dId} className="badge badge-primary" style={{ fontSize: "10px" }}>
                                {dId}
                              </span>
                            ))
                          ) : (
                            <span className="badge badge-primary" style={{ fontSize: "10px" }}>
                              {t.dept_id || "DEPT_EXAM"}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px", fontSize: "12px", color: "#475569" }}>
                        <div style={{ fontWeight: 600, color: "#062051" }}>
                          {t.assigned_faculty_names || t.faculty_name || "Department Pool (All Faculty & HOD)"}
                        </div>
                        {t.departments && t.departments.length > 1 && (
                          <div style={{ fontSize: "10.5px", color: "#64748b", marginTop: "3px" }}>
                            {t.departments.map((d, idx) => (
                              <div key={idx}>• {d.dept_id}: {d.faculty_name || "Pool"}</div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <span
                          className={`badge ${
                            t.status === "Resolved"
                              ? "badge-success"
                              : t.status === "Answered"
                              ? "badge-primary"
                              : "badge-warning"
                          }`}
                          style={{ fontSize: "11px" }}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setAnswerTicketTarget(t);
                              setAdminAnswerText(t.faculty_reply || "");
                              setShowAnswerModal(true);
                            }}
                            style={{ fontSize: "11px", padding: "4px 8px" }}
                          >
                            Answer Ticket
                          </button>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleOpenAssignModal(t)}
                            style={{ fontSize: "11px", padding: "4px 8px", background: "#062051" }}
                          >
                            Assign Faculty
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB: SMART LEAVES & ATTENDANCE APPROVALS PANEL ────────────────── */}
      {activeTab === "leaves" && (
        <div className="glass-card animate-fade-in" style={{ padding: "24px", background: "#ffffff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={20} color="#059669" />
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#062051", margin: 0 }}>
                  Smart Leave Approvals & Biometric Attendance Monitor
                </h3>
              </div>
              <p style={{ fontSize: "12.5px", color: "#64748b", margin: "2px 0 0 0" }}>
                Review student leave requests (Medical, Hackathon Duty, Emergencies). Approved leaves reflect dynamically in university exam eligibility.
              </p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={loadAll}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <RefreshCw size={13} /> Refresh Leaves
            </button>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "20px" }}>
            <div style={{ padding: "14px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Total Leave Requests</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#062051", margin: "4px 0" }}>{adminLeaves.length}</div>
              <div style={{ fontSize: "11.5px", color: "#64748b" }}>Academic Year 2026-27</div>
            </div>
            <div style={{ padding: "14px", borderRadius: "10px", background: "#fffbeb", border: "1px solid #fef3c7" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#b45309", textTransform: "uppercase" }}>Pending Faculty Review</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#d97706", margin: "4px 0" }}>
                {adminLeaves.filter(l => l.status === "PENDING").length}
              </div>
              <div style={{ fontSize: "11.5px", color: "#b45309" }}>Requires Attention</div>
            </div>
            <div style={{ padding: "14px", borderRadius: "10px", background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#166534", textTransform: "uppercase" }}>Approved on Duty</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#059669", margin: "4px 0" }}>
                {adminLeaves.filter(l => l.status === "APPROVED").length}
              </div>
              <div style={{ fontSize: "11.5px", color: "#166534" }}>Credited Attendance</div>
            </div>
          </div>

          {/* Leaves Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>Student</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>Programme</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>Category</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>Dates</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>Reason & Remarks</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>Status</th>
                  <th style={{ padding: "10px 12px", textAlign: "right", color: "#062051" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {adminLeaves.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>
                      No student leave requests submitted yet.
                    </td>
                  </tr>
                ) : (
                  adminLeaves.map((lv) => (
                    <tr key={lv.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ fontWeight: 700, color: "#062051" }}>{lv.student_name}</div>
                        <div style={{ fontSize: "11.5px", color: "#64748b" }}>{lv.student_id}</div>
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <span className="badge badge-primary" style={{ fontSize: "10.5px" }}>{lv.programme || "BCA"}</span>
                      </td>
                      <td style={{ padding: "10px 12px", fontWeight: 600, color: "#1e293b" }}>
                        {lv.leave_type}
                      </td>
                      <td style={{ padding: "10px 12px", fontSize: "12px", color: "#475569" }}>
                        {lv.start_date} to {lv.end_date} ({lv.total_days}d)
                      </td>
                      <td style={{ padding: "10px 12px", maxWidth: "260px" }}>
                        <div style={{ color: "#334155", fontSize: "12.5px" }}>{lv.reason}</div>
                        {lv.faculty_remarks && (
                          <div style={{ fontSize: "11px", color: "#059669", fontStyle: "italic", marginTop: "2px" }}>
                            Note: {lv.faculty_remarks} ({lv.reviewed_by || "Admin"})
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <span className={`badge ${lv.status === "APPROVED" ? "badge-success" : lv.status === "REJECTED" ? "badge-warning" : "badge-neutral"}`} style={{ fontSize: "11px" }}>
                          {lv.status}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>
                        {lv.status === "PENDING" ? (
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                            <button
                              className="btn btn-sm"
                              onClick={() => handleReviewLeave(lv.id, "APPROVED", "Approved on official duty by Academic Head")}
                              disabled={reviewingLeaveId === lv.id}
                              style={{ background: "#059669", color: "#fff", border: "none", fontSize: "11px", padding: "4px 10px" }}
                            >
                              <Check size={12} style={{ marginRight: "3px" }} /> Approve
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleReviewLeave(lv.id, "REJECTED", "Insufficient documentation provided")}
                              disabled={reviewingLeaveId === lv.id}
                              style={{ fontSize: "11px", padding: "4px 8px", borderColor: "#fca5a5", color: "#b91c1c" }}
                            >
                              <X size={12} style={{ marginRight: "3px" }} /> Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 3: SEMESTER ENGINE & 6-MONTH SCHEDULER (Requirement 2) ─────── */}
      {activeTab === "semesters" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Scheduler Control Panel */}
          <div className="glass-card" style={{ padding: "20px 24px", background: "#ffffff", borderLeft: "4px solid #062051" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <Calendar size={18} color="#062051" />
                  <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#062051" }}>
                    6-Month Automatic Semester Progression Engine
                  </h3>
                </div>
                <p style={{ fontSize: "12.5px", color: "#64748b", maxWidth: "700px" }}>
                  Calculates student eligibility using formula: <code>0-6 mo = Sem 1</code>, <code>6-12 mo = Sem 2</code>, <code>12-18 mo = Sem 3</code>, up to programme duration. Administrators retain full manual override rights.
                </p>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleRunSemesterScheduler}
                disabled={schedulerRunning}
                style={{ padding: "10px 18px", fontSize: "13px", fontWeight: 700 }}
              >
                {schedulerRunning ? "Running Progression Engine..." : "▶️ Run Semester Auto-Progression Scheduler"}
              </button>
            </div>

            {schedulerResult && (
              <div style={{ marginTop: "16px", padding: "12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px" }}>
                <div style={{ fontWeight: 800, fontSize: "13px", color: "#166534", marginBottom: "6px" }}>
                  Scheduler Report: {schedulerResult.status} ({schedulerResult.executed_at})
                </div>
                <div style={{ fontSize: "12px", color: "#166534" }}>
                  Promoted Students: <strong>{schedulerResult.promoted_count}</strong> &bull; Total Checked: <strong>{schedulerResult.total_evaluated}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Student Semester Matrix */}
          <div className="glass-card" style={{ padding: "20px 24px", background: "#ffffff" }}>
            <h4 style={{ fontSize: "15px", fontWeight: 800, color: "#062051", marginBottom: "12px" }}>
              Student Semester Roster & Manual Correction
            </h4>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ padding: "8px 12px", textAlign: "left", color: "#062051" }}>Enrollment No.</th>
                    <th style={{ padding: "8px 12px", textAlign: "left", color: "#062051" }}>Name</th>
                    <th style={{ padding: "8px 12px", textAlign: "left", color: "#062051" }}>Programme</th>
                    <th style={{ padding: "8px 12px", textAlign: "left", color: "#062051" }}>Department</th>
                    <th style={{ padding: "8px 12px", textAlign: "left", color: "#062051" }}>Admission Date</th>
                    <th style={{ padding: "8px 12px", textAlign: "left", color: "#062051" }}>Current Semester</th>
                    <th style={{ padding: "8px 12px", textAlign: "right", color: "#062051" }}>Manual Correction</th>
                  </tr>
                </thead>
                <tbody>
                  {superStudents.map((s) => (
                    <tr key={s.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "8px 12px", fontWeight: 700, color: "#062051" }}>{s.enrollment_no}</td>
                      <td style={{ padding: "8px 12px", color: "#1e293b" }}>{s.name}</td>
                      <td style={{ padding: "8px 12px" }}>
                        <span className="badge badge-gold" style={{ fontSize: "10.5px" }}>{s.programme}</span>
                      </td>
                      <td style={{ padding: "8px 12px", fontSize: "12px", color: "#64748b" }}>{s.department_id}</td>
                      <td style={{ padding: "8px 12px", fontSize: "12px", color: "#64748b" }}>{s.admission_date || "2024-07-01"}</td>
                      <td style={{ padding: "8px 12px" }}>
                        <span className="badge badge-primary" style={{ fontSize: "11px" }}>
                          Semester {s.semester || s.current_semester || 1}
                        </span>
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "right" }}>
                        <select
                          className="input-field"
                          style={{ width: "110px", fontSize: "12px", padding: "4px 8px" }}
                          value={s.semester || s.current_semester || 1}
                          onChange={(e) => handleUpdateStudentSemester(s.id, parseInt(e.target.value))}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                            <option key={sem} value={sem}>
                              Sem {sem}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: STUDENT GOVERNANCE (Requirement 3) ─────────────────────── */}
      {activeTab === "super_students" && (
        <div className="glass-card" style={{ padding: "24px", background: "#ffffff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#062051" }}>
                Student Management Directory
              </h3>
              <p style={{ fontSize: "12px", color: "#64748b" }}>
                Full administrative oversight: edit profiles, change departments, disable accounts, and view ticket history.
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <input
                type="text"
                className="input-field"
                placeholder="Search name / enrollment..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                style={{ width: "200px", fontSize: "12px", padding: "6px 10px" }}
              />

              <select
                className="input-field"
                value={studentDeptFilter}
                onChange={(e) => setStudentDeptFilter(e.target.value)}
                style={{ fontSize: "12px", padding: "6px 10px" }}
              >
                <option value="All">All Departments</option>
                {superDepts.map((d) => (
                  <option key={d.id || d.dept_id} value={d.code || d.dept_id}>
                    {d.name}
                  </option>
                ))}
              </select>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowCreateStudentModal(true)}
                style={{ display: "flex", alignItems: "center", gap: "6px", background: "#062051" }}
              >
                <UserPlus size={14} /> Add Student
              </button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>Enrollment</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>Student Name</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>Email</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>Programme / Sem</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>Department</th>
                  <th style={{ padding: "10px 12px", textAlign: "right", color: "#062051" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 700, color: "#062051" }}>{s.enrollment_no}</td>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: "#1e293b" }}>{s.name}</td>
                    <td style={{ padding: "10px 12px", color: "#64748b", fontSize: "12px" }}>{s.email}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span className="badge badge-gold" style={{ fontSize: "11px", marginRight: "6px" }}>{s.programme}</span>
                      <span className="badge badge-primary" style={{ fontSize: "11px" }}>Sem {s.semester || 1}</span>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: "12px", color: "#475569" }}>{s.department_id}</td>
                    <td style={{ padding: "10px 12px", textAlign: "right" }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleViewStudentHistory(s)}
                        style={{ fontSize: "11px", padding: "4px 8px" }}
                      >
                        <Eye size={12} style={{ marginRight: "4px" }} /> Ticket History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 5: FACULTY MANAGEMENT (Requirements 1, 8, 14, 15) ───────────── */}
      {activeTab === "super_faculty" && (
        <div className="glass-card" style={{ padding: "24px", background: "#ffffff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                <Briefcase size={20} color="#062051" />
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#062051", margin: 0 }}>
                  Faculty Account Management
                </h3>
              </div>
              <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                Admin & Super Admin governance: department mapping, credential generation, ticket reassignment, and audit accountability
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <input
                type="text"
                className="input-field"
                placeholder="Search Name / ID / Email..."
                value={facultySearch}
                onChange={(e) => setFacultySearch(e.target.value)}
                style={{ width: "200px", fontSize: "12px", padding: "6px 10px" }}
              />

              <select
                className="input-field"
                value={facultyDeptFilter}
                onChange={(e) => setFacultyDeptFilter(e.target.value)}
                style={{ fontSize: "12px", padding: "6px 10px" }}
              >
                <option value="All">All Departments</option>
                {superDepts.map((d) => (
                  <option key={d.id || d.dept_id} value={d.code || d.dept_id}>
                    {d.name}
                  </option>
                ))}
              </select>

              <select
                className="input-field"
                value={facultyStatusFilter}
                onChange={(e) => setFacultyStatusFilter(e.target.value)}
                style={{ fontSize: "12px", padding: "6px 10px" }}
              >
                <option value="All">All Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>

              <button
                id="btn-admin-create-faculty"
                className="btn btn-primary btn-sm"
                onClick={() => { setShowCreateFacultyModal(true); setCreateFacultyError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "6px", background: "#062051" }}
              >
                <UserPlus size={14} /> Create Faculty
              </button>

              <button
                id="btn-admin-audit-logs"
                className="btn btn-secondary btn-sm"
                onClick={() => handleOpenAuditLogs()}
                style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700 }}
              >
                <FileText size={14} /> Audit Log
              </button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>Faculty Name</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>Faculty ID</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>University Email</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>College / Institute</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>Department</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>Designation</th>
                  <th style={{ padding: "10px 12px", textAlign: "center", color: "#062051" }}>Status</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>Created At</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#062051" }}>Last Login</th>
                  <th style={{ padding: "10px 12px", textAlign: "right", color: "#062051" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaculty.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>
                      No faculty accounts matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredFaculty.map((f) => {
                    const status = f.status || "ACTIVE";
                    const facId = f.faculty_id || f.id;
                    return (
                      <tr key={facId} style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <td style={{ padding: "10px 12px", fontWeight: 700, color: "#062051" }}>
                          {f.name}
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <span className="badge badge-gold" style={{ fontSize: "11px", fontWeight: 800 }}>
                            {facId}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px", color: "#64748b", fontSize: "12px" }}>
                          {f.email}
                        </td>
                        <td style={{ padding: "10px 12px", fontSize: "12px", color: "#475569" }}>
                          {f.college || "Silver Oak College of Computer Application"}
                        </td>
                        <td style={{ padding: "10px 12px", fontSize: "12px", fontWeight: 600, color: "#062051" }}>
                          {f.department_name || f.department_id}
                        </td>
                        <td style={{ padding: "10px 12px", fontSize: "12px", color: "#475569" }}>
                          {f.designation || "Assistant Professor"}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "center" }}>
                          <span
                            className={`badge ${
                              status === "ACTIVE"
                                ? "badge-success"
                                : status === "SUSPENDED"
                                ? "badge-danger"
                                : "badge-neutral"
                            }`}
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              background: status === "INACTIVE" ? "#e2e8f0" : undefined,
                              color: status === "INACTIVE" ? "#475569" : undefined,
                            }}
                          >
                            {status}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px", fontSize: "11.5px", color: "#64748b" }}>
                          {f.created_at ? new Date(f.created_at).toLocaleDateString() : "—"}
                        </td>
                        <td style={{ padding: "10px 12px", fontSize: "11.5px", color: "#64748b" }}>
                          {f.last_login ? new Date(f.last_login).toLocaleString() : "Never"}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "5px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenViewEdit(f)}
                              style={{ fontSize: "11px", padding: "3px 7px" }}
                              title="View and Edit Profile"
                            >
                              <Eye size={12} style={{ marginRight: "3px" }} /> View
                            </button>

                            {status === "ACTIVE" ? (
                              <>
                                <button
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => handleOpenDeactivateModal(f, "INACTIVE")}
                                  style={{ fontSize: "11px", padding: "3px 7px", color: "#64748b" }}
                                  title="Deactivate Account"
                                >
                                  <UserMinus size={12} style={{ marginRight: "3px" }} /> Deactivate
                                </button>
                                <button
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => handleOpenDeactivateModal(f, "SUSPENDED")}
                                  style={{ fontSize: "11px", padding: "3px 7px", color: "#b91c1c" }}
                                  title="Suspend Account"
                                >
                                  <ShieldAlert size={12} style={{ marginRight: "3px" }} /> Suspend
                                </button>
                              </>
                            ) : (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleDirectActivate(f)}
                                style={{ fontSize: "11px", padding: "3px 7px", background: "#059669" }}
                                title="Activate Account"
                              >
                                <Check size={12} style={{ marginRight: "3px" }} /> Activate
                              </button>
                            )}

                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenResetPassword(f)}
                              style={{ fontSize: "11px", padding: "3px 7px" }}
                              title="Reset Password to Temporary Password"
                            >
                              <Key size={12} style={{ marginRight: "3px" }} /> Reset Pw
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 6: SCHOOL & DEPARTMENT STRUCTURE (Requirement 10) ─────────── */}
      {activeTab === "super_depts" && (
        <div className="glass-card" style={{ padding: "24px", background: "#ffffff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#062051" }}>
                Silver Oak University Department Architecture
              </h3>
              <p style={{ fontSize: "12px", color: "#64748b" }}>
                Organized into constituent schools, colleges, and operational cells. Configurable by Super Admin.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
            {superDepts.map((d) => (
              <div key={d.id || d.dept_id} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div>
                    <h4 style={{ fontSize: "14.5px", fontWeight: 800, color: "#062051", marginBottom: "2px" }}>{d.name}</h4>
                    <span className="badge badge-gold" style={{ fontSize: "10px" }}>{d.school || "School of Technology"}</span>
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: "11px" }}>{d.code || d.dept_id}</span>
                </div>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "8px 0" }}>{d.description}</p>
                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "8px", fontSize: "11.5px", color: "#475569" }}>
                  <div><strong>HOD:</strong> {d.hod_name || "Assigned by Dean"}</div>
                  <div><strong>HOI:</strong> {d.hoi_name || "Dean / Principal"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 7: KNOWLEDGE BASE ────────────────────────────────────────── */}
      {activeTab === "kb" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Document Upload Box */}
          <div className="glass-card" style={{ padding: "20px", background: "#ffffff", border: "1px dashed #cbd5e1" }}>
            <h4 style={{ fontSize: "14px", fontWeight: 800, color: "#062051", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <UploadCloud size={16} color="#062051" /> Semantic Document Ingestion (Circular Chunking)
            </h4>
            <form onSubmit={handleFileUpload} style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <input
                type="file"
                accept=".txt,.pdf,.docx"
                onChange={(e) => setUploadFile(e.target.files[0])}
                style={{ fontSize: "12px" }}
              />
              <input
                type="text"
                className="input-field"
                placeholder="Document Title (e.g. Winter 2026 Timetable)"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                style={{ flex: 1, minWidth: "180px", fontSize: "12px", padding: "6px 10px" }}
              />
              <select
                className="input-field"
                value={uploadDept}
                onChange={(e) => setUploadDept(e.target.value)}
                style={{ fontSize: "12px", padding: "6px 10px" }}
              >
                {superDepts.map((d) => (
                  <option key={d.id || d.dept_id} value={d.code || d.dept_id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn btn-primary btn-sm" disabled={!uploadFile}>
                Upload & Chunk
              </button>
            </form>
            {uploadMsg && <div style={{ fontSize: "12px", color: "#059669", marginTop: "8px" }}>{uploadMsg}</div>}
          </div>

          {/* KB Articles List */}
          <div className="glass-card" style={{ padding: "20px", background: "#ffffff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
              <input
                type="text"
                className="input-field"
                placeholder="Search articles..."
                value={kbSearch}
                onChange={(e) => setKbSearch(e.target.value)}
                style={{ width: "220px", fontSize: "12px", padding: "6px 10px" }}
              />
              <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
                <Plus size={14} /> New Article
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {filteredArticles.slice(0, 15).map((a) => (
                <div key={a.kb_id} style={{ padding: "12px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "13.5px", color: "#062051" }}>{a.title}</div>
                    <div style={{ fontSize: "12.5px", color: "#334155", margin: "4px 0" }}>{a.answer}</div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Source: {a.source || "Institutional Policy"}</div>
                  </div>
                  <button onClick={() => handleDeleteArticle(a.kb_id)} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", padding: "4px" }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 8: LEARNING LOOP ─────────────────────────────────────────── */}
      {activeTab === "learning" && (
        <div className="glass-card" style={{ padding: "24px", background: "#ffffff" }}>
          <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#062051", marginBottom: "6px" }}>
            Closed-Loop Learning Candidate Queue
          </h3>
          <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "16px" }}>
            Faculty-answered tickets automatically queue here as knowledge candidates for administrator review and grounding.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {candidates.length === 0 ? (
              <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>
                No candidates pending review. Resolved faculty tickets will populate here.
              </div>
            ) : (
              candidates.map((c) => (
                <div key={c.candidate_id} style={{ padding: "14px 16px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                  <div style={{ fontWeight: 700, fontSize: "13.5px", color: "#062051", marginBottom: "4px" }}>{c.question}</div>
                  <div style={{ fontSize: "13px", color: "#334155", marginBottom: "8px" }}>{c.proposed_answer}</div>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleReviewCandidate(c.candidate_id, "Reject")}>
                      Reject
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => handleReviewCandidate(c.candidate_id, "Approve")}>
                      Approve & Index
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 9: SYSTEM SETTINGS (Requirement 1 & 3) ───────────────────── */}
      {activeTab === "settings" && (
        <div className="glass-card" style={{ padding: "24px", background: "#ffffff", maxWidth: "700px" }}>
          <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#062051", marginBottom: "6px" }}>
            System Settings & University Domain Configuration
          </h3>
          <p style={{ fontSize: "12.5px", color: "#64748b", marginBottom: "16px" }}>
            Configure institutional email validation rules and progression engine frequency without redeploying code.
          </p>

          <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#062051", display: "block", marginBottom: "4px" }}>
                Allowed Student Email Domains (Comma-separated) *
              </label>
              <input
                type="text"
                className="input-field"
                value={sysSettings.allowed_email_domains}
                onChange={(e) => setSysSettings({ ...sysSettings, allowed_email_domains: e.target.value })}
                required
              />
              <span style={{ fontSize: "11px", color: "#64748b" }}>
                e.g. silveroakuni.ac.in, silveroak.edu.in
              </span>
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#062051", display: "block", marginBottom: "4px" }}>
                Semester Progression Frequency (Months) *
              </label>
              <input
                type="number"
                min="1"
                max="12"
                className="input-field"
                value={sysSettings.semester_progression_months}
                onChange={(e) => setSysSettings({ ...sysSettings, semester_progression_months: parseInt(e.target.value) || 6 })}
                required
              />
              <span style={{ fontSize: "11px", color: "#64748b" }}>
                Standard academic rule: 6 months per semester progression.
              </span>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: "10px", width: "fit-content" }}>
              Save System Configuration
            </button>
          </form>
        </div>
      )}

      {/* ─── MODAL: ASSIGN TICKET TO FACULTY (Requirement 8) ──────────────── */}
      {showAssignModal && selectedTicketForAssign && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(6,32,81,0.65)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 100 }} onClick={() => setShowAssignModal(false)}>
          <div className="glass-card animate-fade-in" style={{ maxWidth: "500px", width: "100%", padding: "24px 20px", background: "#ffffff" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#062051" }}>Assign Ticket to Faculty</h3>
              <button onClick={() => setShowAssignModal(false)} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>&times;</button>
            </div>

            <form onSubmit={handleAssignTicketSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontSize: "12.5px", background: "#f8fafc", padding: "10px", borderRadius: "6px" }}>
                <strong>Ticket:</strong> {selectedTicketForAssign.ticket_id || selectedTicketForAssign.id}<br />
                <strong>Query:</strong> {selectedTicketForAssign.query_text || selectedTicketForAssign.description}
              </div>

              <DepartmentFacultySelector
                selectedDepartment={assignDept}
                selectedFaculty={assignFacultyId}
                onDepartmentChange={(deptId) => {
                  setAssignDept(deptId);
                }}
                onFacultyChange={(facId) => {
                  setAssignFacultyId(facId);
                }}
                departmentLabel="Target Department"
                facultyLabel="Select Faculty Member"
                showHodInfo={true}
              />

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#062051" }}>Assignment Note</label>
                <textarea
                  className="input-field"
                  style={{ minHeight: "80px", resize: "none" }}
                  placeholder="e.g. Student inquiring regarding hall ticket clearance, please assist..."
                  value={assignNote}
                  onChange={(e) => setAssignNote(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "10px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={assignLoading}>
                  {assignLoading ? "Assigning..." : "Assign Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: DIRECT TICKET ANSWER (Requirement 8) ──────────────────── */}
      {showAnswerModal && answerTicketTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(6,32,81,0.65)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 100 }} onClick={() => setShowAnswerModal(false)}>
          <div className="glass-card animate-fade-in" style={{ maxWidth: "520px", width: "100%", padding: "24px 20px", background: "#ffffff" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#062051" }}>Answer Ticket Directly</h3>
              <button onClick={() => setShowAnswerModal(false)} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>&times;</button>
            </div>

            <form onSubmit={handleAdminDirectAnswer} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontSize: "12.5px", background: "#f8fafc", padding: "10px", borderRadius: "6px" }}>
                <strong>Ticket:</strong> {answerTicketTarget.ticket_id || answerTicketTarget.id}<br />
                <strong>Query:</strong> {answerTicketTarget.query_text || answerTicketTarget.description}
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#062051" }}>Official Resolution / Reply *</label>
                <textarea
                  className="input-field"
                  style={{ minHeight: "120px", resize: "vertical" }}
                  placeholder="Provide authoritative resolution to the student..."
                  value={adminAnswerText}
                  onChange={(e) => setAdminAnswerText(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "10px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAnswerModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success" disabled={answeringTicket || !adminAnswerText.trim()}>
                  {answeringTicket ? "Publishing..." : "Publish Resolution & Resolve"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: CREATE STUDENT ────────────────────────────────────────── */}
      {showCreateStudentModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(6,32,81,0.65)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 100 }} onClick={() => setShowCreateStudentModal(false)}>
          <div className="glass-card animate-fade-in" style={{ maxWidth: "520px", width: "100%", padding: "24px 20px", background: "#ffffff" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#062051" }}>Create Student Profile</h3>
              <button onClick={() => setShowCreateStudentModal(false)} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>&times;</button>
            </div>

            <form onSubmit={handleCreateStudent} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700 }}>Enrollment No. *</label>
                  <input type="text" className="input-field" value={newStudent.enrollment_no} onChange={(e) => setNewStudent({ ...newStudent, enrollment_no: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700 }}>Full Name *</label>
                  <input type="text" className="input-field" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} required />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "11.5px", fontWeight: 700 }}>Student Email *</label>
                <input type="email" className="input-field" placeholder="student@silveroakuni.ac.in" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} required />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700 }}>Programme</label>
                  <input type="text" className="input-field" value={newStudent.programme} onChange={(e) => setNewStudent({ ...newStudent, programme: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700 }}>Department</label>
                  <select className="input-field" value={newStudent.department_id} onChange={(e) => setNewStudent({ ...newStudent, department_id: e.target.value })}>
                    {superDepts.map((d) => (
                      <option key={d.id || d.dept_id} value={d.code || d.dept_id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700 }}>Admission Date</label>
                  <input type="date" className="input-field" value={newStudent.admission_date} onChange={(e) => setNewStudent({ ...newStudent, admission_date: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700 }}>Semester</label>
                  <select className="input-field" value={newStudent.semester} onChange={(e) => setNewStudent({ ...newStudent, semester: parseInt(e.target.value) })}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "11.5px", fontWeight: 700 }}>Password</label>
                <input type="password" className="input-field" value={newStudent.password} onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })} required />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "10px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateStudentModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Student Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: CREATE FACULTY (Requirement 1) ───────────────────────── */}
      {showCreateFacultyModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(6,32,81,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 100 }} onClick={() => setShowCreateFacultyModal(false)}>
          <div className="glass-card animate-fade-in" style={{ maxWidth: "560px", width: "100%", padding: "24px 22px", background: "#ffffff", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <UserPlus size={18} color="#062051" />
                <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#062051", margin: 0 }}>Create Faculty Account</h3>
              </div>
              <button onClick={() => setShowCreateFacultyModal(false)} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>&times;</button>
            </div>

            {createFacultyError && (
              <div className="badge badge-danger" style={{ width: "100%", padding: "10px", marginBottom: "12px", fontSize: "12px" }}>
                <AlertCircle size={15} style={{ marginRight: "6px" }} />
                {createFacultyError}
              </div>
            )}

            <form onSubmit={handleCreateFaculty} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#062051" }}>Full Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Rahul Sharma"
                    value={newFaculty.name}
                    onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#062051" }}>University Email *</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="rahul.ca@silveroakuni.ac.in"
                    value={newFaculty.email}
                    onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#062051" }}>Employee / Faculty ID *</label>
                    <button
                      type="button"
                      onClick={() => {
                        const dept = newFaculty.department_id ? newFaculty.department_id.replace("DEPT_", "") : "FAC";
                        const rand = Math.floor(100 + Math.random() * 900);
                        setNewFaculty({ ...newFaculty, faculty_id: `FAC-${dept}-${rand}` });
                      }}
                      style={{ background: "none", border: "none", color: "#0f357e", fontSize: "10.5px", cursor: "pointer", fontWeight: 700 }}
                    >
                      Auto-Gen ID
                    </button>
                  </div>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. FAC-CA-001"
                    value={newFaculty.faculty_id}
                    onChange={(e) => setNewFaculty({ ...newFaculty, faculty_id: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#062051" }}>Mobile Number</label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="+91 9876543210"
                    value={newFaculty.phone}
                    onChange={(e) => setNewFaculty({ ...newFaculty, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#062051" }}>College / Institute *</label>
                <input
                  type="text"
                  className="input-field"
                  value={newFaculty.college}
                  onChange={(e) => setNewFaculty({ ...newFaculty, college: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#062051" }}>Department (Mandatory Mapping) *</label>
                  <select
                    className="input-field"
                    value={newFaculty.department_id}
                    onChange={(e) => setNewFaculty({ ...newFaculty, department_id: e.target.value })}
                    required
                  >
                    {superDepts.map((d) => (
                      <option key={d.id || d.dept_id} value={d.code || d.dept_id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#062051" }}>Designation *</label>
                  <select
                    className="input-field"
                    value={newFaculty.designation}
                    onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })}
                    required
                  >
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Professor">Professor</option>
                    <option value="Head of Department (HOD)">Head of Department (HOD)</option>
                    <option value="Dean / Director">Dean / Director</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#062051" }}>Temporary Password *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={newFaculty.password}
                    onChange={(e) => setNewFaculty({ ...newFaculty, password: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#062051" }}>Account Status *</label>
                  <select
                    className="input-field"
                    value={newFaculty.status}
                    onChange={(e) => setNewFaculty({ ...newFaculty, status: e.target.value })}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "11.5px", color: "#64748b" }}>
                🔒 <strong>First Login Rule:</strong> Faculty will be assigned this temporary password and will be prompted to set a permanent password upon first login.
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "10px", borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateFacultyModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={createFacultyLoading}>
                  {createFacultyLoading ? "Creating Account..." : "Create Faculty Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: CREATED FACULTY CREDENTIALS (Requirement 3) ────────────── */}
      {createdFacultyCredentials && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(6,32,81,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 110 }}>
          <div className="glass-card animate-fade-in" style={{ maxWidth: "480px", width: "100%", padding: "24px 22px", background: "#ffffff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <CheckCircle2 size={24} color="#059669" />
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#062051", margin: 0 }}>Faculty Account Created!</h3>
            </div>
            <p style={{ fontSize: "12.5px", color: "#64748b", marginBottom: "14px" }}>
              The faculty account has been registered in the database. Provide the following initial access credentials to the faculty member:
            </p>

            <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "14px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
              <div><strong>Name:</strong> {createdFacultyCredentials.name}</div>
              <div><strong>University Email:</strong> <span style={{ color: "#062051", fontWeight: 700 }}>{createdFacultyCredentials.email}</span></div>
              <div><strong>Faculty ID:</strong> <span className="badge badge-gold">{createdFacultyCredentials.faculty_id}</span></div>
              <div><strong>Temporary Password:</strong> <code style={{ background: "#fef08a", padding: "2px 6px", borderRadius: "4px", fontWeight: 800, color: "#854d0e" }}>{createdFacultyCredentials.temporary_password}</code></div>
              <div><strong>Department:</strong> {createdFacultyCredentials.department_id}</div>
              <div><strong>College:</strong> {createdFacultyCredentials.college}</div>
            </div>

            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "10px", borderRadius: "6px", fontSize: "11.5px", color: "#166534", marginTop: "12px" }}>
              ✓ Credentials have also been safely appended to <code>CREDENTIALS.md</code> for institutional records.
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  const text = `Silver Oak University - Faculty Portal Login\nURL: /faculty/login\nEmail: ${createdFacultyCredentials.email}\nFaculty ID: ${createdFacultyCredentials.faculty_id}\nTemporary Password: ${createdFacultyCredentials.temporary_password}\n(First login password change mandatory)`;
                  navigator.clipboard.writeText(text);
                  notify("Credentials copied to clipboard!");
                }}
              >
                <Copy size={13} style={{ marginRight: "4px" }} /> Copy Credentials
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setCreatedFacultyCredentials(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: DEACTIVATE / SUSPEND WITH TICKET REASSIGNMENT (Req 14) ──── */}
      {showDeactivateModal && deactivateTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(6,32,81,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 100 }} onClick={() => setShowDeactivateModal(false)}>
          <div className="glass-card animate-fade-in" style={{ maxWidth: "500px", width: "100%", padding: "24px 22px", background: "#ffffff" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldAlert size={18} color="#b91c1c" />
                <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#062051", margin: 0 }}>
                  Change Account Lifecycle Status
                </h3>
              </div>
              <button onClick={() => setShowDeactivateModal(false)} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>&times;</button>
            </div>

            <form onSubmit={handleConfirmDeactivateStatus} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ background: "#f8fafc", padding: "10px", borderRadius: "6px", fontSize: "12.5px" }}>
                <div><strong>Faculty:</strong> {deactivateTarget.name} ({deactivateTarget.faculty_id || deactivateTarget.id})</div>
                <div><strong>Department:</strong> {deactivateTarget.department_name || deactivateTarget.department_id}</div>
                <div><strong>Active Tickets:</strong> <span className="badge badge-warning">{deactivateTarget.active_tickets_count || 0}</span></div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#062051" }}>Target Lifecycle Status</label>
                <select
                  className="input-field"
                  value={deactivateNewStatus}
                  onChange={(e) => setDeactivateNewStatus(e.target.value)}
                >
                  <option value="INACTIVE">INACTIVE (Blocked Login)</option>
                  <option value="SUSPENDED">SUSPENDED (Institutional Hold)</option>
                </select>
              </div>

              {/* Requirement 14: Reassign Existing Tickets option */}
              {(deactivateTarget.active_tickets_count > 0 || true) && (
                <div style={{ background: "#fffbeb", border: "1px solid #fef08a", padding: "12px", borderRadius: "8px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "12.5px", color: "#854d0e", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={reassignActiveTickets}
                      onChange={(e) => setReassignActiveTickets(e.target.checked)}
                    />
                    Reassign Active Departmental Tickets
                  </label>
                  <p style={{ fontSize: "11.5px", color: "#a16207", margin: "4px 0 8px 24px" }}>
                    Transfer all pending/in-progress tickets to another active faculty of {deactivateTarget.department_id}.
                  </p>

                  {reassignActiveTickets && (
                    <div style={{ marginLeft: "24px" }}>
                      <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#854d0e" }}>Transfer Tickets To:</label>
                      <select
                        className="input-field"
                        value={deactivateReassignTo}
                        onChange={(e) => setDeactivateReassignTo(e.target.value)}
                        required={reassignActiveTickets}
                        style={{ marginTop: "4px", fontSize: "12px" }}
                      >
                        <option value="">Select Active Peer Faculty...</option>
                        {superFaculty
                          .filter(
                            (f) =>
                              (f.faculty_id || f.id) !== (deactivateTarget.faculty_id || deactivateTarget.id) &&
                              f.department_id === deactivateTarget.department_id &&
                              (f.status === "ACTIVE" || !f.status)
                          )
                          .map((f) => (
                            <option key={f.faculty_id || f.id} value={f.faculty_id || f.id}>
                              {f.name} ({f.faculty_id || f.id}) &bull; {f.active_tickets_count || 0} active tickets
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#062051" }}>Reason for Status Change (Audit Trail)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Sabbatical / Leave of Absence / Department restructuring"
                  value={deactivateReason}
                  onChange={(e) => setDeactivateReason(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px", borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeactivateModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: "#b91c1c" }} disabled={deactivateLoading}>
                  {deactivateLoading ? "Processing..." : `Set Status to ${deactivateNewStatus}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: RESET PASSWORD (Requirement 8) ─────────────────────────── */}
      {showResetPwModal && resetPwTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(6,32,81,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 100 }} onClick={() => setShowResetPwModal(false)}>
          <div className="glass-card animate-fade-in" style={{ maxWidth: "460px", width: "100%", padding: "24px 22px", background: "#ffffff" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Key size={18} color="#062051" />
                <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#062051", margin: 0 }}>Reset Faculty Password</h3>
              </div>
              <button onClick={() => setShowResetPwModal(false)} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>&times;</button>
            </div>

            <div style={{ fontSize: "13px", color: "#475569", marginBottom: "14px" }}>
              Generate a secure temporary password for <strong>{resetPwTarget.name}</strong> ({resetPwTarget.faculty_id || resetPwTarget.id}). The faculty member will be required to change this temporary password upon first login.
            </div>

            {resetPwResult ? (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "14px", borderRadius: "8px", textAlign: "center", marginBottom: "14px" }}>
                <CheckCircle2 size={32} color="#16a34a" style={{ margin: "0 auto 8px" }} />
                <div style={{ fontSize: "13px", color: "#166534", fontWeight: 700, marginBottom: "6px" }}>New Temporary Password:</div>
                <code style={{ fontSize: "18px", fontWeight: 800, color: "#062051", background: "#ffffff", padding: "6px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", display: "inline-block" }}>
                  {resetPwResult.temporary_password}
                </code>
                <div style={{ marginTop: "10px" }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      navigator.clipboard.writeText(resetPwResult.temporary_password);
                      notify("Temporary password copied!");
                    }}
                  >
                    <Copy size={12} style={{ marginRight: "4px" }} /> Copy Password
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "10px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowResetPwModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleConfirmResetPassword} disabled={resetPwLoading}>
                  {resetPwLoading ? "Resetting..." : "Generate Temporary Password"}
                </button>
              </div>
            )}

            {resetPwResult && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                <button type="button" className="btn btn-primary" onClick={() => setShowResetPwModal(false)}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── MODAL: VIEW / EDIT FACULTY (Requirement 8) ────────────────────── */}
      {showViewEditModal && viewEditTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(6,32,81,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 100 }} onClick={() => setShowViewEditModal(false)}>
          <div className="glass-card animate-fade-in" style={{ maxWidth: "520px", width: "100%", padding: "24px 22px", background: "#ffffff", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Eye size={18} color="#062051" />
                <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#062051", margin: 0 }}>
                  {isEditingFaculty ? "Edit Faculty Profile" : "Faculty Institutional Profile"}
                </h3>
              </div>
              <button onClick={() => setShowViewEditModal(false)} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>&times;</button>
            </div>

            <form onSubmit={handleSaveEditFaculty} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#062051" }}>Full Name</label>
                {isEditingFaculty ? (
                  <input
                    type="text"
                    className="input-field"
                    value={editFacultyData.name || ""}
                    onChange={(e) => setEditFacultyData({ ...editFacultyData, name: e.target.value })}
                    required
                  />
                ) : (
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#062051" }}>{viewEditTarget.name}</div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#062051" }}>Faculty ID (Locked)</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span className="badge badge-gold">{viewEditTarget.faculty_id || viewEditTarget.id}</span>
                    <Lock size={12} color="#854d0e" />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#062051" }}>Department (Permanent Mapping)</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#062051" }}>{viewEditTarget.department_name || viewEditTarget.department_id}</span>
                    <Lock size={12} color="#64748b" />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#062051" }}>University Email</label>
                <div style={{ fontSize: "13px", color: "#64748b" }}>{viewEditTarget.email}</div>
              </div>

              <div>
                <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#062051" }}>College / Institute</label>
                {isEditingFaculty ? (
                  <input
                    type="text"
                    className="input-field"
                    value={editFacultyData.college || ""}
                    onChange={(e) => setEditFacultyData({ ...editFacultyData, college: e.target.value })}
                  />
                ) : (
                  <div style={{ fontSize: "13px", color: "#475569" }}>{viewEditTarget.college || "Silver Oak College of Computer Application"}</div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#062051" }}>Designation</label>
                  {isEditingFaculty ? (
                    <input
                      type="text"
                      className="input-field"
                      value={editFacultyData.designation || ""}
                      onChange={(e) => setEditFacultyData({ ...editFacultyData, designation: e.target.value })}
                    />
                  ) : (
                    <div style={{ fontSize: "13px", color: "#475569" }}>{viewEditTarget.designation || "Assistant Professor"}</div>
                  )}
                </div>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#062051" }}>Status</label>
                  {isEditingFaculty ? (
                    <select
                      className="input-field"
                      value={editFacultyData.status || "ACTIVE"}
                      onChange={(e) => setEditFacultyData({ ...editFacultyData, status: e.target.value })}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                      <option value="SUSPENDED">SUSPENDED</option>
                    </select>
                  ) : (
                    <div>
                      <span className={`badge ${(viewEditTarget.status || "ACTIVE") === "ACTIVE" ? "badge-success" : "badge-danger"}`}>
                        {viewEditTarget.status || "ACTIVE"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px", borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}>
                {isEditingFaculty ? (
                  <>
                    <button type="button" className="btn btn-secondary" onClick={() => setIsEditingFaculty(false)}>Cancel Edit</button>
                    <button type="submit" className="btn btn-primary" disabled={editFacultyLoading}>
                      {editFacultyLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="btn btn-secondary" onClick={() => setIsEditingFaculty(true)}>
                      <Edit size={13} style={{ marginRight: "4px" }} /> Edit Details
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => setShowViewEditModal(false)}>Close</button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: AUDIT LOG VIEWER (Requirement 15) ───────────────────────── */}
      {showAuditLogModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(6,32,81,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 100 }} onClick={() => setShowAuditLogModal(false)}>
          <div className="glass-card animate-fade-in" style={{ maxWidth: "780px", width: "100%", padding: "24px 22px", background: "#ffffff", maxHeight: "85vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FileText size={20} color="#062051" />
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#062051", margin: 0 }}>
                  Faculty Account Institutional Audit Log
                </h3>
              </div>
              <button onClick={() => setShowAuditLogModal(false)} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>&times;</button>
            </div>

            <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "14px" }}>
              Mandatory institutional accountability log tracking faculty account creation, deactivations, ticket reassignments, and password resets.
            </p>

            {auditLogsLoading ? (
              <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>Loading institutional audit history...</div>
            ) : facultyAuditLogs.length === 0 ? (
              <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>No audit log entries recorded yet.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                      <th style={{ padding: "8px 10px", textAlign: "left", color: "#062051" }}>Timestamp</th>
                      <th style={{ padding: "8px 10px", textAlign: "left", color: "#062051" }}>Action</th>
                      <th style={{ padding: "8px 10px", textAlign: "left", color: "#062051" }}>Target Faculty</th>
                      <th style={{ padding: "8px 10px", textAlign: "left", color: "#062051" }}>Performed By</th>
                      <th style={{ padding: "8px 10px", textAlign: "left", color: "#062051" }}>Previous Value</th>
                      <th style={{ padding: "8px 10px", textAlign: "left", color: "#062051" }}>New Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facultyAuditLogs.map((log, i) => (
                      <tr key={log.id || i} style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <td style={{ padding: "8px 10px", color: "#64748b", whiteSpace: "nowrap" }}>
                          {log.timestamp ? new Date(log.timestamp).toLocaleString() : "—"}
                        </td>
                        <td style={{ padding: "8px 10px", fontWeight: 700, color: "#062051" }}>
                          <span className="badge badge-primary" style={{ fontSize: "10.5px" }}>{log.action}</span>
                        </td>
                        <td style={{ padding: "8px 10px", fontWeight: 600, color: "#062051" }}>
                          {log.target_faculty_id}
                        </td>
                        <td style={{ padding: "8px 10px", color: "#64748b" }}>
                          {log.performed_by}
                        </td>
                        <td style={{ padding: "8px 10px", color: "#64748b", fontSize: "11px", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {log.previous_value || "—"}
                        </td>
                        <td style={{ padding: "8px 10px", color: "#062051", fontSize: "11px", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {log.new_value || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
              <button type="button" className="btn btn-primary" onClick={() => setShowAuditLogModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: STUDENT TICKET HISTORY ────────────────────────────────── */}
      {showHistoryModal && selectedStudentHistory.student && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(6,32,81,0.65)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 100 }} onClick={() => setShowHistoryModal(false)}>
          <div className="glass-card animate-fade-in" style={{ maxWidth: "600px", width: "100%", padding: "24px 20px", background: "#ffffff", maxHeight: "80vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
              <div>
                <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#062051" }}>Student Ticket History</h3>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  {selectedStudentHistory.student.name} ({selectedStudentHistory.student.enrollment_no})
                </span>
              </div>
              <button onClick={() => setShowHistoryModal(false)} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>&times;</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {selectedStudentHistory.tickets.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>No tickets filed by this student yet.</div>
              ) : (
                selectedStudentHistory.tickets.map((t) => (
                  <div key={t.id || t.ticket_id} style={{ padding: "10px 12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <strong style={{ fontSize: "12.5px", color: "#062051" }}>{t.ticket_id || t.id}</strong>
                      <span className="badge badge-primary" style={{ fontSize: "10px" }}>{t.status}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#334155" }}>{t.query_text || t.description}</div>
                    {t.faculty_reply && (
                      <div style={{ marginTop: "6px", fontSize: "11.5px", color: "#059669", background: "#ecfdf5", padding: "6px 8px", borderRadius: "4px" }}>
                        <strong>Reply:</strong> {t.faculty_reply}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: CREATE KB ARTICLE ─────────────────────────────────────── */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(6,32,81,0.65)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 100 }} onClick={() => setShowAddModal(false)}>
          <div className="glass-card animate-fade-in" style={{ maxWidth: "580px", width: "100%", padding: "24px 20px", background: "#ffffff" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#062051" }}>Create Knowledge Article</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>&times;</button>
            </div>

            <form onSubmit={handleCreateArticle} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "11.5px", fontWeight: 700 }}>Department</label>
                <select className="input-field" value={newArticle.dept_id} onChange={(e) => setNewArticle({ ...newArticle, dept_id: e.target.value })}>
                  {superDepts.map((d) => (
                    <option key={d.id || d.dept_id} value={d.code || d.dept_id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "11.5px", fontWeight: 700 }}>Article Title *</label>
                <input type="text" className="input-field" placeholder="e.g. Winter 2026 Examination Notice" value={newArticle.title} onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })} required />
              </div>

              <div>
                <label style={{ fontSize: "11.5px", fontWeight: 700 }}>Common Student Query *</label>
                <input type="text" className="input-field" placeholder="e.g. When will Semester 1 exams start?" value={newArticle.question} onChange={(e) => setNewArticle({ ...newArticle, question: e.target.value })} required />
              </div>

              <div>
                <label style={{ fontSize: "11.5px", fontWeight: 700 }}>Authoritative Resolution / Answer *</label>
                <textarea className="input-field" style={{ minHeight: "90px", resize: "none" }} placeholder="Grounded official resolution..." value={newArticle.answer} onChange={(e) => setNewArticle({ ...newArticle, answer: e.target.value })} required />
              </div>

              <div>
                <label style={{ fontSize: "11.5px", fontWeight: 700 }}>Source Citation</label>
                <input type="text" className="input-field" placeholder="Circular #SOU/EXAM/2026/02" value={newArticle.source} onChange={(e) => setNewArticle({ ...newArticle, source: e.target.value })} />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "10px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish to Knowledge Base</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

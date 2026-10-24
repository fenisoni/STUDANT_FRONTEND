const PROD_RENDER_URL = "https://silver-oak-university-ai-student-help.onrender.com";
const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
const RAW_URL = import.meta.env.VITE_API_URL || (isLocal ? "" : PROD_RENDER_URL);
export const API_BASE = RAW_URL ? `${RAW_URL.replace(/\/$/, "")}/api` : "/api";

function getHeaders(isFormData = false) {
  const token = localStorage.getItem("token");
  const headers = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function fetchWithAuth(url, options = {}) {
  const headers = getHeaders(options.isFormData);
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {})
      }
    });
    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Allow current execution to complete gracefully
    }
    return res;
  } catch (err) {
    return { ok: false, json: async () => [] };
  }
}

export const api = {
  // Auth
  async login(identifier, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, email: identifier, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Login failed" }));
      throw new Error(err.detail || "Login failed");
    }
    return res.json();
  },

  async changeTemporaryPassword(payload) {
    const res = await fetchWithAuth(`${API_BASE}/auth/faculty/change-temporary-password`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to update temporary password" }));
      throw new Error(err.detail || "Failed to update temporary password");
    }
    return res.json();
  },

  async facultyChangePassword(old_password, new_password) {
    const payload = (typeof old_password === "object" && old_password !== null)
      ? {
          old_password: old_password.old_password || old_password.current_password,
          new_password: old_password.new_password,
        }
      : { old_password, new_password };
    const res = await fetchWithAuth(`${API_BASE}/auth/faculty/change-password`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to change password" }));
      throw new Error(err.detail || "Failed to change password");
    }
    return res.json();
  },

  async facultyForgotSendOtp(identifier) {
    return this.forgotPasswordSendOtp(identifier);
  },

  async forgotPasswordSendOtp(identifier) {
    const res = await fetch(`${API_BASE}/auth/forgot-password/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to send reset code" }));
      throw new Error(err.detail || "Failed to send reset code");
    }
    return res.json();
  },

  async facultyForgotReset(identifier, otp, new_password) {
    return this.forgotPasswordReset(identifier, otp, new_password);
  },

  async forgotPasswordReset(identifier, otp, new_password) {
    const res = await fetch(`${API_BASE}/auth/forgot-password/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, otp, new_password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to reset password" }));
      throw new Error(err.detail || "Failed to reset password");
    }
    return res.json();
  },

  async getFacultyProfile() {
    const res = await fetchWithAuth(`${API_BASE}/auth/faculty/me`);
    if (!res.ok) return null;
    return res.json();
  },

  async getDemoUsers() {
    try {
      const res = await fetch(`${API_BASE}/auth/demo-users`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  async sendRegistrationOtp(email) {
    const res = await fetch(`${API_BASE}/auth/register/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to send OTP" }));
      throw new Error(err.detail || "Failed to send OTP");
    }
    return res.json();
  },

  async registerStudent(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Registration failed" }));
      throw new Error(err.detail || "Registration failed");
    }
    return res.json();
  },

  async getMe() {
    const res = await fetchWithAuth(`${API_BASE}/auth/me`);
    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
  },

  // Chat
  async sendMessage(message, sessionId = null) {
    const res = await fetchWithAuth(`${API_BASE}/chat/message`, {
      method: "POST",
      body: JSON.stringify({ message, session_id: sessionId }),
    });
    if (!res.ok) throw new Error("Chat request failed");
    return res.json();
  },

  async getChatHistory(sessionId = null) {
    const url = sessionId
      ? `${API_BASE}/chat/history?session_id=${sessionId}`
      : `${API_BASE}/chat/history`;
    const res = await fetchWithAuth(url);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  },

  async submitFeedback(chatId, feedback) {
    const res = await fetchWithAuth(`${API_BASE}/chat/feedback`, {
      method: "POST",
      body: JSON.stringify({ chat_id: chatId, feedback }),
    });
    return res.json();
  },

  async escalateTicket(message, sessionId = null, deptId = null) {
    const res = await fetchWithAuth(`${API_BASE}/chat/escalate`, {
      method: "POST",
      body: JSON.stringify({ message, session_id: sessionId, dept_id: deptId }),
    });
    return res.json();
  },

  async getSuggestedQueries() {
    try {
      const res = await fetch(`${API_BASE}/chat/suggested-queries`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  // Tickets
  async getMyTickets() {
    const res = await fetchWithAuth(`${API_BASE}/tickets/my`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  },

  async getAssignedTickets(statusFilter = "All") {
    const res = await fetchWithAuth(`${API_BASE}/tickets/assigned?status_filter=${statusFilter}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  },

  async replyTicket(ticketId, replyText, status = "Resolved", deptId = null) {
    const payload = (typeof replyText === "object" && replyText !== null)
      ? replyText
      : { reply_text: replyText, status, dept_id: deptId };
    const res = await fetchWithAuth(`${API_BASE}/tickets/${ticketId}/reply`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async reassignTicket(ticketId, deptId, facultyId = null, notes = "") {
    const res = await fetchWithAuth(`${API_BASE}/tickets/${ticketId}/reassign`, {
      method: "POST",
      body: JSON.stringify({ dept_id: deptId, assigned_faculty_id: facultyId, notes: notes }),
    });
    return res.json();
  },

  async suggestDepartments(query) {
    const res = await fetchWithAuth(`${API_BASE}/tickets/suggest-departments`, {
      method: "POST",
      body: JSON.stringify({ query }),
    });
    if (!res.ok) {
      return { detected_departments: [], detected_issues: [], confidence: 0.5 };
    }
    return res.json();
  },

  async createMultiDeptTicket(data) {
    const res = await fetchWithAuth(`${API_BASE}/tickets/create-multi`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to create ticket" }));
      throw new Error(err.detail || "Failed to create ticket");
    }
    return res.json();
  },

  async createStudentTicket(data) {
    const res = await fetchWithAuth(`${API_BASE}/tickets/create`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to create ticket" }));
      throw new Error(err.detail || "Failed to create ticket");
    }
    return res.json();
  },

  async reassignFaculty(ticketId, deptId, newFacultyId, reason = "") {
    const payload = (typeof deptId === "object" && deptId !== null)
      ? deptId
      : { dept_id: deptId, new_faculty_id: newFacultyId, reason };
    const res = await fetchWithAuth(`${API_BASE}/tickets/${ticketId}/reassign-faculty`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to reassign faculty" }));
      throw new Error(err.detail || "Failed to reassign faculty");
    }
    return res.json();
  },

  async getTicket(ticketId) {
    const res = await fetchWithAuth(`${API_BASE}/tickets/${ticketId}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to fetch ticket" }));
      throw new Error(err.detail || "Failed to fetch ticket");
    }
    return res.json();
  },

  // Knowledge Base
  async getKB(query = "", deptId = "All") {
    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (deptId && deptId !== "All") params.append("dept_id", deptId);
    const res = await fetchWithAuth(`${API_BASE}/kb?${params.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  },

  async createKB(data) {
    const res = await fetchWithAuth(`${API_BASE}/kb`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateKB(kbId, data) {
    const res = await fetchWithAuth(`${API_BASE}/kb/${kbId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteKB(kbId) {
    const res = await fetchWithAuth(`${API_BASE}/kb/${kbId}`, {
      method: "DELETE",
    });
    return res.json();
  },

  async uploadKBDoc(formData) {
    const res = await fetchWithAuth(`${API_BASE}/kb/upload-doc`, {
      method: "POST",
      body: formData,
      isFormData: true,
    });
    return res.json();
  },

  // Departments
  async getDepartments() {
    try {
      const res = await fetch(`${API_BASE}/tickets/departments`);
      if (!res.ok) return { departments: [], faculty: [] };
      return res.json();
    } catch {
      return { departments: [], faculty: [] };
    }
  },

  async getDepartmentFaculty(deptId) {
    try {
      const res = await fetch(`${API_BASE}/tickets/departments/${deptId}/faculty`);
      if (!res.ok) return { department: null, hod: null, faculty: [] };
      return res.json();
    } catch {
      return { department: null, hod: null, faculty: [] };
    }
  },

  // Admin Analytics & Learning
  async getAdminAnalytics() {
    const res = await fetchWithAuth(`${API_BASE}/admin/analytics`);
    return res.json();
  },

  async getKBCandidates(status = "Pending") {
    const res = await fetchWithAuth(`${API_BASE}/admin/candidates?status=${status}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  },

  async getAdminCandidates(status = "Pending") {
    return this.getKBCandidates(status);
  },

  async reviewCandidate(candidateId, action, editedAnswer = null, deptId = null, title = null, source = null) {
    const res = await fetchWithAuth(`${API_BASE}/admin/candidates/${candidateId}/review`, {
      method: "POST",
      body: JSON.stringify({
        action,
        edited_answer: editedAnswer,
        dept_id: deptId,
        title,
        source,
      }),
    });
    return res.json();
  },

  async getAdminUsers() {
    const res = await fetchWithAuth(`${API_BASE}/admin/users`);
    return res.json();
  },

  async getNotifications(limit = 50) {
    const res = await fetchWithAuth(`${API_BASE}/admin/notifications?limit=${limit}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  },

  async getKBStats() {
    const res = await fetchWithAuth(`${API_BASE}/admin/kb-stats`);
    return res.json();
  },

  async reseedKB() {
    const res = await fetchWithAuth(`${API_BASE}/admin/reseed-kb`, { method: "POST" });
    return res.json();
  },

  // ─── Student Self-Registration ──────────────────────────────────────────────
  async sendRegistrationOTP(email) {
    const res = await fetch(`${API_BASE}/auth/register/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to send verification code" }));
      throw new Error(err.detail || "Failed to send verification code");
    }
    return res.json();
  },

  // ─── Super Admin & Semester Progression ───────────────────────────────────
  async advanceSemesters() {
    const res = await fetchWithAuth(`${API_BASE}/super-admin/scheduler/advance-semesters`, {
      method: "POST",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Scheduler run failed" }));
      throw new Error(err.detail || "Scheduler run failed");
    }
    return res.json();
  },

  async updateStudentSemester(studentId, semester) {
    const res = await fetchWithAuth(`${API_BASE}/super-admin/students/${studentId}/semester`, {
      method: "PUT",
      body: JSON.stringify({ current_semester: semester }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Semester update failed" }));
      throw new Error(err.detail || "Semester update failed");
    }
    return res.json();
  },

  async getSuperAdminStudents(search = "", deptId = "") {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (deptId && deptId !== "All") params.append("dept_id", deptId);
    const res = await fetchWithAuth(`${API_BASE}/super-admin/students?${params.toString()}`);
    if (!res.ok) return [];
    return res.json();
  },

  async createSuperAdminStudent(data) {
    const res = await fetchWithAuth(`${API_BASE}/super-admin/students`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to create student" }));
      throw new Error(err.detail || "Failed to create student");
    }
    return res.json();
  },

  async updateSuperAdminStudent(studentId, data) {
    const res = await fetchWithAuth(`${API_BASE}/super-admin/students/${studentId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteSuperAdminStudent(studentId) {
    const res = await fetchWithAuth(`${API_BASE}/super-admin/students/${studentId}`, {
      method: "DELETE",
    });
    return res.json();
  },

  async getStudentTicketHistory(studentId) {
    const res = await fetchWithAuth(`${API_BASE}/super-admin/students/${studentId}/history`);
    if (!res.ok) return [];
    return res.json();
  },

  async getSuperAdminFaculty() {
    const res = await fetchWithAuth(`${API_BASE}/super-admin/faculty`);
    if (!res.ok) return [];
    return res.json();
  },

  async createSuperAdminFaculty(data) {
    const res = await fetchWithAuth(`${API_BASE}/super-admin/faculty`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to create faculty member" }));
      throw new Error(err.detail || "Failed to create faculty member");
    }
    return res.json();
  },

  async updateSuperAdminFaculty(facultyId, data) {
    const res = await fetchWithAuth(`${API_BASE}/super-admin/faculty/${facultyId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateSuperAdminFacultyStatus(facultyId, payload) {
    const res = await fetchWithAuth(`${API_BASE}/super-admin/faculty/${encodeURIComponent(facultyId)}/status`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to update faculty status" }));
      throw new Error(err.detail || "Failed to update faculty status");
    }
    return res.json();
  },

  async resetSuperAdminFacultyPassword(facultyId, temporary_password = "") {
    const res = await fetchWithAuth(`${API_BASE}/super-admin/faculty/${encodeURIComponent(facultyId)}/reset-password`, {
      method: "POST",
      body: JSON.stringify({ temporary_password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to reset password" }));
      throw new Error(err.detail || "Failed to reset password");
    }
    return res.json();
  },

  async reassignSuperAdminFacultyTickets(facultyId, target_faculty_id, reason = "") {
    const res = await fetchWithAuth(`${API_BASE}/super-admin/faculty/${encodeURIComponent(facultyId)}/reassign-active-tickets`, {
      method: "POST",
      body: JSON.stringify({ target_faculty_id, reason }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to reassign tickets" }));
      throw new Error(err.detail || "Failed to reassign tickets");
    }
    return res.json();
  },

  async getFacultyAuditLogs(target_faculty_id = "") {
    const url = target_faculty_id
      ? `${API_BASE}/super-admin/faculty-audit-log?target_faculty_id=${encodeURIComponent(target_faculty_id)}`
      : `${API_BASE}/super-admin/faculty-audit-log`;
    const res = await fetchWithAuth(url);
    if (!res.ok) return [];
    return res.json();
  },

  async getSuperAdminDepartments() {
    const res = await fetchWithAuth(`${API_BASE}/super-admin/departments`);
    if (!res.ok) return [];
    return res.json();
  },

  async createSuperAdminDepartment(data) {
    const res = await fetchWithAuth(`${API_BASE}/super-admin/departments`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateSuperAdminDepartment(deptId, data) {
    const res = await fetchWithAuth(`${API_BASE}/super-admin/departments/${deptId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getSystemSettings() {
    const res = await fetchWithAuth(`${API_BASE}/super-admin/settings`);
    if (!res.ok) return {};
    return res.json();
  },

  async updateSystemSettings(data) {
    const res = await fetchWithAuth(`${API_BASE}/super-admin/settings`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getAllSystemTickets(status = "All", deptId = "All") {
    const params = new URLSearchParams();
    if (status && status !== "All") params.append("status", status);
    if (deptId && deptId !== "All") params.append("dept_id", deptId);
    const res = await fetchWithAuth(`${API_BASE}/super-admin/tickets?${params.toString()}`);
    if (!res.ok) return [];
    return res.json();
  },

  // ─── ERP & Super Student ──────────────────────────────────────────────────
  async getERPSummary() {
    const res = await fetchWithAuth(`${API_BASE}/erp/student/summary`);
    if (!res.ok) return null;
    return res.json();
  },

  async getERPBriefing() {
    const res = await fetchWithAuth(`${API_BASE}/erp/student/briefing`);
    if (!res.ok) return null;
    return res.json();
  },

  async getERPTimetable(day = null) {
    const url = day ? `${API_BASE}/erp/student/timetable?day=${encodeURIComponent(day)}` : `${API_BASE}/erp/student/timetable`;
    const res = await fetchWithAuth(url);
    if (!res.ok) return [];
    return res.json();
  },

  async getERPCourses() {
    const res = await fetchWithAuth(`${API_BASE}/erp/student/courses`);
    if (!res.ok) return [];
    return res.json();
  },

  async getERPMarks() {
    const res = await fetchWithAuth(`${API_BASE}/erp/student/marks`);
    if (!res.ok) return [];
    return res.json();
  },

  async getERPAttendance() {
    const res = await fetchWithAuth(`${API_BASE}/erp/student/attendance`);
    if (!res.ok) return null;
    return res.json();
  },

  async qrCheckin() {
    const res = await fetchWithAuth(`${API_BASE}/erp/student/attendance/qr-checkin`, {
      method: "POST",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "QR check-in failed" }));
      throw new Error(err.detail || "QR check-in failed");
    }
    return res.json();
  },

  async smartCheckin(payload = {}) {
    const res = await fetchWithAuth(`${API_BASE}/erp/student/attendance/smart-checkin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Smart Check-in failed" }));
      throw new Error(err.detail || "Smart Check-in failed");
    }
    return res.json();
  },

  async smartCheckout(payload = {}) {
    const res = await fetchWithAuth(`${API_BASE}/erp/student/attendance/smart-checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Smart Check-out failed" }));
      throw new Error(err.detail || "Smart Check-out failed");
    }
    return res.json();
  },

  async getAttendanceLogs() {
    const res = await fetchWithAuth(`${API_BASE}/erp/student/attendance/logs`);
    if (!res.ok) return [];
    return res.json();
  },

  async getAttendanceAnalytics() {
    const res = await fetchWithAuth(`${API_BASE}/erp/student/attendance/analytics`);
    if (!res.ok) return null;
    return res.json();
  },

  async applyLeave(payload) {
    const res = await fetchWithAuth(`${API_BASE}/erp/student/leaves/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to submit leave application" }));
      throw new Error(err.detail || "Failed to submit leave application");
    }
    return res.json();
  },

  async getStudentLeaves() {
    const res = await fetchWithAuth(`${API_BASE}/erp/student/leaves`);
    if (!res.ok) return [];
    return res.json();
  },

  async getAllAdminLeaves() {
    const res = await fetchWithAuth(`${API_BASE}/erp/admin/leaves`);
    if (!res.ok) return [];
    return res.json();
  },

  async reviewLeave(leaveId, payload) {
    const res = await fetchWithAuth(`${API_BASE}/erp/admin/leaves/${leaveId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to review leave application" }));
      throw new Error(err.detail || "Failed to review leave application");
    }
    return res.json();
  },

  async getERPFees() {
    const res = await fetchWithAuth(`${API_BASE}/erp/student/fees`);
    if (!res.ok) return null;
    return res.json();
  },

  async getERPMaterials() {
    const res = await fetchWithAuth(`${API_BASE}/erp/student/materials`);
    if (!res.ok) return [];
    return res.json();
  },

  async getERPExams() {
    const res = await fetchWithAuth(`${API_BASE}/erp/student/exams`);
    if (!res.ok) return null;
    return res.json();
  },

  async syncERP() {
    const res = await fetchWithAuth(`${API_BASE}/erp/student/sync`, {
      method: "POST",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "ERP sync failed" }));
      throw new Error(err.detail || "ERP sync failed");
    }
    return res.json();
  },

  // ─── v3 Enterprise Capabilities ──────────────────────────────────────────
  async getV3SystemInfo() {
    try {
      const res = await fetch(`${API_BASE}/v3/system/info`);
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  },

  async getV3AcademicRisk(studentId = "STU-001") {
    const res = await fetchWithAuth(`${API_BASE}/v3/academic-risk/${encodeURIComponent(studentId)}`);
    if (!res.ok) return null;
    return res.json();
  },

  async getV3HallTicket(studentId = "STU-001") {
    const res = await fetchWithAuth(`${API_BASE}/v3/hall-ticket/${encodeURIComponent(studentId)}`);
    if (!res.ok) return null;
    return res.json();
  },

  async processV3Multilingual(query) {
    const res = await fetch(`${API_BASE}/v3/ai/multilingual-query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) return null;
    return res.json();
  },

  async getV3Announcements() {
    try {
      const res = await fetch(`${API_BASE}/v3/announcements`);
      if (!res.ok) return { announcements: [] };
      return res.json();
    } catch {
      return { announcements: [] };
    }
  },

  // ─── Google Classroom Live Integration ────────────────────────────────────
  async getClassroomStatus() {
    const res = await fetchWithAuth(`${API_BASE}/classroom/status`);
    if (!res.ok) return null;
    return res.json();
  },

  async getClassroomFeed() {
    const res = await fetchWithAuth(`${API_BASE}/classroom/feed`);
    if (!res.ok) return { courses: [], assignments: [], announcements: [] };
    return res.json();
  },

  async syncClassroom() {
    const res = await fetchWithAuth(`${API_BASE}/classroom/sync`, { method: "POST" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Classroom sync failed" }));
      throw new Error(err.detail || "Classroom sync failed");
    }
    return res.json();
  },

  async connectClassroom(google_email) {
    const res = await fetchWithAuth(`${API_BASE}/classroom/connect`, {
      method: "POST",
      body: JSON.stringify({ google_email }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to connect Google account" }));
      throw new Error(err.detail || "Failed to connect Google account");
    }
    return res.json();
  },
};

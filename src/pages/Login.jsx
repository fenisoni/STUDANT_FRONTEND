import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import {
  Sparkles,
  Shield,
  User,
  Key,
  ArrowRight,
  BookOpen,
  Clock,
  HelpCircle,
  X,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Building,
  Award,
  Mail,
  UserPlus,
  Send,
  Calendar,
  Hash
} from "lucide-react";

export default function Login({ onBackToLanding }) {
  const { login, loading } = useAuth();
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState("student"); // 'student' | 'faculty' | 'admin'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("2005-05-02");
  const [error, setError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [forgotDemoOtp, setForgotDemoOtp] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  const demoAccounts = [
    { label: "Student", email: "student@silveroak.edu.in", pwd: "password123", roleKey: "student" },
    { label: "Admin", email: "admin@silveroak.edu.in", pwd: "password123", roleKey: "admin" },
    { label: "Faculty", email: "faculty.ca2@silveroak.edu.in", pwd: "password123", roleKey: "faculty" },
    { label: "HOD", email: "hod.ca@silveroak.edu.in", pwd: "password123", roleKey: "faculty" },
    { label: "HOI", email: "hoi.socca@silveroak.edu.in", pwd: "password123", roleKey: "faculty" },
    { label: "Super Admin", email: "superadmin@silveroak.edu.in", pwd: "password123", roleKey: "admin" },
  ];

  // Student Self-Registration State
  const [regEmail, setRegEmail] = useState("");
  const [regOtp, setRegOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEnrollment, setRegEnrollment] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regProgramme, setRegProgramme] = useState("BCA");
  const [regDept, setRegDept] = useState("DEPT_CA");
  const [regSemester, setRegSemester] = useState(1);
  const [regAdmissionDate, setRegAdmissionDate] = useState("2024-07-01");
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState("");

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || "Invalid credentials");
    }
  };

  const handleQuickDemoLogin = async (acc) => {
    setEmail(acc.email);
    setPassword(acc.pwd);
    setSelectedRole(acc.roleKey);
    setError("");
    try {
      await login(acc.email, acc.pwd);
    } catch (err) {
      setError(err.message || "Quick sign-in failed. Please retry.");
    }
  };


  const calculateSemesterFromDate = (dateStr) => {
    if (!dateStr) return 1;
    const adm = new Date(dateStr);
    const now = new Date();
    const diffMonths = (now.getFullYear() - adm.getFullYear()) * 12 + (now.getMonth() - adm.getMonth());
    const sem = Math.max(1, Math.min(8, Math.floor(diffMonths / 6) + 1));
    return sem;
  };

  const handleAdmissionDateChange = (val) => {
    setRegAdmissionDate(val);
    const calculatedSem = calculateSemesterFromDate(val);
    setRegSemester(calculatedSem);
  };

  const handleSendOtp = async (e) => {
    e?.preventDefault?.();
    setError("");
    setRegSuccess("");
    if (!regEmail.includes("@")) {
      setError("Please enter a valid institutional student email.");
      return;
    }
    setRegLoading(true);
    try {
      const res = await api.sendRegistrationOtp(regEmail.trim());
      setOtpSent(true);
      setDemoOtp(res.demo_otp || res.otp_for_testing || "");
      setRegSuccess(res.message || "OTP sent to student email!");
    } catch (err) {
      setError(err.message || "Failed to send verification OTP");
    } finally {
      setRegLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e?.preventDefault?.();
    setError("");
    setRegSuccess("");
    if (!regOtp || regOtp.trim().length !== 6) {
      setError("Please enter the 6-digit OTP sent to your email.");
      return;
    }
    if (!regName.trim() || !regEnrollment.trim() || !regPassword) {
      setError("Please fill out all required student profile fields.");
      return;
    }
    setRegLoading(true);
    try {
      const res = await api.registerStudent({
        email: regEmail.trim(),
        otp: regOtp.trim(),
        name: regName.trim(),
        enrollment_no: regEnrollment.trim(),
        password: regPassword,
        programme: regProgramme,
        department_id: regDept,
        admission_date: regAdmissionDate,
        current_semester: parseInt(regSemester) || 1,
      });
      setRegSuccess("Account created successfully! Signing in...");
      setTimeout(async () => {
        try {
          await login(regEmail.trim(), regPassword);
        } catch (loginErr) {
          setAuthMode("login");
          setEmail(regEmail.trim());
          setPassword(regPassword);
        }
      }, 1200);
    } catch (err) {
      setError(err.message || "Registration failed. Please check OTP or enrollment details.");
    } finally {
      setRegLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    await handleForgotSendOtp(e);
  };

  const handleForgotSendOtp = async (e) => {
    e?.preventDefault?.();
    setForgotError("");
    const idToUse = forgotEmail || email;
    if (!idToUse.trim()) {
      setForgotError("Please enter your University Email, Enrollment No, or ID.");
      return;
    }
    setForgotLoading(true);
    try {
      const res = await api.forgotPasswordSendOtp(idToUse.trim());
      setForgotStep(2);
      if (res.demo_otp) {
        setForgotDemoOtp(res.demo_otp);
      }
    } catch (err) {
      setForgotError(err.message || "Failed to dispatch verification code.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotResetPassword = async (e) => {
    e?.preventDefault?.();
    setForgotError("");
    if (!forgotOtp.trim()) {
      setForgotError("Please enter the 6-digit verification code.");
      return;
    }
    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      setForgotError("New password must be at least 6 characters.");
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError("Passwords do not match.");
      return;
    }
    setForgotLoading(true);
    try {
      const idToUse = forgotEmail || email;
      await api.forgotPasswordReset(idToUse.trim(), forgotOtp.trim(), forgotNewPassword);
      setForgotSuccess("Password reset successfully! You can now log in.");
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep(1);
        setEmail(idToUse);
        setPassword(forgotNewPassword);
        setForgotSuccess("");
      }, 2000);
    } catch (err) {
      setForgotError(err.message || "Failed to reset password.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f4f7fb",
      }}
    >
      {/* Top Academic Header (matches silveroakuni.ac.in branding) */}
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "12px 28px",
          boxShadow: "0 2px 8px rgba(6, 32, 81, 0.05)",
        }}
      >
        <div
          style={{
            maxWidth: "1250px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {/* Official SOU & NAAC Logos */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/silver_oak_logo.svg"
              alt="Silver Oak University"
              style={{ height: "38px", width: "auto" }}
            />
            <div
              style={{
                width: "2px",
                height: "30px",
                backgroundColor: "#8a1610",
                margin: "0 10px",
                opacity: 0.85,
              }}
            />
            <img
              src="/naac_logo.svg"
              alt="NAAC A+ Accredited"
              style={{ height: "32px", width: "auto" }}
            />
            <div className="hide-on-mobile" style={{ marginLeft: "14px", borderLeft: "1px solid #e2e8f0", paddingLeft: "14px" }}>
              <div style={{ fontWeight: 800, fontSize: "14px", color: "#062051" }}>
                SILVER OAK COLLEGE OF COMPUTER APPLICATION
              </div>
              <div style={{ fontSize: "11.5px", color: "#64748b" }}>
                M.Sc. IT &bull; Course: IOM5091C &bull; Semester 01
              </div>
            </div>
            <div className="show-on-mobile" style={{ marginLeft: "8px" }}>
              <span className="badge badge-gold" style={{ fontSize: "10px", padding: "2px 6px" }}>SOCA Portal</span>
            </div>
          </div>

          {/* SOU Motto & Accreditations */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {onBackToLanding && (
              <button
                type="button"
                onClick={onBackToLanding}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: "8px", fontWeight: 700, fontSize: "12px" }}
              >
                &larr; Back to Overview
              </button>
            )}
            <div className="hide-on-mobile" style={{ textAlign: "right" }}>
              <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#8a1610", fontStyle: "italic" }}>
                ज्ञानं परमं भूषणम् (Knowledge is the highest virtue)
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                Declared State Private University under Gujarat Act No. 7 of 2009
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Login Workspace */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 14px",
        }}
      >
        <div
          className="responsive-2col"
          style={{
            maxWidth: "1120px",
            width: "100%",
            alignItems: "center",
          }}
        >
          {/* Left Column: Academic Program Overview & Features */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "999px",
                background: "#fefce8",
                border: "1px solid #fef08a",
                width: "fit-content",
                marginBottom: "14px",
              }}
            >
              <Award size={14} color="#c59b27" />
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#854d0e",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Silver Oak University &bull; Academic Year 2026-27
              </span>
            </div>

            <h1
              style={{
                fontSize: "34px",
                fontWeight: 800,
                lineHeight: 1.25,
                letterSpacing: "-0.5px",
                color: "#062051",
                marginBottom: "12px",
              }}
            >
              Cloud-Based Multi-Agent <br />
              <span style={{ color: "#c59b27" }}>
                AI Student Help Desk Portal
              </span>
            </h1>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "18px" }}>
              <span className="badge badge-primary" style={{ fontSize: "11.5px" }}>
                Silver Oak College of Computer Application (SOCA)
              </span>
              <span className="badge badge-gold" style={{ fontSize: "11.5px" }}>
                Course Code: IOM5091C
              </span>
              <span className="badge badge-neutral" style={{ fontSize: "11.5px" }}>
                AI & Intelligent Systems
              </span>
            </div>

            <p
              style={{
                fontSize: "14.5px",
                color: "#475569",
                marginBottom: "24px",
                lineHeight: 1.6,
              }}
            >
              Official student support platform for Silver Oak University students, faculty, and administrators. Powered by 10 cooperating AI agents, semantic RAG search across institutional circulars, automated faculty ticket routing, and closed-loop knowledge discovery.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              <div
                className="glass-card"
                style={{
                  padding: "16px",
                  borderLeft: "4px solid #062051",
                  background: "#ffffff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <Clock size={16} color="#062051" />
                  <span style={{ fontWeight: 700, fontSize: "13.5px", color: "#062051" }}>Instant Circular Answers</span>
                </div>
                <p style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.45 }}>
                  Grounded semantic retrieval over Winter 2026 exam timetables, fee notices, MYSY scholarships, and hall tickets.
                </p>
              </div>

              <div
                className="glass-card"
                style={{
                  padding: "16px",
                  borderLeft: "4px solid #c59b27",
                  background: "#ffffff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <ShieldCheck size={16} color="#c59b27" />
                  <span style={{ fontWeight: 700, fontSize: "13.5px", color: "#062051" }}>Faculty In-The-Loop</span>
                </div>
                <p style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.45 }}>
                  Low-confidence queries (&lt;70%) automatically route to department faculty tickets with live tracking IDs.
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                fontSize: "11.5px",
                color: "#64748b",
                borderTop: "1px solid #e2e8f0",
                paddingTop: "16px",
              }}
            >
              <span>&bull; UGC Approved</span>
              <span>&bull; NAAC A+ Accredited</span>
              <span>&bull; 25,000+ Students</span>
              <span>&bull; 150+ Programmes</span>
            </div>
          </div>

          {/* Right Column: Institutional Sign-In Card (Positioned first on mobile via CSS order) */}
          <div
            className="glass-card login-card-container"
            style={{
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              background: "#ffffff",
              borderTop: "4px solid #062051",
              boxShadow: "0 10px 30px -5px rgba(6, 32, 81, 0.12)",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#062051" }}>
                  Institutional Sign In
                </h2>
                <span className="badge badge-primary" style={{ fontSize: "10.5px" }}>
                  SOU Portal
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "3px" }}>
                Select your institutional role to access the help desk system
              </p>
            </div>

            {/* Auth Mode Toggle: Sign In vs Student Self-Registration */}
            <div
              style={{
                display: "flex",
                gap: "6px",
                background: "#f1f5f9",
                padding: "4px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <button
                type="button"
                onClick={() => { setAuthMode("login"); setError(""); setRegSuccess(""); }}
                style={{
                  flex: 1,
                  padding: "9px 12px",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: authMode === "login" ? "#062051" : "transparent",
                  color: authMode === "login" ? "#ffffff" : "#475569",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  boxShadow: authMode === "login" ? "0 2px 6px rgba(6, 32, 81, 0.2)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                <Key size={14} /> Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode("register"); setError(""); setRegSuccess(""); }}
                style={{
                  flex: 1,
                  padding: "9px 12px",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: authMode === "register" ? "#c59b27" : "transparent",
                  color: authMode === "register" ? "#062051" : "#475569",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  boxShadow: authMode === "register" ? "0 2px 6px rgba(197, 155, 39, 0.3)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                <UserPlus size={14} /> Student Registration
              </button>
            </div>

            {error && (
              <div
                className="badge badge-danger"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  justifyContent: "flex-start",
                  fontSize: "12px",
                }}
              >
                {error}
              </div>
            )}

            {regSuccess && (
              <div
                className="badge badge-success"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  justifyContent: "flex-start",
                  fontSize: "12px",
                  background: "#dcfce7",
                  color: "#166534",
                  border: "1px solid #bbf7d0",
                }}
              >
                <CheckCircle2 size={15} style={{ marginRight: "6px", flexShrink: 0 }} />
                {regSuccess}
              </div>
            )}

            {authMode === "login" ? (
              <>
                {/* Role Selector Tabs (PRD Section 13 Screen 1) */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 800,
                      marginBottom: "6px",
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Select Role
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "6px",
                      background: "#f1f5f9",
                      padding: "4px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    {[
                      { id: "student", label: "Student", icon: GraduationCap },
                      { id: "faculty", label: "Faculty", icon: Briefcase },
                      { id: "admin", label: "Admin", icon: ShieldCheck },
                    ].map((r) => {
                      const Icon = r.icon;
                      const isSelected = selectedRole === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => handleRoleSelect(r.id)}
                          style={{
                            padding: "8px 10px",
                            fontSize: "12.5px",
                            fontWeight: 700,
                            borderRadius: "6px",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            background: isSelected ? "#062051" : "transparent",
                            color: isSelected ? "#ffffff" : "#475569",
                            boxShadow: isSelected ? "0 2px 6px rgba(6, 32, 81, 0.2)" : "none",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <Icon size={14} />
                          {r.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: 700,
                        marginBottom: "6px",
                        color: "#062051",
                      }}
                    >
                      {selectedRole === "faculty"
                        ? "University Email OR Faculty ID"
                        : selectedRole === "admin"
                        ? "Administrator Email"
                        : "Institutional Email / Enrollment ID"}
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder={
                        selectedRole === "faculty"
                          ? "rahul.ca@silveroakuni.ac.in or FAC-CA-001"
                          : selectedRole === "admin"
                          ? "admin@silveroakuni.ac.in"
                          : "student@silveroak.edu.in or 20240101001"
                      }
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#062051" }}>
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#0f357e",
                          fontSize: "11.5px",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {selectedRole === "student" && (
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#062051", marginBottom: "4px" }}>
                        Date of Birth (First-time sign-in only)
                      </label>
                      <input
                        type="date"
                        className="input-field"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                      <span style={{ fontSize: "10.5px", color: "#64748b", marginTop: "2px", display: "block" }}>
                        Optional: Used to verify identity on first sign-in.
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      width: "100%",
                      padding: "12px",
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                    disabled={loading}
                  >
                    {loading ? "Verifying Credentials..." : `Sign In as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
                    <ArrowRight size={16} />
                  </button>
                </form>

                {/* 1-Click Quick Demo Logins Bar (Matches Vercel Portal) */}
                <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px dashed #e2e8f0" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#062051", display: "flex", alignItems: "center", gap: "6px" }}>
                      <ShieldCheck size={14} color="#c59b27" /> Quick Demo Logins
                    </span>
                    <span style={{ fontSize: "10.5px", color: "#64748b" }}>1-Click instant access</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {demoAccounts.map((acc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuickDemoLogin(acc)}
                        disabled={loading}
                        style={{
                          padding: "8px 6px",
                          fontSize: "12px",
                          fontWeight: 700,
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          background: "#f8fafc",
                          color: "#062051",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#eff6ff";
                          e.currentTarget.style.borderColor = "#062051";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#f8fafc";
                          e.currentTarget.style.borderColor = "#cbd5e1";
                        }}
                      >
                        {acc.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Student Self-Registration Flow */
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <GraduationCap size={15} color="#062051" />
                    <span style={{ fontWeight: 700, fontSize: "13px", color: "#062051" }}>
                      New Student Self-Registration
                    </span>
                  </div>
                  <p style={{ fontSize: "11.5px", color: "#64748b", lineHeight: 1.4 }}>
                    Enter your college student email. We will send an OTP for domain verification before activating your account.
                  </p>
                </div>

                {/* Step 1: Student Email Verification */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px", color: "#062051" }}>
                    College Student Email
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="student@silveroakuni.ac.in"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      disabled={otpSent}
                      style={{ flex: 1 }}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSendOtp}
                      disabled={regLoading || !regEmail}
                      style={{ padding: "0 14px", whiteSpace: "nowrap", fontSize: "12px" }}
                    >
                      {otpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                  </div>
                  <span style={{ fontSize: "11px", color: "#64748b", marginTop: "4px", display: "block" }}>
                    * Allowed domains: @silveroakuni.ac.in, @silveroak.edu.in
                  </span>
                </div>

                {demoOtp && (
                  <div style={{ background: "#fef9c3", border: "1px dashed #ca8a04", padding: "8px 12px", borderRadius: "6px", fontSize: "12px", color: "#854d0e" }}>
                    <strong>OTP Code for Testing:</strong> <span style={{ fontFamily: "monospace", fontSize: "14px", fontWeight: 800 }}>{demoOtp}</span>
                  </div>
                )}

                {/* Step 2: OTP & Student Profile */}
                {otpSent && (
                  <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px", color: "#062051" }}>
                        6-Digit Verification OTP *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        className="input-field"
                        placeholder="e.g. 123456"
                        value={regOtp}
                        onChange={(e) => setRegOtp(e.target.value)}
                        required
                        style={{ letterSpacing: "4px", fontWeight: 700, textAlign: "center" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, marginBottom: "4px", color: "#062051" }}>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. Feni Soni"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, marginBottom: "4px", color: "#062051" }}>
                          Enrollment No. *
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. 2024031001099"
                          value={regEnrollment}
                          onChange={(e) => setRegEnrollment(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, marginBottom: "4px", color: "#062051" }}>
                          Programme *
                        </label>
                        <select
                          className="input-field"
                          value={regProgramme}
                          onChange={(e) => setRegProgramme(e.target.value)}
                        >
                          <option value="BCA">BCA</option>
                          <option value="MCA">MCA</option>
                          <option value="B.Tech CSE">B.Tech CSE</option>
                          <option value="B.Tech IT">B.Tech IT</option>
                          <option value="BBA">BBA</option>
                          <option value="MBA">MBA</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, marginBottom: "4px", color: "#062051" }}>
                          Department *
                        </label>
                        <select
                          className="input-field"
                          value={regDept}
                          onChange={(e) => setRegDept(e.target.value)}
                        >
                          <option value="DEPT_CA">Computer Application</option>
                          <option value="DEPT_CE">Computer Engineering</option>
                          <option value="DEPT_IT">Information Technology</option>
                          <option value="DEPT_MGMT">Management Studies</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, marginBottom: "4px", color: "#062051" }}>
                          Admission Date *
                        </label>
                        <input
                          type="date"
                          className="input-field"
                          value={regAdmissionDate}
                          onChange={(e) => handleAdmissionDateChange(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, marginBottom: "4px", color: "#062051" }}>
                          Current Semester
                        </label>
                        <select
                          className="input-field"
                          value={regSemester}
                          onChange={(e) => setRegSemester(parseInt(e.target.value))}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                            <option key={s} value={s}>Semester {s}</option>
                          ))}
                        </select>
                        <span style={{ fontSize: "10.5px", color: "#64748b" }}>
                          (Auto-calc from admission date)
                        </span>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, marginBottom: "4px", color: "#062051" }}>
                        Create Password *
                      </label>
                      <input
                        type="password"
                        className="input-field"
                        placeholder="Choose a secure password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={regLoading}
                      style={{
                        padding: "12px",
                        fontSize: "13.5px",
                        fontWeight: 700,
                        marginTop: "6px",
                        background: "#c59b27",
                        color: "#062051",
                        border: "none",
                      }}
                    >
                      {regLoading ? "Registering Student Account..." : "Complete Student Registration"}
                      <ArrowRight size={16} />
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SOU Official Footer */}
      <footer
        style={{
          background: "#ffffff",
          borderTop: "1px solid #e2e8f0",
          padding: "14px 24px",
          textAlign: "center",
          fontSize: "12px",
          color: "#64748b",
        }}
      >
        <div style={{ maxWidth: "1250px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <strong>Silver Oak University</strong> &bull; Opp. Bhagwat Vidyapith, S.G. Highway, Gota, Ahmedabad - 382481, Gujarat, India
          </div>
          <div>
            College of Computer Application &bull; Course IOM5091C &bull; AI Student Help Desk
          </div>
        </div>
      </footer>

      {/* Forgot Password Modal (PRD Section 13 Screen 1) */}
      {showForgotModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(6, 32, 81, 0.6)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 100,
          }}
          onClick={() => setShowForgotModal(false)}
        >
          <div
            className="glass-card animate-fade-in"
            style={{
              maxWidth: "420px",
              width: "100%",
              padding: "24px",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              boxShadow: "0 20px 40px -10px rgba(6, 32, 81, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#062051" }}>Reset Institutional Password</h3>
              <button
                onClick={() => setShowForgotModal(false)}
                style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <div>
              {forgotSuccess ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <CheckCircle2 size={40} color="#059669" style={{ margin: "0 auto 10px" }} />
                  <h4 style={{ fontWeight: 700, fontSize: "15px", marginBottom: "4px", color: "#062051" }}>Password Reset Successful!</h4>
                  <p style={{ fontSize: "12.5px", color: "#64748b" }}>{forgotSuccess}</p>
                </div>
              ) : forgotStep === 1 ? (
                <form onSubmit={handleForgotSendOtp} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <p style={{ fontSize: "12.5px", color: "#475569" }}>
                    Enter your registered University Email, Enrollment ID, or Faculty ID. We will generate and dispatch a 6-digit verification code to your email inbox.
                  </p>
                  {forgotError && (
                    <div className="badge badge-danger" style={{ width: "100%", padding: "8px 10px", fontSize: "12px" }}>
                      {forgotError}
                    </div>
                  )}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px", color: "#062051" }}>
                      University Email / Enrollment ID / Staff ID
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="student@silveroak.edu.in or 2504030100160"
                      value={forgotEmail || email}
                      onChange={(e) => { setForgotEmail(e.target.value); setForgotError(""); }}
                      required
                    />
                  </div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => { setShowForgotModal(false); setForgotError(""); }}
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={forgotLoading}
                      style={{ flex: 1 }}
                    >
                      {forgotLoading ? "Sending OTP..." : "Send Verification OTP"}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleForgotResetPassword} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <p style={{ fontSize: "12px", color: "#475569" }}>
                    A 6-digit verification code has been dispatched to your email. Enter the code and set your new password.
                  </p>
                  {forgotDemoOtp && (
                    <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "8px 12px", borderRadius: "6px", fontSize: "11.5px", color: "#065f46" }}>
                      <strong>Verification Code:</strong> {forgotDemoOtp}
                    </div>
                  )}
                  {forgotError && (
                    <div className="badge badge-danger" style={{ width: "100%", padding: "8px 10px", fontSize: "12px" }}>
                      {forgotError}
                    </div>
                  )}
                  <div>
                    <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, marginBottom: "3px", color: "#062051" }}>
                      6-Digit Verification Code (OTP)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      className="input-field"
                      placeholder="123456"
                      value={forgotOtp}
                      onChange={(e) => { setForgotOtp(e.target.value); setForgotError(""); }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, marginBottom: "3px", color: "#062051" }}>
                      New Password (min 6 characters)
                    </label>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="••••••••"
                      value={forgotNewPassword}
                      onChange={(e) => { setForgotNewPassword(e.target.value); setForgotError(""); }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, marginBottom: "3px", color: "#062051" }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="••••••••"
                      value={forgotConfirmPassword}
                      onChange={(e) => { setForgotConfirmPassword(e.target.value); setForgotError(""); }}
                      required
                    />
                  </div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => { setForgotStep(1); setForgotError(""); }}
                      style={{ flex: 1 }}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={forgotLoading}
                      style={{ flex: 1.5 }}
                    >
                      {forgotLoading ? "Resetting..." : "Set Password"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

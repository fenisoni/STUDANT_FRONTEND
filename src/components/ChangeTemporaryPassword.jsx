import React, { useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import {
  ShieldAlert,
  Key,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Building,
  UserCheck
} from "lucide-react";

export default function ChangeTemporaryPassword() {
  const { user, updateSession, logout } = useAuth();
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showTemp, setShowTemp] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!tempPassword) {
      setError("Please enter your current temporary password.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword === tempPassword) {
      setError("New password cannot be identical to your temporary password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation password do not match.");
      return;
    }

    setLoading(true);
    try {
      const identifier = user?.faculty_id || user?.email || user?.id;
      const res = await api.changeTemporaryPassword({
        email_or_id: identifier,
        temporary_password: tempPassword,
        new_password: newPassword,
      });

      setSuccess("Password updated successfully! Redirecting to your Faculty Dashboard...");
      setTimeout(() => {
        if (res.access_token) {
          updateSession(res.access_token, res);
        } else {
          window.location.reload();
        }
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to update temporary password. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #062051 0%, #0d3b82 60%, #1e5bb8 100%)",
        color: "#1e293b",
      }}
    >
      {/* Top Header */}
      <header
        style={{
          background: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/silver_oak_logo.svg"
            alt="Silver Oak University"
            style={{ height: "36px", width: "auto" }}
          />
          <div style={{ width: "2px", height: "26px", backgroundColor: "#8a1610" }} />
          <img
            src="/naac_logo.svg"
            alt="NAAC A+ Accredited"
            style={{ height: "30px", width: "auto" }}
          />
          <div style={{ marginLeft: "6px" }}>
            <span style={{ fontWeight: 800, fontSize: "14px", color: "#062051", letterSpacing: "0.3px" }}>
              SILVER OAK UNIVERSITY
            </span>
            <div style={{ fontSize: "11px", color: "#64748b" }}>
              Academic Help Desk &bull; Faculty Onboarding Security
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          style={{
            background: "#f1f5f9",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            padding: "6px 14px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#475569",
            cursor: "pointer",
          }}
        >
          Sign Out
        </button>
      </header>

      {/* Main Container */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "520px",
            background: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 20px 45px rgba(0, 0, 0, 0.35)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            overflow: "hidden",
          }}
        >
          {/* Header Banner */}
          <div
            style={{
              background: "linear-gradient(135deg, #062051 0%, #173d7a 100%)",
              color: "#ffffff",
              padding: "24px 28px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.15)",
                border: "2px solid rgba(251, 191, 36, 0.6)",
                marginBottom: "12px",
              }}
            >
              <Key style={{ width: "28px", height: "28px", color: "#fbbf24" }} />
            </div>

            <div
              style={{
                display: "inline-block",
                background: "rgba(251, 191, 36, 0.2)",
                border: "1px solid rgba(251, 191, 36, 0.4)",
                color: "#fef3c7",
                fontSize: "11px",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "20px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              Mandatory First Login
            </div>

            <h2 style={{ margin: "0 0 6px", fontSize: "21px", fontWeight: 800, color: "#ffffff" }}>
              Change Temporary Password
            </h2>
            <p style={{ margin: 0, fontSize: "13px", color: "#cbd5e1", lineHeight: 1.5 }}>
              Your faculty account was initialized with a temporary password. You must set a permanent secure password to continue.
            </p>
          </div>

          {/* Body Content */}
          <div style={{ padding: "26px 28px" }}>
            {/* Faculty Info Card */}
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "12px 14px",
                marginBottom: "20px",
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                fontSize: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#334155" }}>
                <UserCheck size={14} style={{ color: "#0284c7" }} />
                <span><strong>Faculty:</strong> {user?.name || "Faculty Member"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#334155" }}>
                <Building size={14} style={{ color: "#059669" }} />
                <span><strong>ID:</strong> {user?.faculty_id || user?.id}</span>
              </div>
              {user?.dept_id && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b" }}>
                  <span>&bull; Dept: {user?.dept_id}</span>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#991b1b",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  color: "#166534",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                <span>{success}</span>
              </div>
            )}

            {/* Change Password Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Temporary Password */}
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>
                  Current Temporary Password <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showTemp ? "text" : "password"}
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    placeholder="Enter the temporary password provided"
                    required
                    style={{
                      width: "100%",
                      padding: "10px 40px 10px 12px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontSize: "13.5px",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowTemp(!showTemp)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      color: "#64748b",
                      cursor: "pointer",
                      padding: "4px",
                    }}
                  >
                    {showTemp ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>
                  New Permanent Password <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Choose a strong password (min 6 characters)"
                    required
                    style={{
                      width: "100%",
                      padding: "10px 40px 10px 12px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontSize: "13.5px",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      color: "#64748b",
                      cursor: "pointer",
                      padding: "4px",
                    }}
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>
                  Confirm Permanent Password <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new permanent password"
                    required
                    style={{
                      width: "100%",
                      padding: "10px 40px 10px 12px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontSize: "13.5px",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      color: "#64748b",
                      cursor: "pointer",
                      padding: "4px",
                    }}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Password Rules Checklist */}
              <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "10px 12px", fontSize: "11.5px", color: "#64748b" }}>
                <div style={{ fontWeight: 600, color: "#334155", marginBottom: "4px" }}>Password Requirements:</div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: newPassword.length >= 6 ? "#16a34a" : "#64748b" }}>
                  <CheckCircle2 size={12} /> At least 6 characters
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: (newPassword && newPassword !== tempPassword) ? "#16a34a" : "#64748b" }}>
                  <CheckCircle2 size={12} /> Different from temporary password
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: (newPassword && newPassword === confirmPassword) ? "#16a34a" : "#64748b" }}>
                  <CheckCircle2 size={12} /> Passwords match
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: "6px",
                  background: loading ? "#94a3b8" : "linear-gradient(135deg, #062051 0%, #1e5bb8 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 18px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 12px rgba(6, 32, 81, 0.25)",
                  transition: "all 0.2s",
                }}
              >
                {loading ? "Updating Security Credentials..." : "Set New Password & Enter Dashboard"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

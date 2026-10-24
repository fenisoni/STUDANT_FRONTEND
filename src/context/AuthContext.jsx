import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);

  const login = async (identifier, password) => {
    setLoading(true);
    try {
      const data = await api.login(identifier, password);
      localStorage.setItem("token", data.access_token);
      const userData = {
        id: data.user_id,
        faculty_id: data.faculty_id || data.user_id,
        name: data.name,
        email: data.email,
        role: data.role,
        dept_id: data.dept_id,
        department_id: data.department_id || data.dept_id,
        college_id: data.college_id,
        college: data.college,
        designation: data.designation,
        status: data.status,
        must_change_password: Boolean(data.must_change_password),
        programme: data.programme || (data.role === "student" ? "M.Sc. IT" : null),
        semester: data.semester || (data.role === "student" ? 1 : null),
        enrollment_no: data.enrollment_no || (data.role === "student" ? "T2604020700009" : null),
        course: data.course || "IOM5091C",
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setToken(data.access_token);
      setUser(userData);

      // Auto route to appropriate screen
      if (["admin", "super_admin", "hoi"].includes(data.role)) {
        setActiveTab("admin");
      } else if (["faculty", "hod"].includes(data.role)) {
        setActiveTab("faculty");
      } else {
        setActiveTab("dashboard");
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  const updateSession = (newToken, data) => {
    localStorage.setItem("token", newToken);
    const userData = {
      id: data.user_id || user?.id,
      faculty_id: data.faculty_id || data.user_id || user?.faculty_id,
      name: data.name || user?.name,
      email: data.email || user?.email,
      role: data.role || user?.role,
      dept_id: data.dept_id || user?.dept_id,
      department_id: data.department_id || data.dept_id || user?.department_id,
      college_id: data.college_id || user?.college_id,
      college: data.college || user?.college,
      designation: data.designation || user?.designation,
      status: data.status || user?.status,
      must_change_password: Boolean(data.must_change_password),
      programme: data.programme || user?.programme,
      semester: data.semester || user?.semester,
      enrollment_no: data.enrollment_no || user?.enrollment_no,
      course: data.course || user?.course || "IOM5091C",
    };
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const quickLogin = async (demoUser) => {
    return login(demoUser.email, demoUser.password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setActiveTab("dashboard");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        activeTab,
        setActiveTab,
        login,
        quickLogin,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      token: null,
      activeTab: "dashboard",
      setActiveTab: () => {},
      login: async () => {},
      quickLogin: async () => {},
      logout: () => {},
      loading: false,
    };
  }
  return context;
}

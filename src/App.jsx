import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import StudentDashboard from "./pages/StudentDashboard";
import ChatInterface from "./pages/ChatInterface";
import TicketHistory from "./pages/TicketHistory";
import FacultyDashboard from "./pages/FacultyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ChangeTemporaryPassword from "./components/ChangeTemporaryPassword";
import OakMitraWidget from "./components/OakMitraWidget";

function MainApp() {
  const { user, activeTab, setActiveTab, login } = useAuth();
  const [selectedChatQuery, setSelectedChatQuery] = useState("");
  const [unauthenticatedView, setUnauthenticatedView] = useState(() => {
    if (typeof window !== "undefined") {
      const hash = (window.location.hash || "").toLowerCase();
      const path = (window.location.pathname || "").toLowerCase();
      const search = (window.location.search || "").toLowerCase();
      if (hash.includes("login") || path.includes("login") || search.includes("login") || search.includes("portal")) {
        return "login";
      }
    }
    return "landing";
  });
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleQuickLoginFromLanding = async (demoKey) => {
    const credMap = {
      student: { id: "student@silveroak.edu.in", pwd: "password123" },
      faculty: { id: "faculty.ca2@silveroak.edu.in", pwd: "password123" },
      hod: { id: "hod.ca@silveroak.edu.in", pwd: "password123" },
      hoi: { id: "hoi.socca@silveroak.edu.in", pwd: "password123" },
      admin: { id: "admin@silveroak.edu.in", pwd: "password123" },
      super_admin: { id: "superadmin@silveroak.edu.in", pwd: "password123" },
    };

    const target = credMap[demoKey] || credMap.student;
    try {
      await login(target.id, target.pwd);
    } catch (err) {
      // Fallback to login form if instant login encounters network issue
      setUnauthenticatedView("login");
    }
  };

  // If user is not logged in, display Landing Page or Universal Login Portal
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", position: "relative" }}>
        {unauthenticatedView === "landing" ? (
          <LandingPage
            onLaunch={() => setUnauthenticatedView("login")}
            onQuickLogin={handleQuickLoginFromLanding}
            onOpenChat={() => setIsChatOpen(true)}
          />
        ) : (
          <Login onBackToLanding={() => setUnauthenticatedView("landing")} />
        )}
        <OakMitraWidget isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
      </div>
    );
  }

  if (user.must_change_password) {
    return <ChangeTemporaryPassword />;
  }

  const handleTileSelectQuery = (query) => {
    setSelectedChatQuery(query);
    setActiveTab("chat");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
      <Navbar />
      <main className="container-responsive" style={{ flex: 1, paddingTop: "14px", paddingBottom: "24px" }}>
        {activeTab === "dashboard" && <StudentDashboard onSelectQuery={handleTileSelectQuery} />}
        {activeTab === "chat" && <ChatInterface initialQuery={selectedChatQuery} />}
        {activeTab === "tickets" && <TicketHistory />}
        {activeTab === "faculty" && <FacultyDashboard />}
        {activeTab === "admin" && <AdminDashboard />}
      </main>

      {/* Global OakMitra Floating Assistant Widget */}
      <OakMitraWidget isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

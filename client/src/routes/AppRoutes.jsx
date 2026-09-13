import { Routes, Route } from "react-router-dom";

// Public pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import VerifyEmail from "../pages/VerifyEmail";
import Features from "../pages/Features";
import Pricing from "../pages/Pricing";
import NotFound from "../pages/NotFound";
import PublicLayout from "../components/layout/PublicLayout";

// Protected workspace pages
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import Problems from "../pages/Problems";
import ProblemDetail from "../pages/ProblemDetail";
import Notes from "../pages/Notes";
import Revision from "../pages/Revision";
import Analytics from "../pages/Analytics";
import AITools from "../pages/AITools";
import Contests from "../pages/Contests";
import GitHubAnalytics from "../pages/GitHubAnalytics";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes with Header Navbar */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Route>

      {/* Authenticated Developer Workspace Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:id" element={<ProblemDetail />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/revision" element={<Revision />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/ai-tools" element={<AITools />} />
        <Route path="/contests" element={<Contests />} />
        <Route path="/github" element={<GitHubAnalytics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
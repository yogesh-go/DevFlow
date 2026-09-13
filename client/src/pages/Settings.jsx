import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Cpu,
  RefreshCw,
  Clock,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import api from "../services/api";

function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [aiStatus, setAiStatus] = useState(null);
  const [loadingAiStatus, setLoadingAiStatus] = useState(true);

  const fetchAiStatus = async () => {
    try {
      setLoadingAiStatus(true);
      const res = await api("/ai/status");
      setAiStatus(res.data);
    } catch (err) {
      console.warn("Could not fetch AI status:", err.message);
    } finally {
      setLoadingAiStatus(false);
    }
  };

  useEffect(() => {
    fetchAiStatus();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Signed out of DevFlow workspace.");
    navigate("/login");
  };

  const isVerified = user?.isVerified !== false;

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="border-b border-[#E6E3DB] pb-5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#657858]">
          Workspace Configuration
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18181B]">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#575653] mt-1">
          Manage your account verification, security preferences, and AI engine status.
        </p>
      </div>

      {/* 1. Account & Verification Status */}
      <div className="rounded-xl border border-[#E6E3DB] bg-white p-6 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <User className="h-4 w-4 text-[#657858]" />
            <h2 className="text-sm font-bold text-[#18181B] uppercase tracking-wider">
              Account Identity
            </h2>
          </div>
          {isVerified ? (
            <span className="inline-flex items-center gap-1.5 rounded bg-[#EEF2EB] px-2.5 py-1 text-xs font-semibold text-[#4E5D44] border border-[#C6D2BF]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Email Verified</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded bg-[#FAF4E8] px-2.5 py-1 text-xs font-semibold text-[#865B20] border border-[#EAD5AC]">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Verification Required</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3.5 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82]">
              Developer Name
            </span>
            <p className="font-bold text-[#18181B] text-sm">{user?.name || "Developer"}</p>
          </div>

          <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3.5 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82]">
              Registered Email
            </span>
            <p className="font-bold text-[#18181B] text-sm truncate">
              {user?.email || "dev@devflow.local"}
            </p>
          </div>
        </div>

        {!isVerified && (
          <div className="rounded-lg border border-[#EAD5AC] bg-[#FAF4E8] p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="font-bold text-[#865B20]">Your email address is not yet verified.</p>
              <p className="text-[#575653]">
                Verify your email to secure ownership of your solutions and technical notes.
              </p>
            </div>
            <Link to={`/verify-email?email=${encodeURIComponent(user?.email || "")}`}>
              <Button variant="primary" size="xs">
                <span>Verify Now</span>
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* 2. AI Engine Architecture Status */}
      <div className="rounded-xl border border-[#E6E3DB] bg-white p-6 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-[#657858]" />
            <h2 className="text-sm font-bold text-[#18181B] uppercase tracking-wider">
              AI Engine Diagnostics
            </h2>
          </div>
          <button
            onClick={fetchAiStatus}
            disabled={loadingAiStatus}
            className="inline-flex items-center gap-1 text-xs text-[#8E8B82] hover:text-[#18181B] transition-colors"
          >
            <RefreshCw className={`h-3 w-3 ${loadingAiStatus ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        <p className="text-xs text-[#575653]">
          DevFlow AI features (Resume Analyzer, Interview Prep) are powered by a server-side resilient orchestrator with automatic heuristic fallback.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3.5 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82] flex items-center gap-1">
              <Cpu className="h-3 w-3 text-[#657858]" />
              Active Provider
            </span>
            <p className="font-bold text-[#18181B] capitalize text-sm">
              {aiStatus?.provider === "heuristic"
                ? "Heuristic Fallback Engine"
                : aiStatus?.provider || "Heuristic Engine"}
            </p>
            <span className="inline-block text-[10px] text-[#4E5D44] font-medium">
              Deterministic & Structured
            </span>
          </div>

          <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3.5 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82] flex items-center gap-1">
              <Layers className="h-3 w-3 text-[#657858]" />
              Configured Model
            </span>
            <p className="font-mono text-xs font-bold text-[#18181B]">
              {aiStatus?.model || "heuristic-v1"}
            </p>
            <span className="inline-block text-[10px] text-[#8E8B82]">
              SDE interview schema v2
            </span>
          </div>

          <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3.5 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82] flex items-center gap-1">
              <Clock className="h-3 w-3 text-[#657858]" />
              Timeout & Cache
            </span>
            <p className="font-bold text-[#18181B] text-sm">
              {Math.round((aiStatus?.timeoutMs || 15000) / 1000)}s Timeout
            </p>
            <span className="inline-block text-[10px] text-[#4E5D44] font-medium">
              In-memory SHA-256 cache
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3.5 text-xs text-[#575653] space-y-1">
          <p className="font-semibold text-[#18181B]">External LLM Keys:</p>
          <p className="text-[11px] leading-relaxed">
            External API keys (OpenAI / Gemini) remain strictly on the backend via server environment variables (<code className="font-mono bg-white px-1 py-0.5 rounded border border-[#E6E3DB]">OPENAI_API_KEY</code>, <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#E6E3DB]">GEMINI_API_KEY</code>). They are never exposed to browser client code.
          </p>
        </div>
      </div>

      {/* 3. Security & Sign Out */}
      <div className="rounded-xl border border-[#E6E3DB] bg-white p-6 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2.5">
          <Shield className="h-4 w-4 text-[#657858]" />
          <h2 className="text-sm font-bold text-[#18181B] uppercase tracking-wider">
            Session & Security
          </h2>
        </div>

        <p className="text-xs text-[#575653]">
          Signing out immediately clears client-side credentials and invalidates active session tokens.
        </p>

        <div className="flex items-center justify-between border-t border-[#E6E3DB] pt-4">
          <div className="text-xs">
            <p className="font-bold text-[#18181B]">End Workspace Session</p>
            <p className="text-[11px] text-[#8E8B82]">
              Protected routes will immediately require authentication again.
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Settings;

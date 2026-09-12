import { Menu, Plus, Flame, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const routeTitles = {
  "/dashboard": "Developer Dashboard",
  "/problems": "DSA Problem Tracker",
  "/notes": "Technical Notes",
  "/revision": "Spaced Repetition Revisions",
  "/analytics": "Performance & Progress Analytics",
  "/ai-tools": "AI Developer Assistant",
  "/contests": "Contest Calendar",
  "/github": "GitHub Activity & Insights",
  "/profile": "Developer Profile & Settings",
};

function TopNavbar({ onMenuClick }) {
  const { user } = useAuth();
  const location = useLocation();

  const currentTitle = routeTitles[location.pathname] || "DevFlow Workspace";

  const handleOpenAddProblem = () => {
    window.dispatchEvent(new CustomEvent("devflow:open-problem-modal"));
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-base font-semibold text-white sm:text-lg">
            {currentTitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Add Problem Action */}
        <button
          type="button"
          onClick={handleOpenAddProblem}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-all sm:px-4 sm:py-2 sm:text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>New Problem</span>
        </button>

        {/* AI Quick Button */}
        <Link
          to="/ai-tools"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white transition-all"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>AI Assist</span>
        </Link>

        {/* User Pill */}
        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 pr-3 hover:border-slate-700 transition-all"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600/20 text-xs font-bold text-blue-400 border border-blue-500/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <span className="hidden text-xs font-medium text-slate-300 md:inline-block">
            {user?.name || "Developer"}
          </span>
        </Link>
      </div>
    </header>
  );
}

export default TopNavbar;

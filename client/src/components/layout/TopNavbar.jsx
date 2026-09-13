import { Menu, Plus, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const routeTitles = {
  "/dashboard": "Workspace Dashboard",
  "/problems": "Problem Tracker",
  "/notes": "Technical Notes",
  "/revision": "Spaced Repetition",
  "/analytics": "Performance & Growth",
  "/ai-tools": "AI Developer Studio",
  "/contests": "Contest Calendar",
  "/github": "GitHub Analytics",
  "/profile": "Developer Settings",
};

function TopNavbar({ onMenuClick }) {
  const { user } = useAuth();
  const location = useLocation();

  const currentTitle = routeTitles[location.pathname] || "Workspace";

  const handleOpenAddProblem = () => {
    window.dispatchEvent(new CustomEvent("devflow:open-problem-modal"));
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[#E6E3DB] bg-[#FAF9F5]/90 px-4 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-[#575653] hover:bg-[#F2F0E8] hover:text-[#18181B] lg:hidden transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-xs text-[#8E8B82] font-medium">
            DevFlow /
          </span>
          <h1 className="text-sm font-semibold text-[#18181B] tracking-tight">
            {currentTitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Quick Add Problem Action */}
        <Button
          variant="primary"
          size="xs"
          onClick={handleOpenAddProblem}
          className="shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Problem</span>
        </Button>

        {/* AI Quick Button */}
        <Link
          to="/ai-tools"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-[#E6E3DB] bg-white px-2.5 py-1 text-xs font-medium text-[#575653] hover:border-[#D5D1C6] hover:text-[#18181B] transition-colors"
        >
          <Sparkles className="h-3 w-3 text-[#657858]" />
          <span>AI Assist</span>
        </Link>

        {/* User Pill */}
        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-md border border-[#E6E3DB] bg-white p-1 pr-2.5 hover:border-[#D5D1C6] transition-colors"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#18181B] text-[10px] font-bold text-white">
            {user?.name ? user.name.charAt(0).toUpperCase() : "D"}
          </div>
          <span className="hidden text-xs font-medium text-[#18181B] md:inline-block">
            {user?.name || "Developer"}
          </span>
        </Link>
      </div>
    </header>
  );
}

export default TopNavbar;

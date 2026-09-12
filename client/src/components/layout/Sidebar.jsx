import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Code2,
  FileText,
  Repeat,
  BarChart3,
  Sparkles,
  Trophy,
  User,
  LogOut,
  X,
  Flame,
} from "lucide-react";
import GitHubIcon from "../ui/GitHubIcon";
import { useAuth } from "../../context/AuthContext";

const navigationItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Problems", path: "/problems", icon: Code2 },
  { name: "Notes", path: "/notes", icon: FileText },
  { name: "Revision", path: "/revision", icon: Repeat },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "AI Tools", path: "/ai-tools", icon: Sparkles, badge: "AI" },
  { name: "Contests", path: "/contests", icon: Trophy },
  { name: "GitHub", path: "/github", icon: GitHubIcon },
];

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-950 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header / Logo */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 group"
            onClick={onClose}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-mono font-bold text-white shadow-md shadow-blue-600/30 group-hover:bg-blue-500 transition-colors">
              &lt;/&gt;
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block leading-none">
                DevFlow
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-blue-400">
                Workspace
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Streak Mini-Card */}
        <div className="mx-4 my-4 rounded-xl border border-slate-800/80 bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-indigo-950/40 p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Flame className="h-4 w-4 fill-amber-400" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">Daily Streak</p>
                <p className="text-sm font-bold text-white">Consistent</p>
              </div>
            </div>
            <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/20">
              Active
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Workspace
          </div>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="rounded bg-gradient-to-r from-blue-600 to-indigo-600 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-4 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Account
          </div>

          <NavLink
            to="/profile"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
              }`
            }
          >
            <User className="h-4 w-4" />
            <span>Profile & Settings</span>
          </NavLink>
        </div>

        {/* User Footer Profile */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-sm font-bold text-blue-400">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {user?.name || "Developer"}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {user?.email || "dev@devflow.local"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

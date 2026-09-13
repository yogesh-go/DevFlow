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

const workspaceNavItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Problems", path: "/problems", icon: Code2 },
  { name: "Notes", path: "/notes", icon: FileText },
  { name: "Revision", path: "/revision", icon: Repeat },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
];

const toolNavItems = [
  { name: "AI Tools", path: "/ai-tools", icon: Sparkles, badge: "AI" },
  { name: "GitHub", path: "/github", icon: GitHubIcon },
  { name: "Contests", path: "/contests", icon: Trophy },
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
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-[#E6E3DB] bg-[#FAF9F5] transition-transform duration-200 ease-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header / Brand */}
        <div className="flex h-16 items-center justify-between border-b border-[#E6E3DB] px-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 group"
            onClick={onClose}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#18181B] text-white font-mono text-xs font-bold transition-transform group-hover:scale-105">
              &lt;/&gt;
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-[#18181B] block leading-none">
                DevFlow
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#657858] mt-0.5 block">
                Workspace
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-[#8E8B82] hover:bg-[#F2F0E8] hover:text-[#18181B] lg:hidden transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Streak Mini-Card */}
        <div className="mx-4 my-3.5 rounded-lg border border-[#E6E3DB] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#FAF4E8] text-[#865B20] border border-[#EAD5AC]">
                <Flame className="h-3.5 w-3.5 fill-[#865B20]" />
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#8E8B82]">
                  Daily Streak
                </p>
                <p className="text-xs font-bold text-[#18181B]">
                  Active Consistency
                </p>
              </div>
            </div>
            <span className="rounded bg-[#EEF2EB] px-1.5 py-0.5 text-[10px] font-semibold text-[#4E5D44] border border-[#C6D2BF]">
              Live
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-4">
          {/* Workspace section */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82]">
              Workspace
            </div>

            <div className="space-y-0.5">
              {workspaceNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-[#EEF2EB] text-[#18181B] font-semibold border-l-2 border-[#657858]"
                          : "text-[#575653] hover:bg-[#F2F0E8] hover:text-[#18181B] border-l-2 border-transparent"
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0 text-[#657858]" />
                      <span>{item.name}</span>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#E6E3DB]/80 mx-2" />

          {/* Developer Tools section */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82]">
              Developer Tools
            </div>

            <div className="space-y-0.5">
              {toolNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-[#EEF2EB] text-[#18181B] font-semibold border-l-2 border-[#657858]"
                          : "text-[#575653] hover:bg-[#F2F0E8] hover:text-[#18181B] border-l-2 border-transparent"
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0 text-[#657858]" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded bg-[#F2F0E8] px-1.5 py-0.5 text-[9px] font-bold text-[#575653] border border-[#E6E3DB] uppercase tracking-wider">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#E6E3DB]/80 mx-2" />

          {/* Account section */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82]">
              Account
            </div>

            <NavLink
              to="/profile"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-[#EEF2EB] text-[#18181B] font-semibold border-l-2 border-[#657858]"
                    : "text-[#575653] hover:bg-[#F2F0E8] hover:text-[#18181B] border-l-2 border-transparent"
                }`
              }
            >
              <User className="h-4 w-4 text-[#657858]" />
              <span>Profile & Settings</span>
            </NavLink>
          </div>
        </div>

        {/* User Footer Profile */}
        <div className="border-t border-[#E6E3DB] bg-[#F7F6F2] p-3.5">
          <div className="flex items-center justify-between gap-2.5">
            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#18181B] text-xs font-bold text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : "D"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-[#18181B]">
                  {user?.name || "Developer"}
                </p>
                <p className="truncate text-[10px] text-[#8E8B82]">
                  {user?.email || "dev@devflow.local"}
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="rounded-md p-1.5 text-[#8E8B82] hover:bg-[#FBF0F0] hover:text-[#933D3D] transition-colors"
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

import { useEffect } from "react";
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
  Settings as SettingsIcon,
  LogOut,
  X,
  Flame,
  PanelLeftClose,
  PanelLeft,
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

const accountNavItems = [
  { name: "Profile", path: "/profile", icon: User },
  { name: "Settings", path: "/settings", icon: SettingsIcon },
];

function Sidebar({
  isOpen,
  onClose,
  isDesktopCollapsed,
  onToggleDesktopSidebar,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Handle Escape key to close mobile sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavClick = () => {
    if (isOpen) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-[#E6E3DB] bg-[#FAF9F5] transition-all duration-200 ease-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isDesktopCollapsed
            ? "w-64 lg:w-16"
            : "w-64 lg:w-64"
        }`}
      >
        {/* Header / Brand */}
        <div
          className={`flex h-16 items-center border-b border-[#E6E3DB] px-4 transition-all ${
            isDesktopCollapsed ? "lg:justify-center lg:px-0" : "justify-between px-6"
          }`}
        >
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 group"
            onClick={handleNavClick}
            title="DevFlow Workspace"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#18181B] text-white font-mono text-xs font-bold transition-transform group-hover:scale-105 shadow-xs">
              &lt;/&gt;
            </div>
            {!isDesktopCollapsed && (
              <div className="hidden lg:block overflow-hidden whitespace-nowrap">
                <span className="text-base font-bold tracking-tight text-[#18181B] block leading-none">
                  DevFlow
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#657858] mt-0.5 block">
                  Workspace
                </span>
              </div>
            )}
            <div className="lg:hidden overflow-hidden whitespace-nowrap">
              <span className="text-base font-bold tracking-tight text-[#18181B] block leading-none">
                DevFlow
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#657858] mt-0.5 block">
                Workspace
              </span>
            </div>
          </Link>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-[#8E8B82] hover:bg-[#F2F0E8] hover:text-[#18181B] lg:hidden transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Streak Indicator */}
        {!isDesktopCollapsed ? (
          <div className="mx-4 my-3.5 rounded-lg border border-[#E6E3DB] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hidden lg:block">
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
        ) : (
          <div className="my-3 hidden lg:flex justify-center" title="Daily Streak Active">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#FAF4E8] text-[#865B20] border border-[#EAD5AC]">
              <Flame className="h-4 w-4 fill-[#865B20]" />
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {/* Workspace section */}
          <div>
            {!isDesktopCollapsed && (
              <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82] hidden lg:block">
                Workspace
              </div>
            )}
            <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82] lg:hidden">
              Workspace
            </div>

            <div className="space-y-0.5">
              {workspaceNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    title={isDesktopCollapsed ? item.name : undefined}
                    className={({ isActive }) =>
                      `flex items-center rounded-md text-xs font-medium transition-colors ${
                        isDesktopCollapsed
                          ? "lg:justify-center lg:px-2 lg:py-2.5 px-3 py-2 justify-between"
                          : "justify-between px-3 py-2"
                      } ${
                        isActive
                          ? "bg-[#EEF2EB] text-[#18181B] font-semibold border-l-2 border-[#657858]"
                          : "text-[#575653] hover:bg-[#F2F0E8] hover:text-[#18181B] border-l-2 border-transparent"
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0 text-[#657858]" />
                      <span className={isDesktopCollapsed ? "lg:hidden" : ""}>
                        {item.name}
                      </span>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#E6E3DB]/80 mx-1" />

          {/* Developer Tools section */}
          <div>
            {!isDesktopCollapsed && (
              <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82] hidden lg:block">
                Developer Tools
              </div>
            )}
            <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82] lg:hidden">
              Developer Tools
            </div>

            <div className="space-y-0.5">
              {toolNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    title={isDesktopCollapsed ? item.name : undefined}
                    className={({ isActive }) =>
                      `flex items-center rounded-md text-xs font-medium transition-colors ${
                        isDesktopCollapsed
                          ? "lg:justify-center lg:px-2 lg:py-2.5 px-3 py-2 justify-between"
                          : "justify-between px-3 py-2"
                      } ${
                        isActive
                          ? "bg-[#EEF2EB] text-[#18181B] font-semibold border-l-2 border-[#657858]"
                          : "text-[#575653] hover:bg-[#F2F0E8] hover:text-[#18181B] border-l-2 border-transparent"
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0 text-[#657858]" />
                      <span className={isDesktopCollapsed ? "lg:hidden" : ""}>
                        {item.name}
                      </span>
                    </div>
                    {item.badge && (
                      <span
                        className={`rounded bg-[#F2F0E8] px-1.5 py-0.5 text-[9px] font-bold text-[#575653] border border-[#E6E3DB] uppercase tracking-wider ${
                          isDesktopCollapsed ? "lg:hidden" : ""
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#E6E3DB]/80 mx-1" />

          {/* Account section */}
          <div>
            {!isDesktopCollapsed && (
              <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82] hidden lg:block">
                Account
              </div>
            )}
            <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82] lg:hidden">
              Account
            </div>

            <div className="space-y-0.5">
              {accountNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    title={isDesktopCollapsed ? item.name : undefined}
                    className={({ isActive }) =>
                      `flex items-center rounded-md text-xs font-medium transition-colors ${
                        isDesktopCollapsed
                          ? "lg:justify-center lg:px-2 lg:py-2.5 px-3 py-2"
                          : "px-3 py-2"
                      } ${
                        isActive
                          ? "bg-[#EEF2EB] text-[#18181B] font-semibold border-l-2 border-[#657858]"
                          : "text-[#575653] hover:bg-[#F2F0E8] hover:text-[#18181B] border-l-2 border-transparent"
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0 text-[#657858]" />
                      <span className={isDesktopCollapsed ? "lg:hidden" : ""}>
                        {item.name}
                      </span>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Footer Profile */}
        <div className="border-t border-[#E6E3DB] bg-[#F7F6F2] p-3">
          <div
            className={`flex items-center ${
              isDesktopCollapsed ? "lg:justify-center" : "justify-between"
            } gap-2`}
          >
            <Link
              to="/profile"
              onClick={handleNavClick}
              title={user?.name || "Developer Profile"}
              className={`flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity ${
                isDesktopCollapsed ? "lg:hidden" : "flex-1"
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#18181B] text-xs font-bold text-white shadow-xs overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name || "Avatar"} className="h-full w-full object-cover" />
                ) : (
                  user?.name ? user.name.charAt(0).toUpperCase() : "D"
                )}
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

            {isDesktopCollapsed && (
              <Link
                to="/profile"
                onClick={handleNavClick}
                title={`Profile: ${user?.name || "Developer"}`}
                className="hidden lg:flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#18181B] text-xs font-bold text-white shadow-xs hover:opacity-90 transition-opacity overflow-hidden"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name || "Avatar"} className="h-full w-full object-cover" />
                ) : (
                  user?.name ? user.name.charAt(0).toUpperCase() : "D"
                )}
              </Link>
            )}

            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className={`rounded-md p-1.5 text-[#8E8B82] hover:bg-[#FBF0F0] hover:text-[#933D3D] transition-colors ${
                isDesktopCollapsed ? "hidden" : "inline-flex"
              }`}
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

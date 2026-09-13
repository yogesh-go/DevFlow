import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import ProblemModal from "../problems/ProblemModal";
import { createProblem } from "../../services/problemService";

function AppLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(() => {
    return localStorage.getItem("devflow:sidebar-collapsed") === "true";
  });
  const [isCreateProblemModalOpen, setIsCreateProblemModalOpen] = useState(false);

  const toggleDesktopSidebar = () => {
    setIsDesktopCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("devflow:sidebar-collapsed", String(next));
      return next;
    });
  };

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle desktop sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleDesktopSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Global listener to open problem modal from anywhere in DevFlow
  useEffect(() => {
    const handleOpenModal = () => {
      setIsCreateProblemModalOpen(true);
    };

    window.addEventListener("devflow:open-problem-modal", handleOpenModal);
    return () => {
      window.removeEventListener("devflow:open-problem-modal", handleOpenModal);
    };
  }, []);

  const handleCreateProblem = async (formData) => {
    const res = await createProblem(formData);
    toast.success("Problem logged & spaced repetition scheduled!");
    window.dispatchEvent(
      new CustomEvent("devflow:problem-created", { detail: res?.problem })
    );
    setIsCreateProblemModalOpen(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F7F6F2] font-sans text-[#18181B]">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        isDesktopCollapsed={isDesktopCollapsed}
        onToggleDesktopSidebar={toggleDesktopSidebar}
      />

      {/* Main Workspace Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0 transition-all duration-200 ease-out">
        <TopNavbar
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          isDesktopCollapsed={isDesktopCollapsed}
          onToggleDesktopSidebar={toggleDesktopSidebar}
        />

        <main className="flex-1 overflow-y-auto bg-[#F7F6F2] px-4 py-6 md:px-8 md:py-8 transition-all">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Add Problem Modal */}
      <ProblemModal
        isOpen={isCreateProblemModalOpen}
        onClose={() => setIsCreateProblemModalOpen(false)}
        onSubmit={handleCreateProblem}
      />
    </div>
  );
}

export default AppLayout;

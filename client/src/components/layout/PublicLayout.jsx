import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#18181B] font-sans flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;
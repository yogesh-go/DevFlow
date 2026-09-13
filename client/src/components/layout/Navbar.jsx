import { NavLink, Link } from "react-router-dom";
import Button from "../ui/Button";
import Container from "../ui/Container";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  const navItems = [
    { name: "Overview", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Pricing", path: "/pricing" },
  ];

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-[#18181B] font-semibold text-xs tracking-tight"
      : "text-[#575653] hover:text-[#18181B] text-xs font-medium tracking-tight transition-colors";

  return (
    <header className="sticky top-0 z-40 border-b border-[#E6E3DB] bg-[#FAF9F5]/90 backdrop-blur-md">
      <Container>
        <nav className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#18181B] text-white font-mono text-xs font-bold transition-transform group-hover:scale-105">
                &lt;/&gt;
              </div>
              <span className="text-base font-bold tracking-tight text-[#18181B]">
                DevFlow
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={navLinkClass}
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Authentication Actions */}
          <div className="flex items-center gap-2.5">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button variant="primary" size="xs">
                    Workspace →
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="xs"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="xs">
                    Login
                  </Button>
                </Link>

                <Link to="/signup">
                  <Button variant="primary" size="xs">
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
}

export default Navbar;
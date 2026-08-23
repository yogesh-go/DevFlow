import { NavLink, Link } from "react-router-dom";

import Button from "../ui/Button";
import Container from "../ui/Container";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Pricing", path: "/pricing" },
  ];

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-500"
      : "text-slate-300 hover:text-white";

  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <Container>
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-blue-500 text-2xl font-bold">
              &lt;/&gt;
            </span>

            <Link
              to="/"
              className="text-2xl font-bold text-white hover:text-blue-400 transition-colors"
            >
              DevFlow
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
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
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-slate-300 text-sm">
                  Hi, {user?.name}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>

                <Link to="/signup">
                  <Button size="sm">
                    Get Started
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
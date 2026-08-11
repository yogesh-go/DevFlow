import { NavLink } from "react-router-dom";
import Button from "../ui/Button";
import Container from "../ui/Container";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Features", path: "/features" },
  { name: "Pricing", path: "/pricing" },
];

const navLinkClass = ({ isActive }) =>
  `transition-colors ${
    isActive
      ? "text-blue-500"
      : "text-slate-300 hover:text-white"
  }`;

function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <Container>
        <nav className="flex h-16 items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-500">
              &lt;/&gt;
            </span>

            <NavLink
              to="/"
              className="text-2xl font-bold text-white transition-colors hover:text-blue-400"
            >
              DevFlow
            </NavLink>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-8">
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

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="secondary">
              Login
            </Button>

            <Button>
              Get Started
            </Button>
          </div>

        </nav>
      </Container>
    </header>
  );
}

export default Navbar;
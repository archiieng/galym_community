import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { BrandMark } from "./icons";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const navigate = useNavigate();
  const { token, isAdmin, logout } = useContext(AuthContext);

  function handleLogout() {
    logout();

    navigate("/login");
  }

  return (
    <header className="site-header">
      <nav className="container site-nav" aria-label="Main">
        <Link to="/" className="brand">
          <BrandMark />
          Galym
        </Link>

        <div className="nav-links">
          <NavLink to="/opportunities">Opportunities</NavLink>

          {token && <NavLink to="/profile">Profile</NavLink>}

          {isAdmin && <NavLink to="/admin">Admin</NavLink>}

          {!token && <NavLink to="/login">Log in</NavLink>}
        </div>

        {token ? (
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={handleLogout}
          >
            Log out
          </button>
        ) : (
          <Link to="/register" className="btn btn-small">
            Create account
          </Link>
        )}

        <ThemeToggle />
      </nav>
    </header>
  );
}

export default Navbar;

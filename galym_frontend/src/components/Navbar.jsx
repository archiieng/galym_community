import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { token, isAdmin, logout } = useContext(AuthContext);

  function handleLogout() {
    logout();

    navigate("/login");
  }

  return (
    <nav>
      <Link to="/">Galym</Link>

      <Link to="/opportunities">Opportunities</Link>

      {!token ? (
        <>
          <Link to="/login">Login</Link>

          <Link to="/register">Register</Link>
        </>
      ) : (
        <>
          <Link to="/profile">Profile</Link>

          {isAdmin && <Link to="/admin/opportunities">Admin</Link>}

          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
}

export default Navbar;

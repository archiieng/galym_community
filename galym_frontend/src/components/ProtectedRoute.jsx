import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// The backend enforces access; this only keeps people off pages that would
// show them nothing but errors.
function ProtectedRoute({ children, adminOnly = false }) {
  const { token, user, isAdmin } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly) {
    if (!user) {
      return <p>Loading...</p>;
    }

    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;

import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// The backend enforces access; this only keeps people off pages that would
// show them nothing but errors.
function ProtectedRoute({ children, adminOnly = false }) {
  const { token, user, isAdmin, accountLoading, loadError, retryLoad } =
    useContext(AuthContext);
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  if (accountLoading) {
    return <p className="muted">Loading your account...</p>;
  }

  if (!user) {
    if (loadError) {
      return (
        <div className="empty" role="alert">
          <p>Your account could not be loaded: {loadError}</p>
          <p>
            <button type="button" className="btn btn-small" onClick={retryLoad}>
              Try again
            </button>
          </p>
        </div>
      );
    }

    return <p className="muted">Loading your account...</p>;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;

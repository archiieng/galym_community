import { useState, useContext } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { loginUser } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { usePageTitle } from "../usePageTitle";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const { token, login } = useContext(AuthContext);

  usePageTitle("Log in");

  // Already signed in (or just signed in below): go back to where they came from.
  if (token) {
    return <Navigate to={location.state?.from ?? "/opportunities"} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      login(await loginUser(email, password));
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="auth">
      <h1>Log in</h1>

      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="notice notice-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p>
        New here?{" "}
        <Link to="/register" state={location.state}>
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default Login;

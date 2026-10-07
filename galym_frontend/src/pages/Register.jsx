import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { loginUser, registerUser } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { usePageTitle } from "../usePageTitle";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { token, login } = useContext(AuthContext);

  usePageTitle("Create an account");

  if (token) {
    return <Navigate to="/opportunities" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await registerUser(name, email, password);

      // No second form to fill in: the new account is signed in straight away.
      login(await loginUser(email, password));
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="auth">
      <h1>Create an account</h1>

      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Name</label>

          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
            autoComplete="new-password"
            minLength={8}
            aria-describedby="password-hint"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <small id="password-hint">At least 8 characters.</small>
        </div>

        {error && (
          <p className="notice notice-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export default Register;

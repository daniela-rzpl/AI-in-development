import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(username, password);
      navigate("/welcome", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page auth-page">
      <section className="login-shell card-panel glass-panel reveal">
        <header className="login-hero">
          <p className="eyebrow">FlowOps // JWT Access</p>
          <h1>Surgical access control</h1>
          <p className="login-subtitle">
            Sign in to access the protected view. This interface uses the backend
            authentication endpoint and stores your session in the browser.
          </p>
          <div className="status-row">
            <span className="status-pill">Protected session</span>
            <span className="status-pill">Automatic refresh</span>
          </div>
        </header>

        <form className="login-form login-form-surface reveal delay-1" onSubmit={handleSubmit}>
          <h2>Sign in</h2>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <p className="hint-text">Demo credentials: admin / admin123</p>

          {error ? <p className="error-text">{error}</p> : null}

          <button className="primary-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Validating..." : "Sign in"}
          </button>
        </form>

        <p className="login-footnote">
          Your session stays in this browser and refreshes automatically.
        </p>
      </section>
    </main>
  );
}

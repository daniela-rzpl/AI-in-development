import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

function formatDuration(totalSeconds) {
  const safeSeconds = Math.max(totalSeconds, 0);
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (safeSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatDateTime(timestamp) {
  if (!timestamp) {
    return "-";
  }
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function WelcomePage() {
  const navigate = useNavigate();
  const {
    username,
    token,
    logout,
    refreshAccessToken,
    expiresIn,
    expiresAt,
    sessionStartedAt,
    refreshCount,
    refreshBufferSeconds,
  } = useAuth();
  const [now, setNow] = useState(Date.now());
  const [isRefreshingNow, setIsRefreshingNow] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState("idle");

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (refreshStatus === "idle") {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setRefreshStatus("idle");
    }, 3000);

    return () => window.clearTimeout(timerId);
  }, [refreshStatus]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleManualRefresh = async () => {
    setIsRefreshingNow(true);
    setRefreshStatus("idle");
    try {
      await refreshAccessToken();
      setRefreshStatus("success");
    } catch {
      setRefreshStatus("error");
    } finally {
      setIsRefreshingNow(false);
    }
  };

  const remainingSeconds = useMemo(() => {
    if (!expiresAt) {
      return 0;
    }
    return Math.max(Math.ceil((expiresAt - now) / 1000), 0);
  }, [expiresAt, now]);

  const sessionElapsedSeconds = useMemo(() => {
    if (!sessionStartedAt) {
      return 0;
    }
    return Math.max(Math.floor((now - sessionStartedAt) / 1000), 0);
  }, [sessionStartedAt, now]);

  const nextRefreshInSeconds = Math.max(remainingSeconds - refreshBufferSeconds, 0);
  const remainingPercent = expiresIn
    ? Math.min((remainingSeconds / expiresIn) * 100, 100)
    : 0;

  return (
    <main className="page welcome-page">
      <section className="welcome-shell card-panel reveal">
        <header className="welcome-hero">
          <p className="eyebrow">Authenticated session</p>
          <h1>Welcome{username ? `, ${username}` : ""}</h1>
          <p className="welcome-description">
            You successfully accessed a protected route. This content is only shown
            when a session token is available.
          </p>
          <div className="status-row">
            <span className="status-pill">JWT active</span>
            <span className="status-pill">Automatic refresh</span>
          </div>
        </header>

        <div className="token-box glass-panel">
          <h2>Current token</h2>
          <p>{token}</p>
        </div>

        <section className="token-health glass-panel">
          <header className="token-health-header">
            <div className="token-health-title">
              <h2>Token status</h2>
              <span className="status-pill">Active</span>
            </div>
            <div className="token-health-controls">
              <button
                className={`secondary-btn secondary-btn-${refreshStatus}`}
                type="button"
                onClick={handleManualRefresh}
                disabled={isRefreshingNow}
              >
                {isRefreshingNow
                  ? "Refreshing..."
                  : refreshStatus === "success"
                    ? "Refreshed \u2713"
                    : refreshStatus === "error"
                      ? "Failed"
                      : "Refresh token"}
              </button>
            </div>
          </header>

          <p className="token-timer">Expires in {formatDuration(remainingSeconds)}</p>
          <div className="progress-track" aria-label="Remaining token lifetime">
            <div className="progress-bar" style={{ width: `${remainingPercent}%` }} />
          </div>

          <div className="stats-grid">
            <article className="stat-card">
              <h3>Expiration</h3>
              <p>{formatDateTime(expiresAt)}</p>
            </article>
            <article className="stat-card">
              <h3>Next refresh</h3>
              <p>In {formatDuration(nextRefreshInSeconds)}</p>
            </article>
            <article className="stat-card">
              <h3>Session duration</h3>
              <p>{formatDuration(sessionElapsedSeconds)}</p>
            </article>
            <article className="stat-card">
              <h3>Refresh count</h3>
              <p>{refreshCount}</p>
            </article>
          </div>
        </section>

        <button className="primary-btn" onClick={handleLogout} type="button">
          Sign out
        </button>
      </section>
    </main>
  );
}

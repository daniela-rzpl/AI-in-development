import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

const MS_CERTIFICATIONS = [
  {
    id: "ai-102",
    code: "AI-102",
    title: "Azure AI Engineer Associate",
    level: "Intermediate",
    description:
      "Design and implement Azure AI solutions using Azure AI services, Azure AI Search, and Azure OpenAI.",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
    tag: "Azure · AI",
  },
  {
    id: "ai-900",
    code: "AI-900",
    title: "Azure AI Fundamentals",
    level: "Beginner",
    description:
      "Demonstrate fundamental AI concepts related to the development of software and services on Microsoft Azure.",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/",
    tag: "Azure · AI",
  },
  {
    id: "dp-100",
    code: "DP-100",
    title: "Azure Data Scientist Associate",
    level: "Intermediate",
    description:
      "Manage data ingestion, model training and deployment, and ML solution monitoring with Python, Azure Machine Learning, and MLflow.",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-data-scientist/",
    tag: "Azure · Data",
  },
  {
    id: "sc-500",
    code: "SC-500",
    title: "Cloud and AI Security Engineer Associate",
    level: "Intermediate",
    description:
      "New in 2026 — Protect cloud and AI workloads with end-to-end security controls spanning identity, network, storage, compute, and AI.",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/cloud-ai-security-engineer/",
    tag: "Security · AI",
    isNew: true,
  },
  {
    id: "github-copilot",
    code: "GitHub",
    title: "GitHub Copilot Certification",
    level: "Intermediate",
    description:
      "Validate your skills in using GitHub Copilot to accelerate development workflows with AI-assisted coding.",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/github-copilot/",
    tag: "GitHub · AI",
    isNew: true,
  },
  {
    id: "github-advanced-security",
    code: "GitHub",
    title: "GitHub Advanced Security",
    level: "Intermediate",
    description:
      "Demonstrate expertise in securing codebases using GitHub Advanced Security features including code scanning and secret scanning.",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/github-advanced-security/",
    tag: "GitHub · Security",
  },
];

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

        <section className="certifications-section glass-panel">
          <header className="certifications-header">
            <h2>Microsoft Certifications 2026</h2>
            <p className="certifications-subtitle">
              Latest certifications from Microsoft to validate your cloud, AI, and security skills.
            </p>
          </header>
          <div className="certifications-grid">
            {MS_CERTIFICATIONS.map((cert) => (
              <a
                key={cert.id}
                className="cert-card"
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="cert-card-top">
                  <span className="cert-code">{cert.code}</span>
                  {cert.isNew && <span className="cert-badge-new">New</span>}
                </div>
                <h3 className="cert-title">{cert.title}</h3>
                <p className="cert-description">{cert.description}</p>
                <div className="cert-card-footer">
                  <span className="cert-level">{cert.level}</span>
                  <span className="cert-tag">{cert.tag}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <button className="primary-btn" onClick={handleLogout} type="button">
          Sign out
        </button>
      </section>
    </main>
  );
}

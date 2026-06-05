import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginRequest, refreshAccessTokenRequest } from "../services/authApi";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USERNAME_KEY = "username";
const EXPIRES_IN_KEY = "access_token_expires_in";
const EXPIRES_AT_KEY = "access_token_expires_at";
const SESSION_STARTED_AT_KEY = "session_started_at";
const REFRESH_COUNT_KEY = "refresh_count";
const REFRESH_BUFFER_SECONDS = 30;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(ACCESS_TOKEN_KEY));
  const [refreshToken, setRefreshToken] = useState(() => sessionStorage.getItem(REFRESH_TOKEN_KEY));
  const [expiresIn, setExpiresIn] = useState(() => {
    const savedValue = Number(sessionStorage.getItem(EXPIRES_IN_KEY));
    return Number.isFinite(savedValue) && savedValue > 0 ? savedValue : 300;
  });
  const [expiresAt, setExpiresAt] = useState(() => {
    const savedValue = Number(sessionStorage.getItem(EXPIRES_AT_KEY));
    return Number.isFinite(savedValue) && savedValue > 0 ? savedValue : null;
  });
  const [sessionStartedAt, setSessionStartedAt] = useState(() => {
    const savedValue = Number(sessionStorage.getItem(SESSION_STARTED_AT_KEY));
    return Number.isFinite(savedValue) && savedValue > 0 ? savedValue : null;
  });
  const [refreshCount, setRefreshCount] = useState(() => {
    const savedValue = Number(sessionStorage.getItem(REFRESH_COUNT_KEY));
    return Number.isFinite(savedValue) && savedValue >= 0 ? savedValue : 0;
  });
  const [username, setUsername] = useState(() => sessionStorage.getItem(USERNAME_KEY));

  const isAuthenticated = Boolean(token);

  const login = async (user, password) => {
    const result = await loginRequest(user, password);
    const now = Date.now();
    const nextExpiresAt = now + result.expires_in * 1000;

    sessionStorage.setItem(ACCESS_TOKEN_KEY, result.access_token);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, result.refresh_token);
    sessionStorage.setItem(EXPIRES_IN_KEY, String(result.expires_in));
    sessionStorage.setItem(EXPIRES_AT_KEY, String(nextExpiresAt));
    sessionStorage.setItem(SESSION_STARTED_AT_KEY, String(now));
    sessionStorage.setItem(REFRESH_COUNT_KEY, "0");
    sessionStorage.setItem(USERNAME_KEY, user);

    setToken(result.access_token);
    setRefreshToken(result.refresh_token);
    setExpiresIn(result.expires_in);
    setExpiresAt(nextExpiresAt);
    setSessionStartedAt(now);
    setRefreshCount(0);
    setUsername(user);
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const result = await refreshAccessTokenRequest(refreshToken);
    const now = Date.now();
    const nextExpiresAt = now + result.expires_in * 1000;
    const nextRefreshCount = refreshCount + 1;

    sessionStorage.setItem(ACCESS_TOKEN_KEY, result.access_token);
    sessionStorage.setItem(EXPIRES_IN_KEY, String(result.expires_in));
    sessionStorage.setItem(EXPIRES_AT_KEY, String(nextExpiresAt));
    sessionStorage.setItem(REFRESH_COUNT_KEY, String(nextRefreshCount));
    setToken(result.access_token);
    setExpiresIn(result.expires_in);
    setExpiresAt(nextExpiresAt);
    setRefreshCount(nextRefreshCount);
    return result.access_token;
  };

  const logout = () => {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(EXPIRES_IN_KEY);
    sessionStorage.removeItem(EXPIRES_AT_KEY);
    sessionStorage.removeItem(SESSION_STARTED_AT_KEY);
    sessionStorage.removeItem(REFRESH_COUNT_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
    setToken(null);
    setRefreshToken(null);
    setExpiresIn(300);
    setExpiresAt(null);
    setSessionStartedAt(null);
    setRefreshCount(0);
    setUsername(null);
  };

  useEffect(() => {
    if (!token || !refreshToken || !expiresAt) {
      return undefined;
    }

    const secondsLeft = Math.ceil((expiresAt - Date.now()) / 1000);
    const refreshDelayMs = Math.max((secondsLeft - REFRESH_BUFFER_SECONDS) * 1000, 1000);
    const timerId = window.setTimeout(async () => {
      try {
        await refreshAccessToken();
      } catch {
        logout();
      }
    }, refreshDelayMs);

    return () => window.clearTimeout(timerId);
  }, [token, refreshToken, expiresAt, refreshCount]);

  const value = useMemo(
    () => ({
      token,
      username,
      isAuthenticated,
      expiresIn,
      expiresAt,
      sessionStartedAt,
      refreshCount,
      refreshBufferSeconds: REFRESH_BUFFER_SECONDS,
      login,
      refreshAccessToken,
      logout,
    }),
    [
      token,
      username,
      isAuthenticated,
      expiresIn,
      expiresAt,
      sessionStartedAt,
      refreshCount,
      refreshToken,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

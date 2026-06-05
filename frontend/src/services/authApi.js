const API_BASE = "/api";

function buildApiError(defaultMessage, body) {
  if (body?.detail) {
    return new Error(body.detail);
  }
  return new Error(defaultMessage);
}

export async function loginRequest(username, password) {
  const response = await fetch(`${API_BASE}/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    let error;
    try {
      const body = await response.json();
      error = buildApiError("Sign-in failed", body);
    } catch {
      // Keep generic message if backend did not return JSON.
      error = new Error("Sign-in failed");
    }
    throw error;
  }

  return response.json();
}

export async function refreshAccessTokenRequest(refreshToken) {
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    let error;
    try {
      const body = await response.json();
      error = buildApiError("Token refresh failed", body);
    } catch {
      error = new Error("Token refresh failed");
    }
    throw error;
  }

  return response.json();
}

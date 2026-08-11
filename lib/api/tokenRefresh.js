import { conf } from "../conf";
import tokenManager from "./tokenManager";

let refreshPromise = null;

export async function refreshToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refresh_token = tokenManager.getRefreshToken();

    if (!refresh_token) {
      tokenManager.clear();
      return null;
    }

    const response = await fetch(`${conf.apiBaseURL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token,
      }),
    });

    console.log("Refresh Status:", response.status);

    const text = await response.text();

    console.log("Refresh Raw Response:", text);

    let data = {};

    try {
      data = JSON.parse(text);
    } catch (e) {
      console.log("JSON Parse Error:", e);
    }

    console.log("Parsed Data:", data);

    if (!response.ok || !data.status) {
      tokenManager.clear();
      return null;
    }

    // Save latest tokens through tokenManager
    tokenManager.setTokens(data.access_token, data.refresh_token);

    return data.access_token;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

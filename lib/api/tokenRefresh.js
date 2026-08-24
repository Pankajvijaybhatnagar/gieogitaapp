import { conf } from "../conf";
import tokenManager from "./tokenManager";

let refreshPromise = null;

export async function refreshToken() {
  // Prevent multiple simultaneous refresh requests
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      // IMPORTANT: tokenManager method is async
      const refresh_token = await tokenManager.getRefreshToken();

      console.log("[TokenRefresh] Refresh token:", refresh_token);

      if (!refresh_token) {
        console.log("[TokenRefresh] No refresh token found");

        await tokenManager.clear();

        return null;
      }

      const response = await fetch(
        `${conf.apiBaseURL}/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh_token,
          }),
        }
      );

      console.log("[TokenRefresh] Refresh status:", response.status);

      const text = await response.text();

      console.log("[TokenRefresh] Raw response:", text);

      let data = {};

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.log("[TokenRefresh] JSON parse error:", error);

        await tokenManager.clear();

        return null;
      }

      console.log("[TokenRefresh] Parsed response:", data);

      if (!response.ok || !data.status || !data.access_token) {
        console.log("[TokenRefresh] Refresh failed");

        await tokenManager.clear();

        return null;
      }

      // IMPORTANT: wait until SecureStore + tokenManager
      // have actually been updated
      await tokenManager.setTokens(
        data.access_token,
        data.refresh_token || refresh_token
      );

      console.log("[TokenRefresh] Tokens updated");

      return data.access_token;
    } catch (error) {
      console.error("[TokenRefresh] Error:", error);

      await tokenManager.clear();

      return null;
    }
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}
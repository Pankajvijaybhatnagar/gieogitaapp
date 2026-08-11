import * as SecureStore from "expo-secure-store";

let accessToken = null;
let refreshToken = null;
let user = null;

let listeners = [];

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";

const tokenManager = {
  // =========================
  // INITIALIZE
  // =========================
  async init() {
    try {
      accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

      const savedUser = await SecureStore.getItemAsync(USER_KEY);

      if (savedUser && savedUser !== "undefined") {
        try {
          user = JSON.parse(savedUser);
        } catch (error) {
          console.error("Failed to parse saved user:", error);
          user = null;
        }
      }

      this.notify();

      return {
        accessToken,
        refreshToken,
        user,
      };
    } catch (error) {
      console.error("TokenManager initialization failed:", error);

      accessToken = null;
      refreshToken = null;
      user = null;

      return {
        accessToken: null,
        refreshToken: null,
        user: null,
      };
    }
  },

  // =========================
  // SET TOKENS
  // =========================
  async setTokens(access, refresh) {
    accessToken = access || null;
    refreshToken = refresh || null;

    try {
      if (access) {
        await SecureStore.setItemAsync(
          ACCESS_TOKEN_KEY,
          access
        );
      } else {
        await SecureStore.deleteItemAsync(
          ACCESS_TOKEN_KEY
        );
      }

      if (refresh) {
        await SecureStore.setItemAsync(
          REFRESH_TOKEN_KEY,
          refresh
        );
      } else {
        await SecureStore.deleteItemAsync(
          REFRESH_TOKEN_KEY
        );
      }

      this.notify();
    } catch (error) {
      console.error("Failed to save tokens:", error);
      throw error;
    }
  },

  // =========================
  // GET ACCESS TOKEN
  // =========================
  async getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    try {
      accessToken = await SecureStore.getItemAsync(
        ACCESS_TOKEN_KEY
      );

      return accessToken;
    } catch (error) {
      console.error(
        "Failed to get access token:",
        error
      );

      return null;
    }
  },

  // =========================
  // GET REFRESH TOKEN
  // =========================
  async getRefreshToken() {
    if (refreshToken) {
      return refreshToken;
    }

    try {
      refreshToken = await SecureStore.getItemAsync(
        REFRESH_TOKEN_KEY
      );

      return refreshToken;
    } catch (error) {
      console.error(
        "Failed to get refresh token:",
        error
      );

      return null;
    }
  },

  // =========================
  // SET USER
  // =========================
  async setUser(newUser) {
    user = newUser || null;

    try {
      if (newUser) {
        await SecureStore.setItemAsync(
          USER_KEY,
          JSON.stringify(newUser)
        );
      } else {
        await SecureStore.deleteItemAsync(USER_KEY);
      }

      this.notify();
    } catch (error) {
      console.error("Failed to save user:", error);
      throw error;
    }
  },

  // =========================
  // GET USER
  // =========================
  async getUser() {
    if (user) {
      return user;
    }

    try {
      const savedUser = await SecureStore.getItemAsync(
        USER_KEY
      );

      if (!savedUser || savedUser === "undefined") {
        return null;
      }

      try {
        user = JSON.parse(savedUser);
        return user;
      } catch (error) {
        console.error(
          "Failed to parse saved user:",
          error
        );

        return null;
      }
    } catch (error) {
      console.error(
        "Failed to get saved user:",
        error
      );

      return null;
    }
  },

  // =========================
  // CLEAR EVERYTHING
  // =========================
  async clear() {
    accessToken = null;
    refreshToken = null;
    user = null;

    try {
      await SecureStore.deleteItemAsync(
        ACCESS_TOKEN_KEY
      );

      await SecureStore.deleteItemAsync(
        REFRESH_TOKEN_KEY
      );

      await SecureStore.deleteItemAsync(USER_KEY);

      this.notify();
    } catch (error) {
      console.error(
        "Failed to clear token manager:",
        error
      );

      throw error;
    }
  },

  // =========================
  // NOTIFY LISTENERS
  // =========================
  notify() {
    listeners.forEach((cb) => {
      cb({
        accessToken,
        refreshToken,
        user,
        loggedOut: !accessToken,
      });
    });
  },

  // =========================
  // SUBSCRIBE
  // =========================
  subscribe(cb) {
    listeners.push(cb);

    return () => {
      listeners = listeners.filter(
        (x) => x !== cb
      );
    };
  },
};

export default tokenManager;

import tokenManager from "@/lib/api/tokenManager";
import AuthServices from "@/lib/api/AuthServices";

import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  useCallback,
} from "react";

// =========================
// AUTH CONTEXT
// =========================

const AuthContext = createContext({
  user: null,
  access_token: null,
  refresh_token: null,
  isAuthenticated: false,
  loading: true,

  login: () => {},
  loginWithGoogle: () => {},
  logout: () => {},
  signup: () => {},
  sendOTP: () => {},
  verifyOTP: () => {},
  forgotPassword: () => {},
  updatePassword: () => {},
});

// =========================
// CUSTOM HOOK
// =========================

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// =========================
// AUTH PROVIDER
// =========================

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [access_token, setaccess_token] = useState(null);
  const [refresh_token, setrefresh_token] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOGIN
  // =========================

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const result = await AuthServices.login(email, password);
      if (!result.success) {
        return result;
      }

      const data = result.data;
      if (!data.access_token) {
        return {
          success: false,
          code: result.code,
          error: "Login failed: No access token received.",
        };
      }

      // Update React state
      setaccess_token(data.access_token);
      setrefresh_token(data.refresh_token);
      setUser(data.user);

      // Update tokenManager + localStorage
      tokenManager.setTokens(data.access_token, data.refresh_token);
      tokenManager.setUser(data.user);
      return {
        success: true,
        code: result.code,
        user: data.user,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // GOOGLE LOGIN
  // =========================

  const loginWithGoogle = useCallback(async (id_token) => {
    setLoading(true);
    try {
      const result = await AuthServices.loginWithGoogle(id_token);
      if (!result.success) {
        return result;
      }

      const data = result.data;

      // Update React state
      setaccess_token(data.access_token);
      setrefresh_token(data.refresh_token);
      setUser(data.user);

      // Update tokenManager + localStorage
      tokenManager.setTokens(data.access_token, data.refresh_token);
      tokenManager.setUser(data.user);
      return {
        success: true,
        code: result.code,
        user: data.user,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // LOGOUT
  // =========================

  const logout = useCallback(async () => {
    const result = await AuthServices.logout(access_token);

    return result;
  }, [access_token]);

  // =========================
  // SIGNUP
  // =========================

  const signup = useCallback(async (name, email, password) => {
    setLoading(true);

    try {
      return await AuthServices.signup(name, email, password);
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // SEND OTP
  // =========================

  const sendOTP = useCallback(async (email) => {
    setLoading(true);

    try {
      return await AuthServices.sendOTP(email);
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // VERIFY OTP
  // =========================

  const verifyOTP = useCallback(async (email, otp) => {
    setLoading(true);

    try {
      const result = await AuthServices.verifyOTP(email, otp);

      if (result.success) {
        return {
          success: true,
          code: result.code,
          message: "OTP verified",
        };
      }

      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // FORGOT PASSWORD
  // =========================

  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    try {
      return await AuthServices.forgotPassword(email);
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // UPDATE PASSWORD
  // =========================

  const updatePassword = useCallback(
    async (email, new_password, current_password, otp) => {
      setLoading(true);
      try {
        return await AuthServices.updatePassword(
          email,
          new_password,
          current_password,
          otp,
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // =========================
  // LOAD SESSION
  // =========================

  useEffect(() => {
    const savedAccessToken = tokenManager.getAccessToken();
    const savedRefreshToken = tokenManager.getRefreshToken();
    const savedUser = tokenManager.getUser();
    if (savedAccessToken && savedRefreshToken && savedUser) {
      setaccess_token(savedAccessToken);
      setrefresh_token(savedRefreshToken);
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  // =========================
  // TOKEN MANAGER LISTENER
  // =========================

  useEffect(() => {
    const unsubscribe = tokenManager.subscribe(
      ({ accessToken, refreshToken, user: managedUser, loggedOut }) => {
        setaccess_token(accessToken);
        setrefresh_token(refreshToken);
        setUser(managedUser);
        if (loggedOut) {
          setUser(null);
        }
      },
    );

    return unsubscribe;
  }, []);

  // =========================
  // CONTEXT VALUE
  // =========================

  const value = {
    user,
    access_token,
    refresh_token,
    isAuthenticated: !!user,
    loading,
    login,
    loginWithGoogle,
    logout,
    signup,
    sendOTP,
    verifyOTP,
    forgotPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

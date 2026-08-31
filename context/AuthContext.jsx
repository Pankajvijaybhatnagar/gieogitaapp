// /context/AuthContext.jsx

import AuthServices from '@/lib/api/AuthServices';
import tokenManager from '@/lib/api/tokenManager';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

// =========================
// AUTH CONTEXT
// =========================

const AuthContext = createContext({
  user: null,
  access_token: null,
  refresh_token: null,
  isAuthenticated: false,
  loading: true,

  login: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  signup: async () => {},
  sendOTP: async () => {},
  verifyOTP: async () => {},
  forgotPassword: async () => {},
  updatePassword: async () => {},
});

// =========================
// CUSTOM HOOK
// =========================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// =========================
// AUTH PROVIDER
// =========================

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [access_token, setAccessToken] = useState(null);

  const [refresh_token, setRefreshToken] = useState(null);

  const [loading, setLoading] = useState(true);

  // =========================
  // LOGIN
  // =========================

  const login = useCallback(async (email, password) => {
    setLoading(true);

    try {
      console.log('[AuthContext] Login started:', email);

      const result = await AuthServices.login(email, password);

      console.log('[AuthContext] Login result:', result);

      // Login API failed
      if (!result?.success) {
        return result;
      }

      const data = result?.data;

      if (!data?.access_token) {
        return {
          success: false,
          code: result?.code,
          error: 'Login failed: No access token received.',
        };
      }

      // =========================
      // UPDATE REACT STATE
      // =========================

      setAccessToken(data.access_token);

      setRefreshToken(data.refresh_token || null);

      setUser(data.user || null);

      // =========================
      // SAVE TO SECURE STORE
      // =========================

      await tokenManager.setTokens(
        data.access_token,
        data.refresh_token || null,
      );

      await tokenManager.setUser(data.user || null);

      console.log('[AuthContext] Session saved successfully');

      return {
        success: true,
        code: result.code,
        user: data.user,
        data,
      };
    } catch (error) {
      console.error('[AuthContext] Login error:', error);

      return {
        success: false,
        code: 0,
        error: error?.message || 'Login failed.',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // GOOGLE LOGIN
  // =========================

  const loginWithGoogle = useCallback(async id_token => {
    setLoading(true);

    try {
      console.log('[AuthContext] Google login started');

      const result = await AuthServices.loginWithGoogle(id_token);

      console.log('[AuthContext] Google login result:', result);

      if (!result?.success) {
        return result;
      }

      const data = result?.data;

      if (!data?.access_token) {
        return {
          success: false,
          code: result?.code,
          error: 'Google login failed: No access token received.',
        };
      }

      // Update React state
      setAccessToken(data.access_token);

      setRefreshToken(data.refresh_token || null);

      setUser(data.user || null);

      // Save SecureStore
      await tokenManager.setTokens(
        data.access_token,
        data.refresh_token || null,
      );

      await tokenManager.setUser(data.user || null);

      return {
        success: true,
        code: result.code,
        user: data.user,
        data,
      };
    } catch (error) {
      console.error('[AuthContext] Google login error:', error);

      return {
        success: false,
        code: 0,
        error: error?.message || 'Google login failed.',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // LOGOUT
  // =========================

  const logout = useCallback(async () => {
    try {
      console.log('[AuthContext] Logout started');

      const result = await AuthServices.logout(access_token);

      console.log('[AuthContext] Logout result:', result);

      /*
       * Clear local session when logout
       * succeeds on backend.
       */

      if (result?.success) {
        await tokenManager.clear();

        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);

        console.log('[AuthContext] Local session cleared');
      }

      return result;
    } catch (error) {
      console.error('[AuthContext] Logout error:', error);

      return {
        success: false,
        code: 0,
        error: error?.message || 'Logout failed.',
      };
    }
  }, [access_token]);

  // =========================
  // SIGNUP
  // =========================

  const signup = useCallback(async (name, email, password) => {
    setLoading(true);

    try {
      const result = await AuthServices.signup(name, email, password);

      console.log('[AuthContext] Signup result:', result);

      return result;
    } catch (error) {
      console.error('[AuthContext] Signup error:', error);

      return {
        success: false,
        code: 0,
        error: error?.message || 'Registration failed.',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // SEND OTP
  // =========================

  const sendOTP = useCallback(async email => {
    setLoading(true);

    try {
      const result = await AuthServices.sendOTP(email);

      console.log('[AuthContext] Send OTP result:', result);

      return result;
    } catch (error) {
      console.error('[AuthContext] Send OTP error:', error);

      return {
        success: false,
        code: 0,
        error: error?.message || 'Failed to send OTP.',
      };
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

      console.log('[AuthContext] Verify OTP result:', result);

      return result;
    } catch (error) {
      console.error('[AuthContext] Verify OTP error:', error);

      return {
        success: false,
        code: 0,
        error: error?.message || 'OTP verification failed.',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // FORGOT PASSWORD
  // =========================

  const forgotPassword = useCallback(async email => {
    setLoading(true);

    try {
      const result = await AuthServices.forgotPassword(email);

      console.log('[AuthContext] Forgot password result:', result);

      return result;
    } catch (error) {
      console.error('[AuthContext] Forgot password error:', error);

      return {
        success: false,
        code: 0,
        error: error?.message || 'Forgot password failed.',
      };
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
        const result = await AuthServices.updatePassword(
          email,
          new_password,
          current_password,
          otp,
        );

        console.log('[AuthContext] Update password result:', result);

        return result;
      } catch (error) {
        console.error('[AuthContext] Update password error:', error);

        return {
          success: false,
          code: 0,
          error: error?.message || 'Password update failed.',
        };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // =========================
  // LOAD SAVED SESSION
  // =========================

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        console.log('====================================');

        console.log('[AuthContext] Checking saved session...');

        /*
         * IMPORTANT:
         * All tokenManager methods are async.
         */

        const savedAccessToken = await tokenManager.getAccessToken();

        const savedRefreshToken = await tokenManager.getRefreshToken();

        const savedUser = await tokenManager.getUser();

        console.log('[AuthContext] Saved access token:', savedAccessToken);

        console.log('[AuthContext] Saved refresh token:', savedRefreshToken);

        console.log('[AuthContext] Saved user:', savedUser);

        if (!mounted) {
          return;
        }

        /*
         * USER IS LOGGED IN ONLY WHEN
         * ALL REQUIRED SESSION DATA EXISTS.
         */

        if (savedAccessToken && savedRefreshToken && savedUser) {
          console.log('[AuthContext] Valid saved session found');

          setAccessToken(savedAccessToken);

          setRefreshToken(savedRefreshToken);

          setUser(savedUser);
        } else {
          console.log('[AuthContext] No valid saved session');

          setAccessToken(null);
          setRefreshToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('[AuthContext] Session loading error:', error);

        if (mounted) {
          setAccessToken(null);
          setRefreshToken(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);

          console.log('[AuthContext] Session check completed');
        }
      }
    };

    loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================
  // TOKEN MANAGER LISTENER
  // =========================

  useEffect(() => {
    const unsubscribe = tokenManager.subscribe(
      ({ accessToken, refreshToken, user: managedUser, loggedOut }) => {
        console.log('[AuthContext] Token manager update:', {
          accessToken,
          refreshToken,
          managedUser,
          loggedOut,
        });

        setAccessToken(accessToken || null);

        setRefreshToken(refreshToken || null);

        if (loggedOut) {
          setUser(null);
        } else {
          setUser(managedUser || null);
        }
      },
    );

    return unsubscribe;
  }, []);

  // =========================
  // AUTHENTICATION STATE
  // =========================

  const isAuthenticated = Boolean(user) && Boolean(access_token);

  // =========================
  // DEBUG
  // =========================

  console.log('[AuthContext] CURRENT STATE:', {
    user,
    access_token,
    refresh_token,
    isAuthenticated,
    loading,
  });

  // =========================
  // CONTEXT VALUE
  // =========================

  const value = {
    user,
    access_token,
    refresh_token,
    isAuthenticated,
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

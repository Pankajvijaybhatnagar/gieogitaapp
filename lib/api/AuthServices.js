// lib/api/AuthServices.js
import { conf } from '@/lib/conf';
import apiRequest from './apiRequest';
import getDeviceHeaders from './deviceHeaders';
import tokenManager from './tokenManager';

const AuthServices = {
  // =========================
  // LOGIN
  // =========================
  async login(email, password) {
    try {
      const deviceHeaders = await getDeviceHeaders();
      const response = await fetch(`${conf.apiBaseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...deviceHeaders,
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        tokenManager.setTokens(data.access_token, data.refresh_token);
        return {
          success: true,
          code: response.status,
          data,
        };
      }
      return {
        success: false,
        code: response.status,
        error: data.message || 'Login failed',
      };
    } catch (error) {
      return {
        success: false,
        code: 0,
        error: error.message,
      };
    }
  },

  // =========================
  // GOOGLE LOGIN
  // =========================

  async loginWithGoogle(id_token) {
    try {
      const deviceHeaders = await getDeviceHeaders();
      const response = await fetch(`${conf.apiBaseURL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...deviceHeaders,
        },
        body: JSON.stringify({
          id_token,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        tokenManager.setTokens(data.access_token, data.refresh_token);
        return {
          success: true,
          code: response.status,
          data,
        };
      }
      return {
        success: false,
        code: response.status,
        error: data.message || 'Login failed',
      };
    } catch (error) {
      return {
        success: false,
        code: 0,
        error: error.message,
      };
    }
  },

  // =========================
  // APPLE LOGIN
  // =========================
  async loginWithApple(id_token, name) {
    try {
      const deviceHeaders = await getDeviceHeaders();
      const response = await fetch(`${conf.apiBaseURL}/auth/apple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...deviceHeaders,
        },
        body: JSON.stringify({
          id_token,
          name,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        tokenManager.setTokens(data.access_token, data.refresh_token);
        return {
          success: true,
          code: response.status,
          data,
        };
      }
      return {
        success: false,
        code: response.status,
        error: data.message || 'Apple login failed',
      };
    } catch (error) {
      return {
        success: false,
        code: 0,
        error: error.message,
      };
    }
  },

  // =========================
  // REGISTER
  // =========================
  async signup(name, email, password) {
    try {
      const response = await fetch(`${conf.apiBaseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        return {
          success: true,
          code: response.status,
          data,
        };
      }
      return {
        success: false,
        code: response.status,
        error: data.message || 'Registration failed',
      };
    } catch (error) {
      return {
        success: false,
        code: 0,
        error: error.message,
      };
    }
  },

  // =========================
  // SEND OTP
  // =========================
  async sendOTP(email) {
    try {
      const response = await fetch(`${conf.apiBaseURL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = {
          message: text,
        };
      }
      if (response.ok) {
        return {
          success: true,
          code: response.status,
          data,
        };
      }
      return {
        success: false,
        code: response.status,
        error: data.message || 'Failed to send OTP',
      };
    } catch (error) {
      return {
        success: false,
        code: 0,
        error: error.message,
      };
    }
  },

  // =========================
  // VERIFY OTP
  // =========================
  async verifyOTP(email, otp) {
    try {
      const response = await fetch(`${conf.apiBaseURL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        return {
          success: true,
          code: response.status,
          data,
        };
      }
      return {
        success: false,
        code: response.status,
        error: data.message || 'OTP Verification failed',
      };
    } catch (error) {
      return {
        success: false,
        code: 0,
        error: error.message,
      };
    }
  },

  // =========================
  // FORGOT PASSWORD
  // =========================
  async forgotPassword(email) {
    try {
      const response = await fetch(`${conf.apiBaseURL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        return {
          success: true,
          code: response.status,
          data,
        };
      }
      return {
        success: false,
        code: response.status,
        error: data.message || 'Forgot password failed',
      };
    } catch (error) {
      return {
        success: false,
        code: 0,
        error: error.message,
      };
    }
  },

  // =========================
  // UPDATE PASSWORD
  // =========================
  async updatePassword(email, new_password, current_password = '', otp = '') {
    try {
      const response = await fetch(`${conf.apiBaseURL}/auth/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          new_password,
          current_password,
          otp,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        return {
          success: true,
          code: response.status,
          data,
        };
      }
      return {
        success: false,
        code: response.status,
        error: data.message || 'Password update failed',
      };
    } catch (error) {
      return {
        success: false,
        code: 0,
        error: error.message,
      };
    }
  },

  // =========================
  // API FETCH
  // =========================
  async apiFetch(endpoint, options = {}, accessToken) {
    try {
      const headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await fetch(`${conf.apiBaseURL}/${endpoint}`, {
        ...options,
        headers,
      });
      return {
        success: response.ok,
        response,
        code: response.status,
      };
    } catch (error) {
      return {
        success: false,
        code: 0,
        error: error.message,
      };
    }
  },

  // =========================
  // LOGOUT
  // =========================
  async logout(accessToken) {
    try {
      const response = await apiRequest(
        'POST',
        `${conf.apiBaseURL}/auth/logout`,
        null,
        accessToken,
      );
      console.log('Logout response:', response);
      if (response.success) {
        tokenManager.clear();
        return {
          success: true,
          code: response.status,
          data: response.data,
        };
      }
      return {
        success: false,
        code: response.status,
        error: response.error || 'Logout failed',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        code: 0,
        error: error.message,
      };
    }
  },
};

export default AuthServices;

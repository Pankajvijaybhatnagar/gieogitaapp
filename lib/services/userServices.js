import apiRequest from "../api/apiRequest";
import { conf } from "../conf";


/**
 * USER SERVICES
 */
const userServices = {
  /**
   * GET USERS WITH FILTERS
   * Example filters: { limit: 10, page: 1, name: "ankit" }
   */
  async getUsers(filters = {}, token) {
    const params = new URLSearchParams(filters);
    const url = `${conf.apiBaseURL}/admin/users?${params.toString()}`;
    return apiRequest("GET", url, null, token);
  },

  /**
   * CREATE USER (Admin)
   */
  async createUser(userData, token) {
    const url = `${conf.apiBaseURL}/admin/users`;
    return apiRequest("POST", url, userData, token);
  },

  /**
   * UPDATE USER (Admin)
   * Requires: { id: number, name, email, role, ... }
   */
  async updateUser(payload, token) {
    const url = `${conf.apiBaseURL}/admin/users`;
    return apiRequest("PUT", url, payload, token);
  },

  /**
   * DELETE USER (Admin)
   * Requires: { id: number }
   */
  async deleteUser(payload, token) {
    const url = `${conf.apiBaseURL}/admin/users`;
    return apiRequest("DELETE", url, payload, token);
  },

  // get current user 
  async getCurrentUser(token) {
    const url = `${conf.apiBaseURL}/auth/profile`;
    return apiRequest("GET", url, null, token);
  },

  // update current user
  async updateCurrentUser(payload, token) {
    const url = `${conf.apiBaseURL}/auth/profile`;
    return apiRequest("POST", url, payload, token);
  },

  /**
 * ============================
 * SESSION SERVICES
 * ============================
 */

  /**
   * GET USER SESSIONS
   * Example: { page: 1, limit: 10, user_id: 5 }
   */
  async getSessions(filters = {}, token) {
    const params = new URLSearchParams(filters);
    const url = `${conf.apiBaseURL}/auth/sessions?${params.toString()}`;
    return apiRequest("GET", url, null, token);
  },

  /**
   * LOGOUT SINGLE SESSION
   * payload: { session_id: number }
   */
  async logoutSession(session_id, token) {
    const url = `${conf.apiBaseURL}/auth/sessions`;
    return apiRequest("DELETE", url, { session_id }, token);
  },

  /**
   * LOGOUT ALL DEVICES
   */
  async logoutAllSessions(token) {
    const url = `${conf.apiBaseURL}/auth/sessions`;
    return apiRequest("DELETE", url, { all: true }, token);
  },

  /**
 * UPDATE CURRENT USER PASSWORD
 * payload: { email, current_password, new_password }
 */
  async updatePassword(payload, token) {
    const url = `${conf.apiBaseURL}/auth/update-password`;

    const res = await apiRequest("POST", url, payload, token);

    // 🔥 Normalize response (VERY IMPORTANT)
    return {
      success: res.success && res.data?.status === true,
      status: res.status,
      message: res.data?.message,
      error: res.data?.message,
      raw: res,
    };
  }

};

export default userServices;

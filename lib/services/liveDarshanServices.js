// services/liveDarshanServices.js

import apiRequest from "../api/apiRequest";
import { conf } from "../conf";

/**
 * Generic API request helper function.
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {string} url - The full API endpoint URL
 * @param {object|FormData|null} body - The request body
 * @param {string|null} token - The auth token
 * @returns {Promise<object>} - { success: boolean, status: number, data: any, error?: string }
 */


/**
 * Collection of services for the Live Darshan API
 */
const liveDarshanServices = {
  
  /**
   * ADMIN: Create a new live darshan
   * @param {object} payload - The darshan data
   * @param {string} token - Admin auth token
   */
  createDarshan(payload, token) {
    return apiRequest("POST", `${conf.apiBaseURL}/admin/live-darshan`, payload, token);
  },

  /**
   * ADMIN: Update an existing live darshan
   * @param {object} payload - The darshan data (must include "id")
   * @param {string} token - Admin auth token
   */
  updateDarshan(payload, token) {
    return apiRequest("PUT", `${conf.apiBaseURL}/admin/live-darshan`, payload, token);
  },

  /**
   * ADMIN: Delete a live darshan
   * @param {object} payload - { "id": darshanId }
   * @param {string} token - Admin auth token
   */
  deleteDarshan(payload, token) {
    return apiRequest("DELETE", `${conf.apiBaseURL}/admin/live-darshan`, payload, token);
  },

  /**
   * ADMIN: Get live darshans with filters
   * @param {object} filters - e.g., { status: 'live', search: 'aarti' }
   * @param {string} token - Admin auth token
   */
  getAdminDarshans(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest("GET", `${conf.apiBaseURL}/admin/live-darshan?${params}`, null, token);
  },

  /**
   * PUBLIC: Get public-facing live darshans
   * @param {object} filters - e.g., { show: 'upcoming' } or { slug: '...' }
   */
  getPublicDarshans(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    // Note: No token is passed for this public route
    return apiRequest("GET", `${conf.apiBaseURL}/live-darshan?${params}`);
  }
};

export default liveDarshanServices;

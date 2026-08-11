import apiRequest from "../api/apiRequest";
import { conf } from "../conf";


const bhajanServices = {

  /* =======================
     ADMIN ROUTES
  ======================== */

  // ADMIN: CREATE BHAJAN
  createBhajan(payload, token) {
    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/admin/bhajans`,
      payload,
      token
    );
  },

  // ADMIN: UPDATE BHAJAN
  updateBhajan(payload, token) {
    return apiRequest(
      "PUT",
      `${conf.apiBaseURL}/admin/bhajans`,
      payload,
      token
    );
  },

  // ADMIN: DELETE BHAJAN
  deleteBhajan(payload, token) {
    return apiRequest(
      "DELETE",
      `${conf.apiBaseURL}/admin/bhajans`,
      payload,
      token
    );
  },

  // ADMIN: GET BHAJANS (FILTERS + PAGINATION)
  getAdminBhajans(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/bhajans?${params}`,
      null,
      token
    );
  },

  /* =======================
     PUBLIC ROUTES
  ======================== */

  // PUBLIC: GET BHAJANS (PLAYER LIST)
  getPublicBhajans(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/bhajans?${params}`
    );
  },

  // PUBLIC: GET SINGLE BHAJAN
  getPublicBhajan(id) {
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/bhajans?id=${id}`
    );
  },

  // PUBLIC: INCREMENT PLAY COUNT
  playBhajan(id) {
    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/bhajans`,
      { id }
    );
  }
};

export default bhajanServices;

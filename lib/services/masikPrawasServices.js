import apiRequest from "../api/apiRequest";
import { conf } from "../conf";

/**
 * Clean empty / invalid filters
 */
function cleanFilters(filters = {}) {
  const cleaned = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !(typeof value === "number" && isNaN(value))
    ) {
      cleaned[key] = value;
    }
  });

  return cleaned;
}

/**
 * Unified API request handler
 */


/**
 * Masik Prawas Services
 */
const masikPrawasServices = {

  /* ---------------- ADMIN ---------------- */

  create(payload, token) {
    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/admin/masik-prawas`,
      payload,
      token
    );
  },

  update(payload, token) {
    return apiRequest(
      "PUT",
      `${conf.apiBaseURL}/admin/masik-prawas`,
      payload,
      token
    );
  },

  delete(payload, token) {
    return apiRequest(
      "DELETE",
      `${conf.apiBaseURL}/admin/masik-prawas`,
      payload,
      token
    );
  },

  getAll(filters = {}, token) {
    const cleanedFilters = cleanFilters(filters);
    const params = new URLSearchParams(cleanedFilters).toString();

    const url = params
      ? `${conf.apiBaseURL}/admin/masik-prawas?${params}`
      : `${conf.apiBaseURL}/admin/masik-prawas`;

    return apiRequest("GET", url, null, token);
  },

  /* ---------------- PUBLIC ---------------- */

  getPublic(filters = {}) {
    const cleanedFilters = cleanFilters(filters);
    const params = new URLSearchParams(cleanedFilters).toString();

    const url = params
      ? `${conf.apiBaseURL}/masik-prawas?${params}`
      : `${conf.apiBaseURL}/masik-prawas`;

    return apiRequest("GET", url);
  }
};

export default masikPrawasServices;
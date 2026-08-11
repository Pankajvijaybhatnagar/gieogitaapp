import apiRequest from "../api/apiRequest";
import { conf } from "../conf";

// Reuse your global request helper


const newsletterServices = {
  /* ============================
     🔒 ADMIN ROUTES
  ============================ */

  // Create subscriber (Admin)
  create(payload, token) {
    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/admin/newsletter-subscribers`,
      payload,
      token
    );
  },

  // Update subscriber (Admin)
  update(payload, token) {
    return apiRequest(
      "PUT",
      `${conf.apiBaseURL}/admin/newsletter-subscribers`,
      payload,
      token
    );
  },

  // Delete subscriber (Admin)
  delete(payload, token) {
    return apiRequest(
      "DELETE",
      `${conf.apiBaseURL}/admin/newsletter-subscribers`,
      payload,
      token
    );
  },

  // Get all subscribers (Admin) with filters + pagination
  getAll(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/newsletter-subscribers?${params}`,
      null,
      token
    );
  },

  /* ============================
     🌍 PUBLIC ROUTES
  ============================ */

  // Public: Subscribe to newsletter
  subscribe(payload) {
    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/newsletter-subscribe`,
      payload
    );
  },

  // Public: Unsubscribe from newsletter
  unsubscribe(payload) {
    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/newsletter-unsubscribe`,
      payload
    );
  },

  // Public: (Optional) if you want public list access
  getPublic(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/newsletter-public?${params}`
    );
  },
};

export default newsletterServices;

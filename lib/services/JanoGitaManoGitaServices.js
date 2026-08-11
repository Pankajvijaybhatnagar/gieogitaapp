// /lib/services/janoGitaManoGitaServices.js

import apiRequest from "../api/apiRequest";
import { conf } from "../conf";

const janoGitaManoGitaServices = {

  // ===================================================
  // USER — REGISTRATION (PAID)
  // ===================================================

  /**
   * Create a new paid registration (one per person).
   * payload: { full_name, phone, email?, city?, state?, country? }
   * Response contains: registration_id, donation_id, amount,
   * payment.redirectURI, payment.tranCtx
   */
  register(payload, token) {
    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/jano-gita-mano-gita`,
      payload,
      token
    );
  },

  /**
   * Get all registrations done by the logged-in user
   * (for self or other persons) with status + donation details.
   * filters: { page?, limit?, status? }
   */
  getMyRegistrations(filters = {}, token) {

    // exclude empty valued filters
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) =>
          value !== null &&
          value !== undefined &&
          value !== ""
      )
    );

    const params =
      new URLSearchParams(cleanedFilters).toString();

    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/jano-gita-mano-gita${params ? `?${params}` : ""}`,
      null,
      token
    );
  },

  /**
   * Verify payment / retry payment / update details
   * for a registration (called after gateway redirect
   * or when user edits details before paying).
   *
   * payload: {
   *   registration_id,          // required
   *   full_name?, email?, phone?,
   *   city?, state?, country?
   * }
   *
   * Responses:
   * - payment completed  -> registration approved
   * - pending < 24 hrs   -> same redirectURI/tranCtx returned
   * - failed / > 24 hrs  -> new payment link returned
   */
  verifyOrRetryPayment(payload, token) {
    return apiRequest(
      "PUT",
      `${conf.apiBaseURL}/jano-gita-mano-gita`,
      payload,
      token
    );
  },

  // convenience wrapper: just verify by id (no detail changes)
  verifyPayment(registrationId, token) {
    return apiRequest(
      "PUT",
      `${conf.apiBaseURL}/jano-gita-mano-gita`,
      { registration_id: registrationId },
      token
    );
  },


  // ===================================================
  // ADMIN — REGISTRATIONS
  // ===================================================

  /**
   * Get all registrations (admin) with filters.
   * filters: { page?, limit?, status?, user_id?, donation_id?,
   *            city?, state?, country?, search? }
   * Empty valued filters are excluded before sending.
   */
  getAdminRegistrations(filters = {}, token) {

    // exclude empty valued filters
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) =>
          value !== null &&
          value !== undefined &&
          value !== ""
      )
    );

    const params =
      new URLSearchParams(cleanedFilters).toString();

    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/jano-gita-mano-gita${params ? `?${params}` : ""}`,
      null,
      token
    );
  },

  /**
   * Get single registration by id (admin)
   * with user + donation details.
   */
  getAdminRegistrationById(id, token) {
    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/admin/jano-gita-mano-gita`,
      { id },
      token
    );
  },

  /**
   * Update registration details (admin).
   * payload: { id, full_name?, email?, phone?,
   *            city?, state?, country?, status? }
   */
  updateAdminRegistration(payload, token) {
    return apiRequest(
      "PUT",
      `${conf.apiBaseURL}/admin/jano-gita-mano-gita`,
      payload,
      token
    );
  },

  /**
   * Change registration status only (admin shortcut).
   * status: "pending" | "approved" | "rejected"
   */
  changeAdminRegistrationStatus(id, status, token) {
    return apiRequest(
      "PUT",
      `${conf.apiBaseURL}/admin/jano-gita-mano-gita`,
      {
        id,
        action: "change_status",
        status
      },
      token
    );
  },

  approveAdminRegistration(id, token) {
    return janoGitaManoGitaServices
      .changeAdminRegistrationStatus(id, "approved", token);
  },

  rejectAdminRegistration(id, token) {
    return janoGitaManoGitaServices
      .changeAdminRegistrationStatus(id, "rejected", token);
  },

  /**
   * Delete registration (admin).
   * NOTE: backend blocks deletion (403) if the
   * registration fee is already paid.
   */
  deleteAdminRegistration(id, token) {
    return apiRequest(
      "DELETE",
      `${conf.apiBaseURL}/admin/jano-gita-mano-gita`,
      { id },
      token
    );
  },

  /**
   * Dashboard stats (admin):
   * { total, pending, approved, rejected }
   */
  getAdminRegistrationStats(token) {
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/jano-gita-mano-gita?stats=true`,
      null,
      token
    );
  },

  // status shortcut lists (admin)
  getAdminPendingRegistrations(filters = {}, token) {
    return janoGitaManoGitaServices.getAdminRegistrations(
      {
        ...filters,
        status: "pending"
      },
      token
    );
  },

  getAdminApprovedRegistrations(filters = {}, token) {
    return janoGitaManoGitaServices.getAdminRegistrations(
      {
        ...filters,
        status: "approved"
      },
      token
    );
  },

  getAdminRejectedRegistrations(filters = {}, token) {
    return janoGitaManoGitaServices.getAdminRegistrations(
      {
        ...filters,
        status: "rejected"
      },
      token
    );
  }
};

export default janoGitaManoGitaServices;
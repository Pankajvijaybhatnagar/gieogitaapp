import apiRequest from "../api/apiRequest";
import { conf } from "../conf";



const patrikaWhatsappServices = {
  /**
   * ADMIN: Schedule Patrika WhatsApp Campaign
   */
  schedulePatrika(payload, token) {
    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/admin/patrika-whatsapp`,
      payload,
      token,
    );
  },

  /**
   * ADMIN: Get All WhatsApp Jobs
   * filters: { status?, patrika_id?, id? }
   */
  getWhatsappJobs(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/patrika-whatsapp?${params}`,
      null,
      token,
    );
  },

  /**
   * ADMIN: Get Single WhatsApp Job
   */
  getWhatsappJob(jobId, token) {
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/patrika-whatsapp?id=${jobId}`,
      null,
      token,
    );
  },

  /**
   * ADMIN: Update WhatsApp Job
   */
  updateWhatsappJob(payload, token) {
    return apiRequest(
      "PUT",
      `${conf.apiBaseURL}/admin/patrika-whatsapp`,
      payload,
      token,
    );
  },

  /**
   * ADMIN: Delete WhatsApp Job
   */
  deleteWhatsappJob(jobId, token) {
    return apiRequest(
      "DELETE",
      `${conf.apiBaseURL}/admin/patrika-whatsapp`,
      { id: jobId },
      token,
    );
  },

  /**
   * ADMIN: Get Job Recipients
   * filters: { whatsapp_job_id, status?, search? }
   */
  getRecipients(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/patrika-whatsapp-recipients?${params}`,
      null,
      token,
    );
  },

  /**
   * ADMIN: Get WhatsApp Report
   */
  getReport(whatsappJobId, token) {
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/patrika-whatsapp-report?whatsapp_job_id=${whatsappJobId}`,
      null,
      token,
    );
  },

  /**
   * ADMIN: Export WhatsApp Report CSV
   */
  exportCSV(whatsappJobId, token) {
    const url = `${conf.apiBaseURL}/admin/patrika-whatsapp-export?whatsapp_job_id=${whatsappJobId}`;
    return fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /**
   * ADMIN: Retry Failed Messages
   */
  retryFailedJob(jobId, token) {
    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/admin/patrika-whatsapp-retry`,
      { whatsapp_job_id: jobId },
      token,
    );
  },

  /**
   * ADMIN: Trigger Immediate Send
   */
  sendNow(jobId, token) {
    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/admin/patrika-whatsapp-send-now`,
      { whatsapp_job_id: jobId },
      token,
    );
  },
};

export default patrikaWhatsappServices;

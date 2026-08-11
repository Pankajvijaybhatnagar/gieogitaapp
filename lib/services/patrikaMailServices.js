import apiRequest from "../api/apiRequest";
import { conf } from "../conf";



const patrikaMailServices = {

  /**
   * ---------------------------------------------------
   * ADMIN: Schedule Patrika Mail
   * ---------------------------------------------------
   */
  schedulePatrika(payload, token) {
    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/admin/patrika-mail`,
      payload,
      token
    );
  },

  /**
   * ---------------------------------------------------
   * ADMIN: Get all Patrika mail jobs
   * ---------------------------------------------------
   * filters: { status?, patrika_id? }
   */
  getMailJobs(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/patrika-mail?${params}`,
      null,
      token
    );
  },

  /**
   * ---------------------------------------------------
   * ADMIN: Update job (rare manual override)
   * ---------------------------------------------------
   */
  updateMailJob(payload, token) {
    return apiRequest(
      "PUT",
      `${conf.apiBaseURL}/admin/patrika-mail`,
      payload,
      token
    );
  },

  /**
   * ---------------------------------------------------
   * ADMIN: Get recipients of a Patrika mail job
   * ---------------------------------------------------
   * filters: { mail_job_id, status?, search? }
   */
  getRecipients(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/patrika-mail-recipients?${params}`,
      null,
      token
    );
  },

  /**
   * ---------------------------------------------------
   * ADMIN: Get report summary for a mail job
   * ---------------------------------------------------
   */
  getReport(mailJobId, token) {
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/patrika-mail-report?mail_job_id=${mailJobId}`,
      null,
      token
    );
  },

  /**
   * ---------------------------------------------------
   * ADMIN: Export CSV (browser note below)
   * ---------------------------------------------------
   * ⚠️ This should be opened in new tab or handled as blob
   */
  exportCSV(mailJobId, token) {
    const url = `${conf.apiBaseURL}/admin/patrika-mail-export?mail_job_id=${mailJobId}`;

    return fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

};

export default patrikaMailServices;

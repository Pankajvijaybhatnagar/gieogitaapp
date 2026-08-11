import apiRequest from "../api/apiRequest";
import { conf } from "../conf";



const jobApplicationServices = {
  // PUBLIC: SUBMIT A JOB APPLICATION
  submitApplication(payload) {
    return apiRequest("POST", `${conf.apiBaseURL}/job-applications`, payload);
  },

  // AUTHENTICATED USER: GET THEIR OWN APPLICATIONS
  getUserApplications(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest("GET", `${conf.apiBaseURL}/job-applications?${params}`, null, token);
  },

  // ADMIN: GET ALL JOB APPLICATIONS WITH FILTERS
  getAdminApplications(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest("GET", `${conf.apiBaseURL}/admin/job-applications?${params}`, null, token);
  },

  // ADMIN: UPDATE APPLICATION (status, details, etc.)
  updateApplication(payload, token) {
    return apiRequest("PUT", `${conf.apiBaseURL}/admin/job-applications`, payload, token);
  },

  // ADMIN: DELETE APPLICATION
  deleteApplication(payload, token) {
    return apiRequest("DELETE", `${conf.apiBaseURL}/admin/job-applications`, payload, token);
  }
};

export default jobApplicationServices;

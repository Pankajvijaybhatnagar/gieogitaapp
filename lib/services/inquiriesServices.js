import apiRequest from "../api/apiRequest";
import { conf } from "../conf";



const inquiriesServices = {
  createPublicInquiry(department, payload) {
    return apiRequest("POST", `${conf.apiBaseURL}/inquiry?department=${department}`, payload, null);
  },

  deleteInquiry(payload, token) {
    return apiRequest("DELETE", `${conf.apiBaseURL}/admin/inquiries`, payload, token);
  },
  updateInquiry(payload, token) {
    return apiRequest("PUT", `${conf.apiBaseURL}/admin/inquiries`, payload, token);
  },

  getInquiries(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest("GET", `${conf.apiBaseURL}/admin/inquiries?${params}`, null, token);
  },

};

export default inquiriesServices;

import apiRequest from "../api/apiRequest";
import { conf } from "../conf";



const careerServices = {
  // ADMIN: CREATE CAREER
  createCareer(payload, token) {
    return apiRequest("POST", `${conf.apiBaseURL}/admin/careers`, payload, token);
  },

  // ADMIN: UPDATE CAREER
  updateCareer(payload, token) {
    return apiRequest("PUT", `${conf.apiBaseURL}/admin/careers`, payload, token);
  },

  // ADMIN: DELETE CAREER
  deleteCareer(payload, token) {
    return apiRequest("DELETE", `${conf.apiBaseURL}/admin/careers`, payload, token);
  },

  // ADMIN: GET CAREERS (FILTERS)
  getAdminCareers(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest("GET", `${conf.apiBaseURL}/admin/careers?${params}`, null, token);
  },

  // PUBLIC CAREERS (GET ALL OPEN)
  getPublicCareers(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest("GET", `${conf.apiBaseURL}/careers?${params}`);
  },

 
};

export default careerServices;

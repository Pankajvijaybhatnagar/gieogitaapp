import apiRequest from "../api/apiRequest";
import { conf } from "../conf";



const questionSevaServices = {

  // ✅ PUBLIC: Submit Question (guest + logged-in)
  submitQuestion(payload, token = null) {
    return apiRequest("POST", `${conf.apiBaseURL}/question-seva`, payload, token);
  },

  // ✅ AUTH USER: Get own questions
  getUserQuestions(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest("GET", `${conf.apiBaseURL}/question-seva?${params}`, null, token);
  },

  // ✅ ADMIN: Get all questions
  getAdminQuestions(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest("GET", `${conf.apiBaseURL}/admin/question-seva?${params}`, null, token);
  },

  // ✅ ADMIN: Update question (answer, status, resolve)
  updateQuestion(payload, token) {
    return apiRequest("PUT", `${conf.apiBaseURL}/admin/question-seva`, payload, token);
  },

  // ✅ ADMIN: Delete question
  deleteQuestion(payload, token) {
    return apiRequest("DELETE", `${conf.apiBaseURL}/admin/question-seva`, payload, token);
  }

};

export default questionSevaServices;
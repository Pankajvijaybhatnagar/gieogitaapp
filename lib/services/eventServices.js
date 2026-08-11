import apiRequest from "../api/apiRequest";
import { conf } from "../conf";



const eventServices = {
  // ADMIN: CREATE EVENT
  createEvent(payload, token) {
    return apiRequest("POST", `${conf.apiBaseURL}/admin/events`, payload, token);
  },

  // ADMIN: UPDATE EVENT
  updateEvent(payload, token) {
    return apiRequest("PUT", `${conf.apiBaseURL}/admin/events`, payload, token);
  },

  // ADMIN: DELETE EVENT
  deleteEvent(payload, token) {
    return apiRequest("DELETE", `${conf.apiBaseURL}/admin/events`, payload, token);
  },

  // ADMIN: GET EVENTS (FILTERS)
  getAdminEvents(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest("GET", `${conf.apiBaseURL}/admin/events?${params}`, null, token);
  },

  // PUBLIC EVENTS
  getPublicEvents(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest("GET", `${conf.apiBaseURL}/events?${params}`);
  },

  // PUBLIC EVENT
  getPublicEvent(slug) {
    return apiRequest("GET", `${conf.apiBaseURL}/events?slug=${slug}`);
  }
};

export default eventServices;

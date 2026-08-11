import apiRequest from "../api/apiRequest";
import { conf } from "../conf";



const volunteerServices = {
  createProfile(payload, token) {
    return apiRequest("POST", `${conf.apiBaseURL}/volunteer`, payload, token);
  },

  updateProfile(payload, token) {
    return apiRequest("POST", `${conf.apiBaseURL}/volunteer`, payload, token);
  },

  getMyProfile(token) {
    return apiRequest("GET", `${conf.apiBaseURL}/volunteer`, null, token);
  },

  deleteProfile(token) {
    return apiRequest("DELETE", `${conf.apiBaseURL}/volunteer/profile`, null, token);
  },

  applyForVolunteering(payload, token) {
    return apiRequest("POST", `${conf.apiBaseURL}/volunteer/apply`, payload, token);
  },

  getMyApplications(token) {
    return apiRequest("GET", `${conf.apiBaseURL}/volunteer/applications`, null, token);
  },

  updateApplication(payload, token) {
    return apiRequest("PUT", `${conf.apiBaseURL}/volunteer/applications`, payload, token);
  },

  cancelApplication(payload, token) {
    return apiRequest("DELETE", `${conf.apiBaseURL}/volunteer/applications`, payload, token);
  },

  getAllVolunteers(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest("GET", `${conf.apiBaseURL}/admin/volunteers?${params}`, null, token);
  },

  getVolunteerById(id, token) {
    return apiRequest("GET", `${conf.apiBaseURL}/admin/volunteers?id=${id}`, null, token);
  },

  updateVolunteer(payload, token) {
    return apiRequest("PUT", `${conf.apiBaseURL}/admin/volunteers`, payload, token);
  },

  deleteVolunteer(payload, token) {
    return apiRequest("DELETE", `${conf.apiBaseURL}/admin/volunteers`, payload, token);
  },

  getAllApplications(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest("GET", `${conf.apiBaseURL}/admin/volunteer-applications?${params}`, null, token);
  },

  updateApplicationStatus(payload, token) {
    return apiRequest("PUT", `${conf.apiBaseURL}/admin/volunteer-applications`, payload, token);
  },

  deleteApplication(payload, token) {
    return apiRequest("DELETE", `${conf.apiBaseURL}/admin/volunteer-applications`, payload, token);
  },

  getMyAvailability(token) {
    return apiRequest("GET", `${conf.apiBaseURL}/volunteer-availability`, null, token);
  },

  replaceMyAvailability(payload, token) {
    return apiRequest("POST", `${conf.apiBaseURL}/volunteer-availability`, payload, token);
  },

  deleteMyAvailability(token) {
    return apiRequest("DELETE", `${conf.apiBaseURL}/volunteer-availability`, null, token);
  },

  // addig functions for /volunteer-skills 
  getMySkills(token) {
    return apiRequest("GET", `${conf.apiBaseURL}/volunteer-skills`, null, token);
  },

  replaceMySkills(payload, token) {
    return apiRequest("POST", `${conf.apiBaseURL}/volunteer-skills`, payload, token);
  },



  adminGetAvailability(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest("GET", `${conf.apiBaseURL}/admin/volunteer-availability?${params}`, null, token);
  },

  adminReplaceAvailability(payload, token) {
    return apiRequest("POST", `${conf.apiBaseURL}/admin/volunteer-availability`, payload, token);
  },

  adminUpdateAvailability(payload, token) {
    return apiRequest("PUT", `${conf.apiBaseURL}/admin/volunteer-availability`, payload, token);
  },

  adminDeleteAvailability(payload, token) {
    return apiRequest("DELETE", `${conf.apiBaseURL}/admin/volunteer-availability`, payload, token);
  }
};

export default volunteerServices;

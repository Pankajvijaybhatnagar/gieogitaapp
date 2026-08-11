import apiRequest from "../api/apiRequest";
import { conf } from "../conf";



const museumServices = {

  /**********************************************
   * CATEGORY APIS
   **********************************************/

  createCategory(payload, token) {
    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/admin/museum-ticket-categories`,
      payload,
      token
    );
  },

  updateCategory(payload, token) {
    return apiRequest(
      "PUT",
      `${conf.apiBaseURL}/admin/museum-ticket-categories`,
      payload,
      token
    );
  },

  deleteCategory(payload, token) {
    return apiRequest(
      "DELETE",
      `${conf.apiBaseURL}/admin/museum-ticket-categories`,
      payload,
      token
    );
  },

  getCategories(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();

    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/museum-ticket-categories?${params}`,
      null,
      token
    );
  },

  getCategory(id, token) {
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/museum-ticket-categories?id=${id}`,
      null,
      token
    );
  },

  /**********************************************
   * BOOKING APIS
   **********************************************/

  createBooking(payload, token) {
    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/admin/museum-bookings`,
      payload,
      token
    );
  },

  updateBooking(payload, token) {
    return apiRequest(
      "PUT",
      `${conf.apiBaseURL}/admin/museum-bookings`,
      payload,
      token
    );
  },

  deleteBooking(payload, token) {
    return apiRequest(
      "DELETE",
      `${conf.apiBaseURL}/admin/museum-bookings`,
      payload,
      token
    );
  },

  getBookings(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();

    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/museum-bookings?${params}`,
      null,
      token
    );
  },

  getBooking(id, token) {
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/museum-bookings?id=${id}`,
      null,
      token
    );
  },

  checkInBooking(id, token) {
    return apiRequest(
      "PUT",
      `${conf.apiBaseURL}/admin/museum-bookings`,
      {
        id,
        action: "checkin",
      },
      token
    );
  },

  cancelBooking(id, token) {
    return apiRequest(
      "PUT",
      `${conf.apiBaseURL}/admin/museum-bookings`,
      {
        id,
        action: "cancel",
      },
      token
    );
  },

  /**********************************************
   * REPORT APIS
   **********************************************/

  getDashboard(token) {
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/museum-reports`,
      null,
      token
    );
  },

  getStatistics(token) {
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/museum-reports?type=statistics`,
      null,
      token
    );
  },

  getTodayBookings(token) {
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/museum-reports?type=today-bookings`,
      null,
      token
    );
  },

  getTodayRevenue(token) {
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/museum-reports?type=today-revenue`,
      null,
      token
    );
  },

  getMonthlyRevenue(month, year, token) {
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/museum-reports?type=monthly-revenue&month=${month}&year=${year}`,
      null,
      token
    );
  },

  getCategorySales(token) {
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/museum-reports?type=category-sales`,
      null,
      token
    );
  },

  getTopCategories(limit = 5, token) {
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/museum-reports?type=top-categories&limit=${limit}`,
      null,
      token
    );
  },

  getSchoolBookings(token) {
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/museum-reports?type=school-bookings`,
      null,
      token
    );
  },

  getDailyVisitors(days = 30, token) {
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/museum-reports?type=daily-visitors&days=${days}`,
      null,
      token
    );
  },

  getPaymentStatus(token) {
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/museum-reports?type=payment-status`,
      null,
      token
    );
  }
};

export default museumServices;
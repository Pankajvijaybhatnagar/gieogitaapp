import apiRequest from "../api/apiRequest";
import { conf } from "../conf";



const donationServices = {

  /* ============================
     USER (AUTHENTICATED)
  ============================ */

  // CREATE DONATION
  createDonation(payload, token) {
    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/donations`,
      payload,
      token
    );
  },

  // GET LOGGED-IN USER DONATIONS
  getMyDonations(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/donations?${params}`,
      null,
      token
    );
  },

  // GET DONATION BY MERCHANT TXN NO
  getDonationByMerchantTxn(merchantTxnNo, token) {
    const params = new URLSearchParams({
      merchantTxnNo
    }).toString();

    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/donations?${params}`,
      null,
      token
    );
  },

  updateMyDonationStaus(token) {
    return apiRequest(
      "PUT",
      `${conf.apiBaseURL}/donations`,
      null,
      token
    );
  },

  /* ============================
     ADMIN
  ============================ */

  // ADMIN: GET ALL DONATIONS
  getAdminDonations(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/donations?${params}`,
      null,
      token
    );
  },

  // ADMIN: UPDATE DONATION STATUS / TRANSACTION
  updateDonation(token) {
    return apiRequest(
      "PUT",
      `${conf.apiBaseURL}/admin/donations`,
      null,
      token
    );
  },

  // ADMIN: GET DONATION STATS
  getDonationStats(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();

    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/donations-stats?${params}`,
      null,
      token
    );
  }
};

export default donationServices;

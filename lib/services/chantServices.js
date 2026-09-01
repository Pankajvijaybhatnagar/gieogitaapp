import apiRequest from '../api/apiRequest';
import { conf } from '../conf';

const chantServices = {
  // =========================
  // 🔱 ONE MINUTE CHANT
  // =========================

  createOneMinuteChant(payload, token) {
    return apiRequest(
      'POST',
      `${conf.apiBaseURL}/chants/one-minute/`,
      payload,
      token,
    );
  },

  getOneMinuteChants(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(
      'GET',
      `${conf.apiBaseURL}/chants/one-minute/?${params}`,
      null,
      token,
    );
  },

  deleteOneMinuteChant(payload, token) {
    return apiRequest(
      'DELETE',
      `${conf.apiBaseURL}/chants/one-minute/`,
      payload,
      token,
    );
  },

  getOneMinuteStats(token, year = null) {
    const params = year ? `?year=${year}` : '';
    return apiRequest(
      'GET',
      `${conf.apiBaseURL}/chants/one-minute/stats${params}`,
      null,
      token,
    );
  },

  // =========================
  // 📿 PURUSHOTTAM MAAS CHANT
  // =========================

  createPurushottamChant(payload, token) {
    return apiRequest(
      'POST',
      `${conf.apiBaseURL}/chants/purshotam-mass/`,
      payload,
      token,
    );
  },

  getPurushottamChants(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(
      'GET',
      `${conf.apiBaseURL}/chants/purshotam-mass/?${params}`,
      null,
      token,
    );
  },

  deletePurushottamChant(payload, token) {
    return apiRequest(
      'DELETE',
      `${conf.apiBaseURL}/chants/purshotam-mass/`,
      payload,
      token,
    );
  },

  getPurushottamStats(token, year = null) {
    const params = year ? `?year=${year}` : '';
    return apiRequest(
      'GET',
      `${conf.apiBaseURL}/chants/purshotam-mass/stats${params}`,
      null,
      token,
    );
  },

  // =========================
  // 🛠 ADMIN - ONE MINUTE
  // =========================

  getAdminOneMinuteChants(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(
      'GET',
      `${conf.apiBaseURL}/admin/chants/one-minute/?${params}`,
      null,
      token,
    );
  },

  getAdminOneMinuteStats(token, year = null) {
    const params = year ? `?year=${year}` : '';
    return apiRequest(
      'GET',
      `${conf.apiBaseURL}/admin/chants/one-minute/stats/?${params}`,
      null,
      token,
    );
  },

  // =========================
  // 🛠 ADMIN - PURUSHOTTAM MAAS
  // =========================

  getAdminPurushottamChants(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(
      'GET',
      `${conf.apiBaseURL}/admin/chants/purshotam-mass/?${params}`,
      null,
      token,
    );
  },

  getAdminPurushottamStats(token, year = null) {
    const params = year ? `?year=${year}` : '';
    return apiRequest(
      'GET',
      `${conf.apiBaseURL}/admin/chants/purshotam-mass/stats/?${params}`,
      null,
      token,
    );
  },

  getOneMinutePublicStats(years = 5) {
    const params = new URLSearchParams({
      years: String(years),
    }).toString();

    return apiRequest(
      'GET',
      `${conf.apiBaseURL}/chants/one-minute/public-stats?${params}`,
      null,
      null,
    );
  },
};

export default chantServices;

import apiRequest from '../api/apiRequest';
import { refreshToken } from '../api/tokenRefresh';
import { conf } from '../conf';

const masikPatrikaServices = {
  // =========================
  // Masik Patrika CRUD
  // =========================
  create(payload, token) {
    return apiRequest(
      'POST',
      `${conf.apiBaseURL}/admin/masik-patrika`,
      payload,
      token,
    );
  },

  update(payload, token) {
    return apiRequest(
      'PUT',
      `${conf.apiBaseURL}/admin/masik-patrika`,
      payload,
      token,
    );
  },

  delete(payload, token) {
    return apiRequest(
      'DELETE',
      `${conf.apiBaseURL}/admin/masik-patrika`,
      payload,
      token,
    );
  },

  getAll(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(
      'GET',
      `${conf.apiBaseURL}/admin/masik-patrika?${params}`,
      null,
      token,
    );
  },

  // =========================
  // Public Patrika
  // =========================
  getPublic(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return apiRequest('GET', `${conf.apiBaseURL}/masik-patrika?${params}`);
  },

  // =========================
  // Patrika Mail Schedule
  // =========================
  scheduleSend: {
    create(payload, token) {
      return apiRequest(
        'POST',
        `${conf.apiBaseURL}/admin/patrika-mail`,
        payload,
        token,
      );
    },

    getAll(filters = {}, token) {
      const params = new URLSearchParams(filters).toString();
      return apiRequest(
        'GET',
        `${conf.apiBaseURL}/admin/patrika-mail?${params}`,
        null,
        token,
      );
    },
    delete(payload, token) {
      return apiRequest(
        'DELETE',
        `${conf.apiBaseURL}/admin/patrika-mail`,
        payload,
        token,
      );
    },
  },

  // =========================
  // Patrika Mail Reports
  // =========================
  getMailRecipients(mailJobId, token) {
    return apiRequest(
      'GET',
      `${conf.apiBaseURL}/admin/patrika-mail-recipients?mail_job_id=${mailJobId}`,
      null,
      token,
    );
  },

  // =========================
  // Patrika Options (Dropdowns)
  // =========================
  getOptions(token) {
    return apiRequest(
      'GET',
      `${conf.apiBaseURL}/admin/masik-patrika`,
      null,
      token,
    ).then(res => {
      if (!res.success) return res;

      // create options array from patrika list
      const options = (res.data?.data || res.data || []).map(item => ({
        label: item.title,
        value: item.id,
      }));

      return {
        ...res,
        data: options,
      };
    });
  },
  // =========================
  // Admin Patrika Subscriptions
  // =========================

  getAdminPatrikaSubscriptions(filters = {}, token) {
    const params = new URLSearchParams(filters).toString();

    return apiRequest(
      'GET',
      `${conf.apiBaseURL}/admin/patrika-subscriptions?${params}`,
      null,
      token,
    );
  },

  getAdminPatrikaSubscriptionById(id, token) {
    return apiRequest(
      'POST',
      `${conf.apiBaseURL}/admin/patrika-subscriptions`,
      { id },
      token,
    );
  },

  updateAdminPatrikaSubscription(payload, token) {
    return apiRequest(
      'PUT',
      `${conf.apiBaseURL}/admin/patrika-subscriptions`,
      payload,
      token,
    );
  },

  deleteAdminPatrikaSubscription(id, token) {
    return apiRequest(
      'DELETE',
      `${conf.apiBaseURL}/admin/patrika-subscriptions`,
      { id },
      token,
    );
  },

  activateAdminPatrikaSubscription(id, token) {
    return apiRequest(
      'PUT',
      `${conf.apiBaseURL}/admin/patrika-subscriptions`,
      {
        id,
        status: 'active',
      },
      token,
    );
  },

  cancelAdminPatrikaSubscription(id, token) {
    return apiRequest(
      'PUT',
      `${conf.apiBaseURL}/admin/patrika-subscriptions`,
      {
        id,
        status: 'cancelled',
      },
      token,
    );
  },

  expireAdminPatrikaSubscription(id, token) {
    return apiRequest(
      'PUT',
      `${conf.apiBaseURL}/admin/patrika-subscriptions`,
      {
        id,
        status: 'expired',
      },
      token,
    );
  },

  getAdminPatrikaSubscriptionStats(token) {
    return apiRequest(
      'GET',
      `${conf.apiBaseURL}/admin/patrika-subscriptions-stats`,
      null,
      token,
    );
  },

  getAdminActivePatrikaSubscriptions(filters = {}, token) {
    const params = new URLSearchParams({
      ...filters,
      status: 'active',
    }).toString();

    return apiRequest(
      'GET',
      `${conf.apiBaseURL}/admin/patrika-subscriptions?${params}`,
      null,
      token,
    );
  },

  getAdminPendingPatrikaSubscriptions(filters = {}, token) {
    const params = new URLSearchParams({
      ...filters,
      status: 'pending',
    }).toString();

    return apiRequest(
      'GET',
      `${conf.apiBaseURL}/admin/patrika-subscriptions?${params}`,
      null,
      token,
    );
  },

  getAdminExpiredPatrikaSubscriptions(filters = {}, token) {
    const params = new URLSearchParams({
      ...filters,
      status: 'expired',
    }).toString();

    return apiRequest(
      'GET',
      `${conf.apiBaseURL}/admin/patrika-subscriptions?${params}`,
      null,
      token,
    );
  },

  // =========================
  // User Patrika Subscription
  // =========================
  subscribe(payload, token) {
    return apiRequest(
      'POST',
      `${conf.apiBaseURL}/patrika-subscription`,
      payload,
      token,
    );
  },

  checkSubscription(token) {
    return apiRequest(
      'GET',
      `${conf.apiBaseURL}/patrika-subscription`,
      null,
      token,
    );
  },

  getPatrika(token) {
    return apiRequest('GET', `${conf.apiBaseURL}/masik-patrika`, null, token);
  },

  getPatrikaBySlug: async (slug, token = null) => {
    const fetchPatrika = async accessToken => {
      const headers = {};

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      return fetch(
        `${conf.apiBaseURL}/masik-patrika?slug=${encodeURIComponent(slug)}`,
        {
          method: 'GET',
          headers,
        },
      );
    };

    try {
      // First request
      let response = await fetchPatrika(token);

      // Token expired
      if (response.status === 401 && token) {
        const newAccessToken = await refreshToken();

        if (!newAccessToken) {
          return {
            success: false,
            code: 401,
            error: 'Session expired',
          };
        }

        // Retry with new token
        response = await fetchPatrika(newAccessToken);
      }

      if (!response.ok) {
        return {
          success: false,
          code: response.status,
        };
      }

      // PDF response
      const blob = await response.blob();

      const isPreview = response.headers.get('X-Patrika-Preview') === 'true';

      return {
        success: true,
        data: blob,
        isPreview,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default masikPatrikaServices;

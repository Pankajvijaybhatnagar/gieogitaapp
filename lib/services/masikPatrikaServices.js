import * as FileSystem from 'expo-file-system/legacy';
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

  // Downloads the Patrika PDF straight to a cache file via expo-file-system
  // (first-party, already a project dependency) and returns its local
  // `file://` URI for react-native-pdf to render.
  //
  // This used to go through react-native-blob-util, whose Android code
  // independently double-checks that `bytesWritten === Content-Length`
  // before it will call a download successful — and rejects with
  // "Download interrupted." whenever that doesn't line up exactly, which
  // happens for reasons that have nothing to do with the transfer actually
  // failing (e.g. a reverse proxy gzip-compressing only the larger,
  // subscribed-tier PDF and not adjusting the advertised length). expo-
  // file-system's downloader has no such check: it simply streams the
  // response to disk until the connection closes and resolves with
  // whatever arrived, exactly like a browser would.
  getPatrikaBySlug: async (slug, token = null, onProgress = null) => {
    const url = `${conf.apiBaseURL}/masik-patrika?slug=${encodeURIComponent(slug)}`;
    const MAX_ATTEMPTS = 3;

    const safeSlug = String(slug).replace(/[^a-zA-Z0-9_-]/g, '-');
    const destUri = `${FileSystem.cacheDirectory}patrika-${safeSlug}.pdf`;

    const downloadPatrika = async accessToken => {
      // Ask the server/proxy not to gzip the response — belt-and-braces
      // against a compressed stream ending up shorter than whatever
      // Content-Length got advertised for the original file.
      const headers = { 'Accept-Encoding': 'identity' };

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const downloadable = FileSystem.createDownloadResumable(
        url,
        destUri,
        { headers },
        onProgress
          ? ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
              onProgress(totalBytesExpectedToWrite > 0 ? totalBytesWritten / totalBytesExpectedToWrite : 0);
            }
          : undefined,
      );

      const result = await downloadable.downloadAsync();

      if (!result) {
        throw new Error('The download was cancelled.');
      }

      return result;
    };

    // Retry a couple of times with a short backoff for genuine transient
    // network failures (DNS hiccup, connection reset, etc).
    const downloadWithRetry = async accessToken => {
      let lastError;

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        try {
          return await downloadPatrika(accessToken);
        } catch (err) {
          lastError = err;

          console.log(
            `[Patrika] Download attempt ${attempt}/${MAX_ATTEMPTS} failed:`,
            err?.message,
          );

          if (attempt < MAX_ATTEMPTS) {
            await new Promise(resolve => setTimeout(resolve, attempt * 800));
          }
        }
      }

      throw lastError;
    };

    try {
      let response = await downloadWithRetry(token);

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
        response = await downloadWithRetry(newAccessToken);
      }

      if (response.status < 200 || response.status >= 300) {
        FileSystem.deleteAsync(destUri, { idempotent: true }).catch(() => {});

        return {
          success: false,
          code: response.status,
        };
      }

      const headers = response.headers || {};
      const isPreview =
        headers['X-Patrika-Preview'] === 'true' ||
        headers['x-patrika-preview'] === 'true';

      return {
        success: true,
        data: { fileUri: response.uri, path: response.uri },
        isPreview,
      };
    } catch (error) {
      console.log('[Patrika] Download failed after retries:', error?.message);

      return {
        success: false,
        error: error?.message || 'Unable to download Patrika.',
      };
    }
  },
};

export default masikPatrikaServices;

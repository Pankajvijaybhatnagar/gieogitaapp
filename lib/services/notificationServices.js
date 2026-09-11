import apiRequest from "../api/apiRequest";
import { conf } from "../conf";

const createQueryString = (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const queryString = params.toString();

  return queryString ? `?${queryString}` : "";
};

const notificationServices = {
  /*
  |--------------------------------------------------------------------------
  | USER NOTIFICATIONS
  |--------------------------------------------------------------------------
  */

  // USER: REGISTER WEB OR EXPO PUSH SUBSCRIPTION
  registerSubscription(payload, token) {
    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/notifications/register`,
      payload,
      token,
    );
  },

  // USER: REGISTER BROWSER PUSH SUBSCRIPTION
  registerWebSubscription(subscription, token, deviceInfo = null) {
    const subscriptionData = subscription.toJSON();

    const payload = {
      platform: "web",
      token: subscriptionData.endpoint,
      p256dh: subscriptionData.keys?.p256dh,
      auth_key: subscriptionData.keys?.auth,
      device_info: deviceInfo || navigator.userAgent,
    };

    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/notifications/register`,
      payload,
      token,
    );
  },

  // USER: REGISTER EXPO PUSH TOKEN
  registerExpoSubscription(expoPushToken, token, deviceInfo = null) {
    const payload = {
      platform: "expo",
      token: expoPushToken,
      device_info: deviceInfo,
    };

    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/notifications/register`,
      payload,
      token,
    );
  },

  // USER: GET NOTIFICATIONS
  getNotifications(filters = {}, token) {
    const query = createQueryString(filters);

    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/notifications/${query}`,
      null,
      token,
    );
  },

  // USER: MARK ONE NOTIFICATION AS READ
  markAsRead(notificationId, token) {
    return apiRequest(
      "PUT",
      `${conf.apiBaseURL}/notifications/mark-read`,
      { id: notificationId },
      token,
    );
  },

  // USER: MARK ALL NOTIFICATIONS AS READ
  markAllAsRead(token) {
    return apiRequest(
      "PUT",
      `${conf.apiBaseURL}/notifications/mark-read`,
      { all: true },
      token,
    );
  },

  // USER: MARK MULTIPLE NOTIFICATIONS AS SEEN
  markAsSeen(notificationIds, token) {
    return apiRequest(
      "PUT",
      `${conf.apiBaseURL}/notifications/mark-seen`,
      { ids: notificationIds },
      token,
    );
  },

  // USER: UNREGISTER WEB OR EXPO SUBSCRIPTION
  unregisterSubscription(pushToken, token) {
    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/notifications/unregister`,
      { token: pushToken },
      token,
    );
  },

  /*
  |--------------------------------------------------------------------------
  | ADMIN DIRECT NOTIFICATIONS
  |--------------------------------------------------------------------------
  */

  // ADMIN: SEND NOTIFICATION TO ONE OR MULTIPLE USERS
  sendToUsers(payload, token) {
    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/admin/notifications/send-to-user`,
      payload,
      token,
    );
  },

  // ADMIN: SEND NOTIFICATION TO ONE USER
  sendToUser(userId, notification, token) {
    const payload = {
      user_id: userId,
      title: notification.title,
      body: notification.body,
      type: notification.type || "admin",
      image_url: notification.image_url || null,
      data: notification.data || {},
    };

    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/admin/notifications/send-to-user`,
      payload,
      token,
    );
  },

  // ADMIN: SEND NOTIFICATION TO MULTIPLE USERS
  sendToMultipleUsers(userIds, notification, token) {
    const payload = {
      user_ids: userIds,
      title: notification.title,
      body: notification.body,
      type: notification.type || "admin",
      image_url: notification.image_url || null,
      data: notification.data || {},
    };

    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/admin/notifications/send-to-user`,
      payload,
      token,
    );
  },

  /*
  |--------------------------------------------------------------------------
  | ADMIN CAMPAIGNS
  |--------------------------------------------------------------------------
  */

  // ADMIN: CREATE NOTIFICATION CAMPAIGN
  createCampaign(payload, token) {
    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/admin/notifications/campaigns`,
      payload,
      token,
    );
  },

  // ADMIN: GET NOTIFICATION CAMPAIGNS
  getCampaigns(filters = {}, token) {
    const query = createQueryString(filters);

    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/notifications/campaigns${query}`,
      null,
      token,
    );
  },

  // ADMIN: UPDATE NOTIFICATION CAMPAIGN
  updateCampaign(payload, token) {
    return apiRequest(
      "PUT",
      `${conf.apiBaseURL}/admin/notifications/campaigns`,
      payload,
      token,
    );
  },

  // ADMIN: CANCEL NOTIFICATION CAMPAIGN
  cancelCampaign(campaignId, token) {
    return apiRequest(
      "DELETE",
      `${conf.apiBaseURL}/admin/notifications/campaigns`,
      { id: campaignId },
      token,
    );
  },

  // ADMIN: PROCESS CAMPAIGN NOW
  sendCampaignNow(campaignId, token) {
    return apiRequest(
      "POST",
      `${conf.apiBaseURL}/admin/notifications/send-now`,
      { id: campaignId },
      token,
    );
  },

  // ADMIN: GET CAMPAIGN STATISTICS
  getCampaignStats(campaignId, token) {
    return apiRequest(
      "GET",
      `${conf.apiBaseURL}/admin/notifications/campaign-stats?id=${encodeURIComponent(
        campaignId,
      )}`,
      null,
      token,
    );
  },
};

export default notificationServices;

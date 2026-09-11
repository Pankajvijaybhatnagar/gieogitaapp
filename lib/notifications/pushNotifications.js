// lib/notifications/pushNotifications.js
//
// Thin wrapper around expo-notifications for getting/registering/unregistering
// the device's Expo push token with the backend (see notificationServices).
// Backend uses Expo Push, so this is all we need on the client — no Firebase
// config, no p256dh/auth_key (those are web-push only).

import * as Device from 'expo-device';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import notificationServices from '@/lib/services/notificationServices';

// Local, per-device preference — separate from OS permission. Lets a user
// turn push off inside the app without having to go into system settings,
// and stops registerForPushNotificationsAsync from being called again on
// the next launch/login while it's off.
const NOTIFICATIONS_ENABLED_KEY = 'push_notifications_enabled';

export async function getNotificationPreferenceAsync() {
  try {
    const stored = await SecureStore.getItemAsync(NOTIFICATIONS_ENABLED_KEY);
    // Defaults to enabled — matches prior always-on behavior for anyone
    // who hasn't touched the new toggle yet.
    return stored === null ? true : stored === 'true';
  } catch (error) {
    console.warn(
      '[pushNotifications] Failed to read notification preference:',
      error,
    );
    return true;
  }
}

export async function setNotificationPreferenceAsync(enabled) {
  try {
    await SecureStore.setItemAsync(
      NOTIFICATIONS_ENABLED_KEY,
      enabled ? 'true' : 'false',
    );
  } catch (error) {
    console.warn(
      '[pushNotifications] Failed to save notification preference:',
      error,
    );
  }
}

// Controls how a notification is presented while the app is in the
// foreground. Must be set once, at module load, before any notification
// can arrive.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const getProjectId = () =>
  Constants?.expoConfig?.extra?.eas?.projectId ||
  Constants?.easConfig?.projectId ||
  null;

// Expo push tokens aren't tied to a Device/session — reading it doesn't
// require permission, but the OS will simply never deliver anything until
// permission has been granted.
async function readExpoPushTokenAsync() {
  if (!Device.isDevice) return null;

  const projectId = getProjectId();

  const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined,
  );

  return expoPushToken || null;
}

function buildDeviceInfo() {
  return `${Device.brand ?? ''} ${Device.modelName ?? ''} (${Platform.OS} ${Platform.Version})`.trim();
}

// Requests permission (if needed), grabs the device's Expo push token and
// registers it with the backend. Safe to call on every app launch/login —
// the backend upserts on token, so re-registering is cheap.
export async function registerForPushNotificationsAsync(authToken) {
  if (!authToken || !Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const expoPushToken = await readExpoPushTokenAsync();
  if (!expoPushToken) return null;

  const result = await notificationServices.registerExpoSubscription(
    expoPushToken,
    authToken,
    buildDeviceInfo(),
  );

  if (!result?.success) {
    console.warn(
      '[pushNotifications] Failed to register push subscription:',
      result?.error,
    );
    return null;
  }

  return expoPushToken;
}

// Unregisters the device's current Expo push token from the backend. Call
// this with the still-valid auth token, before it's cleared on logout.
export async function unregisterForPushNotificationsAsync(authToken) {
  if (!authToken || !Device.isDevice) return;

  try {
    const expoPushToken = await readExpoPushTokenAsync();
    if (!expoPushToken) return;

    await notificationServices.unregisterSubscription(expoPushToken, authToken);
  } catch (error) {
    console.warn(
      '[pushNotifications] Failed to unregister push subscription:',
      error,
    );
  }
}

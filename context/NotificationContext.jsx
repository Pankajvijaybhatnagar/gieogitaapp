// context/NotificationContext.jsx
//
// Owns the push-notification lifecycle (register on login, unregister on
// logout, listen for foreground/tap events) and the notification-center
// state (list, unread count, mark read/seen) so both the header bell and
// the notifications screen can share one source of truth.

import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import { useAuth } from '@/context/AuthContext';
import {
    getNotificationPreferenceAsync,
    registerForPushNotificationsAsync,
    setNotificationPreferenceAsync,
    unregisterForPushNotificationsAsync,
} from '@/lib/notifications/pushNotifications';
import notificationServices from '@/lib/services/notificationServices';

const PAGE_LIMIT = 20;

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider',
    );
  }

  return context;
};

// No per-notification-type detail screens exist in this app yet (only the
// notification center itself), so every type routes there for now. Update
// this once dedicated detail screens (job application, inquiry, donation…)
// land.
function navigateForNotification(data) {
  switch (data?.type) {
    case 'job-application':
    case 'inquiry':
    case 'donation':
    case 'campaign':
    case 'custom':
    case 'admin':
    default:
      router.push('/home/notifications');
  }
}

export const NotificationProvider = ({ children }) => {
  const { access_token, isAuthenticated } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Local, per-device toggle — null while the stored preference is still
  // being read, then true/false. Defaults to enabled.
  const [notificationsEnabled, setNotificationsEnabledState] = useState(null);

  // Kept so we can unregister the device's push token on logout, after
  // AuthContext has already cleared access_token from state.
  const lastTokenRef = useRef(null);

  useEffect(() => {
    if (access_token) lastTokenRef.current = access_token;
  }, [access_token]);

  useEffect(() => {
    getNotificationPreferenceAsync().then(setNotificationsEnabledState);
  }, []);

  // =========================
  // FETCH NOTIFICATIONS
  // =========================

  const fetchNotifications = useCallback(
    async ({ reset = false } = {}) => {
      if (!access_token) return;

      const nextPage = reset ? 1 : page;

      if (reset) setRefreshing(true);
      else setLoading(true);

      try {
        const result = await notificationServices.getNotifications(
          { page: nextPage, limit: PAGE_LIMIT },
          access_token,
        );

        if (!result?.success) return;

        const body = result.data || {};
        const items = Array.isArray(body.data) ? body.data : [];

        setNotifications(prev => (reset ? items : [...prev, ...items]));
        setUnreadCount(body.unread_count ?? 0);
        setHasMore(items.length === PAGE_LIMIT);
        setPage(nextPage + 1);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [access_token, page],
  );

  const refresh = useCallback(
    () => fetchNotifications({ reset: true }),
    [fetchNotifications],
  );

  const loadMore = useCallback(() => {
    if (loading || refreshing || !hasMore) return;
    fetchNotifications();
  }, [loading, refreshing, hasMore, fetchNotifications]);

  // =========================
  // MARK READ / SEEN
  // =========================

  const markAsRead = useCallback(
    async notificationId => {
      if (!access_token) return;

      setNotifications(prev =>
        prev.map(item =>
          item.id === notificationId ? { ...item, is_read: true } : item,
        ),
      );
      setUnreadCount(count => Math.max(0, count - 1));

      await notificationServices.markAsRead(notificationId, access_token);
    },
    [access_token],
  );

  const markAllAsRead = useCallback(async () => {
    if (!access_token) return;

    setNotifications(prev => prev.map(item => ({ ...item, is_read: true })));
    setUnreadCount(0);

    await notificationServices.markAllAsRead(access_token);
  }, [access_token]);

  const markAsSeen = useCallback(
    async notificationIds => {
      if (!access_token || !notificationIds?.length) return;

      await notificationServices.markAsSeen(notificationIds, access_token);
    },
    [access_token],
  );

  // =========================
  // REGISTER / UNREGISTER PUSH TOKEN
  // =========================

  useEffect(() => {
    if (isAuthenticated && access_token) {
      fetchNotifications({ reset: true });

      // notificationsEnabled starts out null until the stored preference
      // has loaded — skip registering until we actually know it's on.
      if (notificationsEnabled) {
        registerForPushNotificationsAsync(access_token);
      }
      return;
    }

    // Just logged out (or session ended) — unregister with the last token
    // we had, then drop local state.
    if (lastTokenRef.current) {
      unregisterForPushNotificationsAsync(lastTokenRef.current);
      lastTokenRef.current = null;
    }

    setNotifications([]);
    setUnreadCount(0);
    setPage(1);
    setHasMore(true);
    // fetchNotifications intentionally omitted — it changes on every page
    // update and would re-run this effect on each fetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, access_token, notificationsEnabled]);

  // =========================
  // TOGGLE NOTIFICATIONS ON/OFF
  // =========================

  // Returns both the applied state and the OS permission state. A missing
  // token can mean permission was denied, but it can also mean token/backend
  // registration failed after permission was already granted.
  const setNotificationsEnabled = useCallback(
    async enabled => {
      if (!enabled) {
        if (access_token) {
          await unregisterForPushNotificationsAsync(access_token);
        }

        await setNotificationPreferenceAsync(false);
        setNotificationsEnabledState(false);
        return { applied: true, permissionGranted: true };
      }

      const token = access_token
        ? await registerForPushNotificationsAsync(access_token)
        : null;

      const applied = Boolean(token);
      const permission = await Notifications.getPermissionsAsync();
      const permissionGranted = permission.status === 'granted';

      await setNotificationPreferenceAsync(applied);
      setNotificationsEnabledState(applied);
      return { applied, permissionGranted };
    },
    [access_token],
  );

  // =========================
  // FOREGROUND + TAP LISTENERS
  // =========================

  useEffect(() => {
    const receivedSub = Notifications.addNotificationReceivedListener(() => {
      // A push arrived while the app was open — refresh the list/badge.
      if (isAuthenticated) refresh();
    });

    const responseSub = Notifications.addNotificationResponseReceivedListener(
      response => {
        const data = response.notification.request.content.data;
        navigateForNotification(data);
      },
    );

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, [isAuthenticated, refresh]);

  const value = {
    notifications,
    unreadCount,
    loading,
    refreshing,
    hasMore,

    refresh,
    loadMore,
    markAsRead,
    markAllAsRead,
    markAsSeen,

    notificationsEnabled,
    setNotificationsEnabled,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

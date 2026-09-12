// app/home/notifications.jsx
//
// Reached from the header's bell icon. Backed by NotificationContext, which
// fetches the real notification list/unread count via notificationServices
// and keeps the header badge in sync.

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import Spacer from '@/components/ui/Spacer';
import { COLORS, RGB } from '@/constants/brandColors';
import { radii, shadow, spacing, type } from '@/constants/theme';
import { useNotifications } from '@/context/NotificationContext';

function timeAgo(dateString) {
  if (!dateString) return '';

  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(dateString).toLocaleDateString();
}

function NotificationItem({ item, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, !item.is_read && styles.cardUnread]}
      activeOpacity={0.85}
      onPress={() => onPress(item)}>
      {!item.is_read && <View style={styles.unreadDot} />}

      <View style={styles.cardIconRing}>
        <Ionicons
          name="notifications-outline"
          size={18}
          color={COLORS.richBrown}
        />
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title || 'Notification'}
        </Text>

        {!!item.body && (
          <Text style={styles.cardText} numberOfLines={2}>
            {item.body}
          </Text>
        )}

        <Text style={styles.cardTime}>{timeAgo(item.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const {
    notifications,
    unreadCount,
    loading,
    refreshing,
    refresh,
    loadMore,
    markAsRead,
    markAllAsRead,
    markAsSeen,
  } = useNotifications();

  const seenIdsRef = useRef(new Set());

  useEffect(() => {
    refresh();
    // Only on mount — refresh identity changes with access_token, not on
    // every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mark whatever's currently visible as "seen" (distinct from "read",
  // which only happens on open) without spamming the endpoint on every
  // render.
  useEffect(() => {
    const unseenIds = notifications
      .filter(item => !seenIdsRef.current.has(item.id))
      .map(item => item.id);

    if (!unseenIds.length) return;

    unseenIds.forEach(id => seenIdsRef.current.add(id));
    markAsSeen(unseenIds);
  }, [notifications, markAsSeen]);

  const handleOpen = useCallback(
    item => {
      if (!item.is_read) markAsRead(item.id);

      const data = item.data || {};
      switch (data.type || item.type) {
        // No per-type detail screens exist yet — everything lands back on
        // this list for now.
        default:
          break;
      }
    },
    [markAsRead],
  );

  return (
    <View style={styles.root}>
      <FlatList
        data={notifications}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <NotificationItem item={item} onPress={handleOpen} />
        )}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.4}
        onEndReached={loadMore}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={COLORS.richBrown}
          />
        }
        ListHeaderComponent={
          <View style={styles.hero}>
            <View style={styles.heroBanner}>
              <View style={styles.heroPatternOne} />
              <View style={styles.heroPatternTwo} />

              <TouchableOpacity
                style={styles.backButton}
                activeOpacity={0.8}
                onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={22} color={COLORS.white} />
              </TouchableOpacity>

              {unreadCount > 0 && (
                <TouchableOpacity
                  style={styles.clearAllButton}
                  activeOpacity={0.8}
                  onPress={markAllAsRead}>
                  <Text style={styles.clearAllText}>Mark all read</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.heroIconRing}>
              <View style={styles.heroIcon}>
                <Ionicons
                  name="notifications"
                  size={30}
                  color={COLORS.richBrown}
                />
              </View>
            </View>

            <Text style={styles.heroTitle}>Notifications</Text>
            <View style={styles.heroDivider} />
          </View>
        }
        ListEmptyComponent={
          !loading && !refreshing ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconRing}>
                <Ionicons
                  name="notifications-off-outline"
                  size={36}
                  color={COLORS.warmBrown}
                />
              </View>

              <Text style={styles.emptyTitle}>You&apos;re All Caught Up</Text>

              <Text style={styles.emptyText}>
                You don&apos;t have any notifications right now. We&apos;ll let
                you know here as soon as there&apos;s something new.
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          <>
            {loading && notifications.length > 0 ? (
              <ActivityIndicator
                style={styles.footerLoader}
                color={COLORS.richBrown}
              />
            ) : null}
            <Spacer height={120} />
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },

  /* HERO */
  hero: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
    marginBottom: spacing.md,
  },
  heroBanner: {
    width: '100%',
    height: 110,
    backgroundColor: COLORS.richBrown,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPatternOne: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    top: -55,
    left: -40,
  },
  heroPatternTwo: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    right: -70,
    top: -80,
  },
  backButton: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  clearAllButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(0,0,0,0.22)',
    zIndex: 10,
  },
  clearAllText: {
    ...type.footnote,
    color: COLORS.white,
    fontWeight: '600',
  },
  heroIconRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -42,
    ...shadow.raised,
    shadowColor: COLORS.richBrown,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `rgba(${RGB.maroon},0.1)`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    marginTop: spacing.sm,
    ...type.title,
    fontSize: 22,
    color: COLORS.deepBrown,
  },
  heroDivider: {
    width: 40,
    height: 3,
    borderRadius: radii.pill,
    backgroundColor: COLORS.gold,
    marginTop: spacing.sm,
  },

  /* LIST */
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.sm + 4,
    borderRadius: radii.lg,
    backgroundColor: COLORS.white,
    ...shadow.card,
  },
  cardUnread: {
    backgroundColor: `rgba(${RGB.saffron},0.05)`,
  },
  unreadDot: {
    position: 'absolute',
    top: spacing.sm + 4,
    right: spacing.sm + 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.saffron,
  },
  cardIconRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    ...type.headline,
    fontSize: 15,
    color: COLORS.deepBrown,
  },
  cardText: {
    ...type.body,
    fontSize: 13,
    color: COLORS.warmBrown,
    marginTop: 2,
  },
  cardTime: {
    ...type.footnote,
    color: COLORS.warmBrown,
    marginTop: spacing.xs,
    opacity: 0.7,
  },

  /* EMPTY STATE */
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  emptyIconRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...type.headline,
    fontSize: 18,
    color: COLORS.deepBrown,
    marginBottom: spacing.xs,
  },
  emptyText: {
    ...type.body,
    color: COLORS.warmBrown,
    textAlign: 'center',
  },

  footerLoader: {
    marginTop: spacing.md,
  },
});

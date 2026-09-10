// app/home/notifications.jsx
//
// Reached from the header's bell icon. There is no notifications backend
// wired up yet, so this shows a proper, honest empty state rather than
// inventing fake notification items.

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS, RGB } from '@/constants/brandColors';
import { radii, shadow, spacing, type } from '@/constants/theme';

export default function NotificationsScreen() {
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* HERO BANNER — same pattern used across the app */}
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
          </View>

          <View style={styles.heroIconRing}>
            <View style={styles.heroIcon}>
              <Ionicons name="notifications" size={30} color={COLORS.richBrown} />
            </View>
          </View>

          <Text style={styles.heroTitle}>Notifications</Text>
          <View style={styles.heroDivider} />
        </View>

        {/* EMPTY STATE */}
        <View style={styles.emptyState}>
          <View style={styles.emptyIconRing}>
            <Ionicons name="notifications-off-outline" size={36} color={COLORS.warmBrown} />
          </View>

          <Text style={styles.emptyTitle}>You&apos;re All Caught Up</Text>

          <Text style={styles.emptyText}>
            You don&apos;t have any notifications right now. We&apos;ll let you know
            here as soon as there&apos;s something new.
          </Text>
        </View>
      </ScrollView>
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
});

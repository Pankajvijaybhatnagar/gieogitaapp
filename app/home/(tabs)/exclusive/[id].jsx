// app/home/(tabs)/exclusive/[id].jsx
//
// Detail page for the "Exclusive Content" cards on the home screen.
// Two of the five cards (Gita Prerna, Ek Minute Ek Saath Gita Path) point
// straight at the existing Reading / Chants tabs, where that content
// already lives in full. The other three open here.

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import GitaText from '@/components/common/GitaText';
import AshtaDashShalokiGita from '@/components/join/AshtaDashShalokiGita';
import Card from '@/components/ui/Card';
import Spacer from '@/components/ui/Spacer';
import { COLORS, RGB } from '@/constants/brandColors';
import { radii, shadow, spacing, type } from '@/constants/theme';

/* ============================================================
   CONTENT
   ------------------------------------------------------------
   Only the items that don't already have a home elsewhere in
   the app live here — Gita Prerna and Ek Minute Ek Saath Gita
   Path redirect to Reading / Chants instead (see below).
============================================================ */

const EXCLUSIVE_DETAILS = {
  2: {
    icon: '📿',
    title: 'Ashtadash Shaloki Gita',
    subtitle: 'Eighteen verses said to hold the essence of the Bhagwad Gita',
    render: 'ashtadash',
  },
  3: {
    icon: '🪔',
    title: 'Purushottam Yoga',
    subtitle: 'Chapter 15 of the Bhagwad Gita — the Yoga of the Supreme Person',
    body: [
      'In this chapter, Shri Krishna describes the eternal tree of the material world — its roots above and its branches spread below — and explains how one must cut this tree with the axe of detachment to reach the imperishable, original position.',
      'He then reveals the nature of the Purushottama, the Supreme Person who is beyond both the perishable material world and the imperishable individual soul, and who pervades and sustains the entire universe.',
      'Reflecting on the teachings of this chapter is said to remove doubt and lead one towards a clear understanding of one’s highest duty and the ultimate goal of life.',
    ],
  },
  4: {
    icon: '📖',
    title: 'Sapta Shloki Gita',
    subtitle:
      'Seven verses said to carry the complete essence of the Bhagwad Gita',
    body: [
      'Sapta Shloki Gita is a small, traditional collection of seven verses drawn from the Bhagwad Gita, believed by many devotees to condense the scripture’s teaching into a form that can be easily remembered and recited every day.',
      'These verses are often chanted as a daily reminder of the Gita’s core message — performing one’s duty without attachment to results, and surrendering with devotion to the Divine.',
    ],
  },
};

// Cards that already have a proper home elsewhere in the app.
const REDIRECTS = {
  1: '/home/(tabs)/reading',
  5: '/home/(tabs)/chants',
};

export default function ExclusiveDetail() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const redirectTo = REDIRECTS[id];
  const detail = EXCLUSIVE_DETAILS[id];

  if (redirectTo) {
    router.replace(redirectTo);
    return null;
  }

  if (!detail) {
    return (
      <View style={styles.notFound}>
        <TouchableOpacity
          style={styles.notFoundBack}
          activeOpacity={0.8}
          onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.white} />
        </TouchableOpacity>

        <GitaText style={styles.notFoundIcon} />
        <Text style={styles.notFoundTitle}>Content Not Found</Text>
        <Text style={styles.notFoundText}>
          This piece of exclusive content isn&apos;t available right now.
        </Text>

        <TouchableOpacity
          style={styles.notFoundButton}
          activeOpacity={0.85}
          onPress={() => router.back()}>
          <Text style={styles.notFoundButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* HERO BANNER — same premium banner + overlapping badge pattern
            used across the app (Join GIEO Gita, Profile screen). */}
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

            <Text style={styles.heroOm}></Text>
          </View>

          <View style={styles.heroIconRing}>
            <View style={styles.heroIcon}>
              <Text style={styles.heroIconText}>{detail.icon}</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>{detail.title}</Text>
          <View style={styles.heroDivider} />
          <Text style={styles.heroSubtitle}>{detail.subtitle}</Text>
        </View>

        {/* BODY */}

        {detail.render === 'ashtadash' ? (
          <AshtaDashShalokiGita />
        ) : (
          <Card radius={radii.xl} style={styles.bodyCard}>
            {detail.body.map((paragraph, index) => (
              <Text
                key={index}
                style={[
                  styles.bodyText,
                  index < detail.body.length - 1 && styles.bodyTextSpacing,
                ]}>
                {paragraph}
              </Text>
            ))}
          </Card>
        )}

        <Spacer height={120} />
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
    marginBottom: spacing.sm,
  },
  heroBanner: {
    width: '100%',
    height: 128,
    backgroundColor: COLORS.richBrown,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPatternOne: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    top: -65,
    left: -50,
  },
  heroPatternTwo: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    right: -80,
    top: -90,
  },
  heroOm: {
    color: 'rgba(255,255,255,0.14)',
    fontSize: 68,
    fontWeight: '700',
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
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -46,
    ...shadow.raised,
    shadowColor: COLORS.richBrown,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `rgba(${RGB.maroon},0.1)`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.cream,
  },
  heroIconText: {
    fontSize: 32,
  },
  heroTitle: {
    marginTop: spacing.sm,
    ...type.title,
    fontSize: 23,
    color: COLORS.deepBrown,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  heroDivider: {
    width: 40,
    height: 3,
    borderRadius: radii.pill,
    backgroundColor: COLORS.gold,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    ...type.subhead,
    color: COLORS.warmBrown,
    marginTop: 2,
    paddingHorizontal: spacing.xl,
    textAlign: 'center',
  },

  /* BODY */
  bodyCard: {
    marginHorizontal: spacing.md,
    padding: spacing.lg,
  },
  bodyText: {
    ...type.body,
    color: COLORS.deepBrown,
  },
  bodyTextSpacing: {
    marginBottom: spacing.md,
  },

  /* NOT FOUND */
  notFound: {
    flex: 1,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  notFoundBack: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.richBrown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundIcon: {
    fontSize: 44,
    marginBottom: spacing.sm,
  },
  notFoundTitle: {
    ...type.title,
    fontSize: 20,
    color: COLORS.deepBrown,
    marginBottom: spacing.xs,
  },
  notFoundText: {
    ...type.body,
    color: COLORS.warmBrown,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  notFoundButton: {
    backgroundColor: COLORS.richBrown,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm + 4,
  },
  notFoundButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
});

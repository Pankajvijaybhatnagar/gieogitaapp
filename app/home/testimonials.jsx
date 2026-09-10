// app/home/testimonials.jsx
//
// "View All" destination for the home page's Testimonials section.
// Shows every entry from lib/data/testimonialsData.js as a full, classy
// quote card — same premium banner-hero pattern used elsewhere in the app.

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { COLORS, RGB } from '@/constants/brandColors';
import { radii, shadow, spacing, type } from '@/constants/theme';
import { testimonials } from '@/lib/data/testimonialsData';

function Stars({ rating = 5 }) {
  return (
    <View style={styles.starRow}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Ionicons
          key={i}
          name={i < rating ? 'star' : 'star-outline'}
          size={14}
          color={COLORS.gold}
        />
      ))}
    </View>
  );
}

function TestimonialCard({ item }) {
  return (
    <View style={styles.card}>
      <Text style={styles.quoteMark}>❝</Text>

      <View style={styles.headerRow}>
        <Image
          source={{ uri: item.imgSrc }}
          style={styles.avatar}
          contentFit="cover"
          transition={200}
        />

        <View style={styles.identity}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
      </View>

      <Stars rating={item.rating} />

      <Text style={styles.quote}>{item.text}</Text>
    </View>
  );
}

function Hero({ count }) {
  return (
    <View style={styles.hero}>
      <View style={styles.heroBanner}>
        <View style={styles.heroPatternOne} />
        <View style={styles.heroPatternTwo} />
        <Text style={styles.heroQuoteBg}>❝</Text>
      </View>

      <View style={styles.heroIconRing}>
        <View style={styles.heroIcon}>
          <Text style={styles.heroIconText}>❝</Text>
        </View>
      </View>

      <Text style={styles.heroTitle}>Testimonials</Text>
      <View style={styles.heroDivider} />
      <Text style={styles.heroSubtitle}>
        {count} voices on the message of the Bhagavad Gita
      </Text>
    </View>
  );
}

export default function TestimonialsScreen() {
  return (
    <FlatList
      style={styles.root}
      data={testimonials}
      keyExtractor={(item, index) => `${item.name}-${index}`}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={<Hero count={testimonials.length} />}
      renderItem={({ item }) => <TestimonialCard item={item} />}
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },

  /* HERO — same banner + overlapping badge pattern used across the app */
  hero: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
    marginHorizontal: -spacing.md,
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
  heroQuoteBg: {
    color: 'rgba(255,255,255,0.14)',
    fontSize: 84,
    fontWeight: '700',
  },
  heroIconRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -44,
    ...shadow.raised,
    shadowColor: COLORS.richBrown,
  },
  heroIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: `rgba(${RGB.maroon},0.1)`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.cream,
  },
  heroIconText: {
    fontSize: 26,
    color: COLORS.saffron,
    fontWeight: '700',
  },
  heroTitle: {
    marginTop: spacing.sm,
    ...type.title,
    fontSize: 23,
    color: COLORS.deepBrown,
    textAlign: 'center',
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

  /* CARD */
  card: {
    backgroundColor: COLORS.white,
    borderRadius: radii.xl,
    padding: spacing.lg,
    ...shadow.card,
    position: 'relative',
    overflow: 'hidden',
  },
  quoteMark: {
    position: 'absolute',
    top: 4,
    right: spacing.md,
    fontSize: 64,
    color: `rgba(${RGB.gold}, 0.16)`,
    fontWeight: '700',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: COLORS.gold,
    backgroundColor: COLORS.creamDark,
  },
  identity: {
    flex: 1,
  },
  name: {
    ...type.headline,
    fontSize: 16,
    color: COLORS.deepBrown,
  },
  title: {
    ...type.footnote,
    fontSize: 12,
    color: COLORS.warmBrown,
    marginTop: 2,
  },
  starRow: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: spacing.sm,
  },
  quote: {
    ...type.body,
    fontSize: 14.5,
    lineHeight: 22,
    color: COLORS.deepBrown,
  },
});

// app/home/exclusive-all.jsx
//
// "See All" destination for the home page's Exclusive Content section.
// Shows every item from components/home/constant.js's exclusiveContent
// list in a two-column gallery. Tapping a card opens the same detail
// page the home-page cards already use.

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { exclusiveContent } from '@/components/home/constant';
import Card from '@/components/ui/Card';
import Spacer from '@/components/ui/Spacer';
import { COLORS, RGB } from '@/constants/brandColors';
import { radii, shadow, spacing, type } from '@/constants/theme';

function GridCard({ item, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.cardWrap}>
      <Card radius={radii.lg} style={styles.card}>
        <ImageBackground
          source={require('@/assets/images/krishna-bg.jpg')}
          resizeMode="cover"
          style={styles.cardImg}>
          <LinearGradient
            colors={['rgba(41,24,36,0.08)', 'rgba(41,24,36,0.7)']}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.iconMedallion}>
            <Text style={styles.cardIcon}>{item.icon}</Text>
          </View>

          {!!item.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}
        </ImageBackground>

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.cardMeta} numberOfLines={1}>
            {item.meta}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

function Hero({ count }) {
  return (
    <View style={styles.hero}>
      <View style={styles.heroBanner}>
        <View style={styles.heroPatternOne} />
        <View style={styles.heroPatternTwo} />
        <Text style={styles.heroOm}></Text>
      </View>

      <View style={styles.heroIconRing}>
        <View style={styles.heroIcon}>
          <Text style={styles.heroIconText}>✦</Text>
        </View>
      </View>

      <Text style={styles.heroTitle}>Exclusive Content</Text>
      <View style={styles.heroDivider} />
      <Text style={styles.heroSubtitle}>
        {count} handpicked pieces of Gita wisdom, curated for you
      </Text>
    </View>
  );
}

export default function ExclusiveAllScreen() {
  const router = useRouter();

  return (
    <FlatList
      style={styles.root}
      data={exclusiveContent}
      keyExtractor={item => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={<Hero count={exclusiveContent.length} />}
      ListFooterComponent={<Spacer height={120} />}
      renderItem={({ item }) => (
        <GridCard
          item={item}
          onPress={() => router.push(`/home/(tabs)/exclusive/${item.id}`)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  row: {
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },

  /* HERO — same banner + overlapping badge pattern used across the app */
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
    fontSize: 30,
    color: COLORS.saffron,
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

  /* GRID CARDS */
  cardWrap: {
    flex: 1,
  },
  card: {
    marginBottom: spacing.sm,
  },
  cardImg: {
    width: '100%',
    height: 110,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconMedallion: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: COLORS.saffron,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: COLORS.white,
    ...type.caption,
    fontSize: 9,
  },
  cardBody: {
    padding: spacing.sm + 2,
  },
  cardTitle: {
    color: COLORS.deepBrown,
    ...type.headline,
    fontSize: 13.5,
    lineHeight: 18,
  },
  cardMeta: {
    color: COLORS.warmBrown,
    ...type.footnote,
    fontSize: 11,
    marginTop: 3,
    opacity: 0.75,
  },
});

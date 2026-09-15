import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { gradients } from '@/constants/theme';
import { radii, shadow, spacing, type } from '@/constants/theme';
import { COLORS, servicesList } from './constant';
import { SectionHeader } from './Sharedui';

function ServiceCard({ item, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={styles.card}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.cardBg} resizeMode="cover" />
      ) : (
        <LinearGradient
          colors={gradients.temple}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardBg}
        />
      )}

      <LinearGradient
        colors={['rgba(20,10,8,0.05)', 'rgba(20,10,8,0.85)']}
        style={styles.cardOverlay}
      />

      <View style={styles.cardIconBadge}>
        <Ionicons name={item.icon} size={18} color={COLORS.white} />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>

        <Text style={styles.desc} numberOfLines={2}>
          {item.desc}
        </Text>

        <View style={styles.footerRow}>
          <Text style={styles.exploreText}>Explore</Text>
          <View style={styles.arrowCircle}>
            <Ionicons name="arrow-forward" size={12} color={COLORS.richBrown} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ServicesSection() {
  const router = useRouter();

  return (
    <>
      <SectionHeader title="Our" accent="Services" icon="apps-outline" />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_GAP}
        snapToAlignment="start"
        contentContainerStyle={styles.hScrollContent}>
        {servicesList.map(item => (
          <ServiceCard
            key={item.title}
            item={item}
            onPress={() => router.push(item.route)}
          />
        ))}
      </ScrollView>
    </>
  );
}

const CARD_WIDTH = 200;
const CARD_HEIGHT = 240;
const CARD_GAP = 14;

const styles = StyleSheet.create({
  hScrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: radii.xl,
    overflow: 'hidden',
    backgroundColor: COLORS.creamDark,
    ...shadow.raised,
    shadowColor: COLORS.richBrown,
  },
  cardBg: {
    ...StyleSheet.absoluteFillObject,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cardIconBadge: {
    position: 'absolute',
    top: spacing.sm + 2,
    left: spacing.sm + 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.md,
  },
  title: {
    ...type.headline,
    fontSize: 15.5,
    color: COLORS.white,
  },
  desc: {
    ...type.footnote,
    fontSize: 11,
    color: 'rgba(255,255,255,0.82)',
    marginTop: 4,
    lineHeight: 15,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm + 2,
  },
  exploreText: {
    ...type.caption,
    fontSize: 10,
    color: COLORS.gold,
  },
  arrowCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

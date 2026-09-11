import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { RGB } from '@/constants/brandColors';
import { DESIGN } from '@/constants/design';
import { radii, spacing, type } from '@/constants/theme';
import { COLORS, exclusiveContent } from './constant';
import { SectionHeader } from './Sharedui';

function ExclusiveCard({ item }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={styles.excCardShadow}
      onPress={() => router.push(`/home/(tabs)/exclusive/${item.id}`)}>
      <ImageBackground
        source={require('@/assets/images/krishna-bg.jpg')}
        resizeMode="cover"
        style={styles.excCardImg}
        imageStyle={styles.excCardImageRadius}>
        {/* Vignette on both ends — the source photo is busy/bright, so the
            top eyebrow tag needs its own darkening, not just the bottom. */}
        <LinearGradient
          colors={[
            'rgba(20,10,8,0.55)',
            'rgba(20,10,8,0.05)',
            'rgba(20,10,8,0.25)',
            'rgba(20,10,8,0.88)',
          ]}
          locations={[0, 0.28, 0.55, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.topRow}>
          <View style={styles.eyebrowPill}>
            <Text style={styles.eyebrowText}>{item.meta}</Text>
          </View>

          {item.badge ? (
            <View style={styles.excBadge}>
              <Text style={styles.excBadgeText}>{item.badge}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.excCardTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.playCircle}>
            <Text style={styles.playGlyph}>▶</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

export default function ExclusiveContent() {
  const router = useRouter();

  return (
    <>
      <SectionHeader
        title="✦ Exclusive"
        accent="Content"
        onSeeAll={() => router.push('/home/exclusive-all')}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hScrollContent}>
        {exclusiveContent.map(item => (
          <ExclusiveCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  hScrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
    gap: spacing.md
  },
  // Shadow lives on this outer layer — the image itself needs its own
  // rounded-corner clipping (via `imageStyle`), which would otherwise
  // suppress the shadow.
  excCardShadow: {
    width: 270,
    borderRadius: radii.lg,
    shadowColor: COLORS.richBrown,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6
  },
  excCardImg: {
    width: '100%',
    height: 190,
    backgroundColor: COLORS.creamDark,
    justifyContent: 'space-between',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: `rgba(${RGB.gold}, 0.4)`,
    overflow: 'hidden',
    padding: spacing.sm + 2
  },
  excCardImageRadius: {
    borderRadius: radii.lg
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  eyebrowPill: {
    backgroundColor: 'rgba(20,10,8,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: radii.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
    maxWidth: '78%'
  },
  eyebrowText: {
    ...type.caption,
    fontSize: 9,
    letterSpacing: 1,
    color: '#FFFFFF'
  },
  excBadge: {
    backgroundColor: COLORS.saffron,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  excBadgeText: {
    color: COLORS.white,
    ...type.caption,
    fontSize: 10
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.sm
  },
  excCardTitle: {
    flex: 1,
    fontFamily: DESIGN.fonts.editorial,
    color: COLORS.white,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.2,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4
  },
  playCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  playGlyph: {
    fontSize: 11,
    color: COLORS.richBrown,
    marginLeft: 2
  }
});

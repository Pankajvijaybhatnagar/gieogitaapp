import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Animated, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RGB } from '@/constants/brandColors';
import { DESIGN } from '@/constants/design';
import { radii, spacing, type } from '@/constants/theme';
import { COLORS } from './constant';
import { SectionHeader } from './Sharedui';

export default function LiveDarshan() {
  const router = useRouter();

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.2, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();

    // Broadcasting ring — expands and fades around the play button, looping.
    Animated.loop(
      Animated.timing(ringAnim, { toValue: 1, duration: 1800, useNativeDriver: true })
    ).start();
  }, []);

  const ringScale = ringAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] });
  const ringOpacity = ringAnim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.5, 0.15, 0] });

  return (
    <>
      <SectionHeader title="🔴 Live" accent="Darshan" />

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push('/home/livedarshan')}
        style={styles.wrapper}
      >
        <View style={styles.cardShadow}>
          <ImageBackground
            source={require('@/assets/images/hero3.png')}
            resizeMode="cover"
            style={styles.card}
            imageStyle={styles.cardImageRadius}>
            <LinearGradient
              colors={['rgba(20,10,8,0.15)', 'rgba(20,10,8,0.35)', 'rgba(20,10,8,0.85)']}
              locations={[0, 0.45, 1]}
              style={StyleSheet.absoluteFillObject}
            />

            {/* LIVE badge */}
            <View style={styles.liveBadge}>
              <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
              <Text style={styles.liveBadgeText}>LIVE NOW</Text>
            </View>

            {/* Center play button with broadcasting ring */}
            <View style={styles.playWrap} pointerEvents="none">
              <Animated.View
                style={[
                  styles.playRing,
                  { transform: [{ scale: ringScale }], opacity: ringOpacity },
                ]}
              />
              <View style={styles.playButton}>
                <Ionicons name="play" size={22} color="#FFFFFF" style={styles.playIcon} />
              </View>
            </View>

            {/* Bottom content */}
            <View style={styles.bottomRow}>
              <View style={styles.textCol}>
                <Text style={styles.title} numberOfLines={1}>Gita Gyan Sansthanam</Text>
                <Text style={styles.subtitle} numberOfLines={1}>Kurukshetra Mandir · Live Aarti</Text>
              </View>

              <View style={styles.watchChip}>
                <Text style={styles.watchChipText}>Watch</Text>
                <Ionicons name="arrow-forward" size={12} color={COLORS.richBrown} />
              </View>
            </View>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: spacing.lg
  },
  // Shadow lives on this outer layer — the image needs its own rounded
  // clipping (via `imageStyle`), which would otherwise suppress the shadow.
  cardShadow: {
    borderRadius: radii.xl,
    shadowColor: COLORS.richBrown,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
    elevation: 8
  },
  card: {
    height: 190,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: `rgba(${RGB.gold}, 0.35)`,
    overflow: 'hidden',
    padding: spacing.md
  },
  cardImageRadius: {
    borderRadius: radii.xl
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: 'rgba(214,72,58,0.9)',
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF'
  },
  liveBadgeText: {
    ...type.caption,
    fontSize: 10,
    letterSpacing: 1,
    color: '#FFFFFF'
  },
  playWrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  playRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  playButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  playIcon: {
    marginLeft: 3
  },
  bottomRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.sm
  },
  textCol: {
    flex: 1
  },
  title: {
    fontFamily: DESIGN.fonts.editorial,
    color: '#FFFFFF',
    fontSize: 18,
    letterSpacing: -0.2,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4
  },
  subtitle: {
    ...type.footnote,
    color: 'rgba(255,255,255,0.82)',
    marginTop: 3
  },
  watchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  watchChipText: {
    ...type.caption,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.richBrown
  }
});

import { DESIGN } from '@/constants/design';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { C } from './constants';

export default function HeroSection() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.hero, { opacity: fadeAnim }]}>
      <View style={styles.heroBlob1} />
      <View style={styles.heroBlob2} />
      {/* <Text style={styles.heroOm}></Text> */}

      <View style={styles.heroPill}>
        <Text style={styles.heroPillText}>✦ GIEO GITA • SEVA & DONATION ✦</Text>
      </View>

      <Text style={styles.heroTitle}>
        Be Part Of{'\n'}
        <Text style={styles.heroTitleAccent}>Gita Seva</Text>
      </Text>

      <Text style={styles.heroDesc}>
        Every donation is a divine offering to Shri Krishna. Your seva supports
        temple rituals, cow protection, Vedic education and care for the needy —
        performed in your name with full devotion.
      </Text>

      <View style={styles.heroPillsRow}>
        {[
          '🎂 Birthday Rituals',
          '📿 Performed in Your Name',
          '🐄 Gau Seva',
        ].map(p => (
          <View key={p} style={styles.heroFeaturePill}>
            <Text style={styles.heroFeaturePillText}>{p}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: C.creamDark,
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 22,
    position: 'relative',
    overflow: 'hidden',
    borderBottomEndRadius: 90,
  },
  heroBlob1: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(179,149,98,0.08)',
    top: -80,
    right: -60,
  },
  heroBlob2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(166,83,56,0.08)',
    bottom: -50,
    left: -40,
  },
  heroOm: {
    position: 'absolute',
    right: 20,
    top: 10,
    fontSize: 100,
    color: 'rgba(179,149,98,0.05)',
    lineHeight: 110,
  },
  heroPill: {
    backgroundColor: 'rgba(179,149,98,0.12)',
    borderWidth: 1,
    borderColor: C.goldBorder,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  heroPillText: {
    fontSize: 10,
    color: C.goldDark,
    letterSpacing: 2,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '400',
    color: C.deepBrown,
    lineHeight: 34,
    marginBottom: 10,
    fontFamily: DESIGN.fonts.editorial,
    letterSpacing: -0.4,
  },
  heroTitleAccent: {
    color: C.saffron,
  },
  heroDesc: {
    fontSize: 13,
    color: C.warmBrown,
    lineHeight: 20,
    marginBottom: 16,
  },
  heroPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  heroFeaturePill: {
    backgroundColor: 'rgba(166,83,56,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(166,83,56,0.35)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  heroFeaturePillText: {
    fontSize: 10,
    color: C.saffron,
    fontWeight: '700',
  },
});

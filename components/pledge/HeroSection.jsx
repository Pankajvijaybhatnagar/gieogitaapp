import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { C } from './constants';

export default function HeroSection() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.hero, { opacity: fadeAnim }]}>
      <View style={styles.heroBlob1} />
      <View style={styles.heroBlob2} />
      <Text style={styles.heroOm}>ॐ</Text>

      <View style={styles.heroPill}>
        <Text style={styles.heroPillText}>✦ GIEO GITA  •  SEVA & DONATION ✦</Text>
      </View>

      <Text style={styles.heroTitle}>
        Be Part Of{'\n'}
        <Text style={styles.heroTitleAccent}>Gita Seva</Text>
      </Text>

      <Text style={styles.heroDesc}>
        Every donation is a divine offering to Shri Krishna. Your seva supports temple rituals,
        cow protection, Vedic education and care for the needy — performed in your name with full
        devotion.
      </Text>

      <View style={styles.heroPillsRow}>
        {['🎂 Birthday Rituals', '📿 Performed in Your Name', '🐄 Gau Seva'].map((p) => (
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
    backgroundColor: C.deepBrown,
    paddingTop: 24, paddingBottom: 28, paddingHorizontal: 22,
    position: 'relative', overflow: 'hidden',
  },
  heroBlob1: {
    position: 'absolute', width: 240, height: 240, borderRadius: 120,
    backgroundColor: 'rgba(201,162,39,0.06)', top: -80, right: -60,
  },
  heroBlob2: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(74,44,13,0.2)', bottom: -50, left: -40,
  },
  heroOm: { position: 'absolute', right: 20, top: 10, fontSize: 100, color: 'rgba(201,162,39,0.05)', lineHeight: 110 },

  heroPill: {
    backgroundColor: 'rgba(201,162,39,0.12)', borderWidth: 1, borderColor: C.goldBorder,
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5,
    alignSelf: 'flex-start', marginBottom: 16,
  },
  heroPillText:     { fontSize: 9, color: C.goldLight, letterSpacing: 2, fontWeight: '800' },
  heroTitle:        { fontSize: 28, fontWeight: '800', color: C.cream, lineHeight: 34, marginBottom: 10 },
  heroTitleAccent:  { color: C.goldLight },
  heroDesc:         { fontSize: 13, color: 'rgba(253,246,227,0.7)', lineHeight: 20, fontStyle: 'italic', marginBottom: 16 },
  heroPillsRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  heroFeaturePill: {
    backgroundColor: 'rgba(232,114,28,0.15)', borderWidth: 1,
    borderColor: 'rgba(232,114,28,0.35)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  heroFeaturePillText: { fontSize: 10, color: C.saffronLight, fontWeight: '700' },
});
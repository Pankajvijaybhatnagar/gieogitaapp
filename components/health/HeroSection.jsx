import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { C, SPECIALTIES } from './constants';

export default function HeroSection({ onBookPress }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.hero, { opacity: fadeAnim }]}>
      <View style={styles.heroBlob1} />
      <View style={styles.heroBlob2} />
      <Text style={styles.heroOm}>ॐ</Text>

      <View style={styles.medantaBadge}>
        <View style={styles.medantaDot} />
        <Text style={styles.medantaBadgeText}>MEDANTA  •  FREE HEALTH SERVICES</Text>
      </View>

      <Text style={styles.heroTitle}>
        Free Healthcare{'\n'}
        <Text style={styles.heroTitleAccent}>At Gita Gyan</Text>
        {'\n'}Sansthanam
      </Text>

      <Text style={styles.heroDesc}>
        Medanta — The Medicity, in partnership with GIEO GITA, offers free world-class health
        services to all devotees and visitors at Gita Gyan Sansthanam, Kurukshetra.
      </Text>

      <View style={styles.heroPillsRow}>
        {['🆓 100% Free', '🏥 Medanta Doctors', '📍 Kurukshetra'].map((p) => (
          <View key={p} style={styles.heroPill}>
            <Text style={styles.heroPillText}>{p}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.heroBtn}
        onPress={() => onBookPress(SPECIALTIES[8])}
        activeOpacity={0.85}
      >
        <FontAwesome name="calendar-plus-o" size={15} color={C.deepBrown} style={{ marginRight: 8 }} />
        <Text style={styles.heroBtnText}>Book Free Appointment</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: C.deepBrown,
    paddingTop: 28, paddingBottom: 28, paddingHorizontal: 22,
    position: 'relative', overflow: 'hidden',
  },
  heroBlob1: {
    position: 'absolute', width: 240, height: 240, borderRadius: 120,
    backgroundColor: 'rgba(0,63,125,0.12)', top: -80, right: -60,
  },
  heroBlob2: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(74,44,13,0.25)', bottom: -50, left: -40,
  },
  heroOm: { position: 'absolute', right: 20, top: 10, fontSize: 90, color: 'rgba(201,162,39,0.05)', lineHeight: 100 },

  medantaBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.medantaPale, borderWidth: 1, borderColor: C.medantaBorder,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
    alignSelf: 'flex-start', marginBottom: 16,
  },
  medantaDot:       { width: 7, height: 7, borderRadius: 4, backgroundColor: C.medantaLight },
  medantaBadgeText: { fontSize: 9, color: C.medantaLight, letterSpacing: 1.5, fontWeight: '800' },

  heroTitle:       { fontSize: 28, fontWeight: '800', color: C.cream, lineHeight: 34, marginBottom: 10 },
  heroTitleAccent: { color: C.goldLight },
  heroDesc:        { fontSize: 12, color: 'rgba(253,246,227,0.7)', lineHeight: 19, fontStyle: 'italic', marginBottom: 16 },
  heroPillsRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  heroPill: {
    backgroundColor: 'rgba(201,162,39,0.12)', borderWidth: 1, borderColor: C.goldBorder,
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
  },
  heroPillText: { fontSize: 10, color: C.goldLight, fontWeight: '700' },
  heroBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.gold, borderRadius: 22,
    paddingVertical: 13, paddingHorizontal: 22,
    alignSelf: 'flex-start',
    shadowColor: C.gold, shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 5,
  },
  heroBtnText: { fontSize: 14, fontWeight: '800', color: C.deepBrown, letterSpacing: 0.3 },
});
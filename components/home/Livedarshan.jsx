import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from './constant';
import { SectionHeader } from './Sharedui';

export default function LiveDarshan() {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.2, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <>
      <SectionHeader title="🔴 Live" accent="Darshan" />
      <TouchableOpacity style={styles.liveBanner} activeOpacity={0.88}>
        <View style={styles.livePlay}>
          <FontAwesome name="play" size={18} color={COLORS.gold} />
        </View>
        <View style={styles.liveTextCol}>
          <View style={styles.liveNowRow}>
            <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
            <Text style={styles.liveNowLabel}>LIVE NOW</Text>
          </View>
          <Text style={styles.liveTitle}>Gita Gyan Sansthanam</Text>
          <Text style={styles.liveSubtitle}>Kurukshetra Mandir  •  Live Aarti</Text>
        </View>
        <FontAwesome name="chevron-right" size={14} color={COLORS.goldDark} />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  liveBanner: {
    backgroundColor: COLORS.warmBrown,
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.4)',
  },
  livePlay: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(201,162,39,0.15)',
    borderWidth: 2,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveTextCol: { flex: 1 },
  liveNowRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.liveRed,
  },
  liveNowLabel: {
    color: 'rgba(253,246,227,0.6)',
    fontSize: 10,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  liveTitle: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '800',
  },
  liveSubtitle: {
    color: COLORS.goldLight,
    fontSize: 10,
    marginTop: 2,
  },
});
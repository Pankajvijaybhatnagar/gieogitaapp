import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from '@/components/ui/Card';
import { radii, spacing, type } from '@/constants/theme';
import { COLORS } from './constant';
import { SectionHeader } from './Sharedui';

export default function LiveDarshan() {
  const router = useRouter();
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
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push('/home/livedarshan')}
        style={styles.wrapper}
      >
        <Card radius={radii.xl} style={styles.liveBanner}>
          <View style={styles.livePlay}>
            <FontAwesome name="play" size={16} color={COLORS.saffron} />
          </View>
          <View style={styles.liveTextCol}>
            <View style={styles.liveNowRow}>
              <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
              <Text style={styles.liveNowLabel}>LIVE NOW</Text>
            </View>
            <Text style={styles.liveTitle}>Gita Gyan Sansthanam</Text>
            <Text style={styles.liveSubtitle}>Kurukshetra Mandir  •  Live Aarti</Text>
          </View>
          <FontAwesome name="chevron-right" size={14} color={COLORS.warmBrown} />
        </Card>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: spacing.md
  },
  liveBanner: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md
  },
  livePlay: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  liveTextCol: {
    flex: 1
  },
  liveNowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.liveRed
  },
  liveNowLabel: {
    color: COLORS.liveRed,
    ...type.caption,
    fontSize: 12
  },
  liveTitle: {
    color: COLORS.deepBrown,
    ...type.headline,
    fontSize: 15,
    marginTop: 2
  },
  liveSubtitle: {
    color: COLORS.warmBrown,
    ...type.footnote,
    marginTop: 2
  }
});

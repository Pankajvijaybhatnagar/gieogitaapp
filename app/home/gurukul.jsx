// app/home/gurukul.jsx
//
// GIEO Gurukul — one of the app's core services. No dedicated screen
// existed for this yet (linked from the Services section), so this is a
// new page using the real title/description already published on
// gieogita.org (its own /gieo-gurukul page currently 404s, so this is the
// only working version of it).

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import Spacer from '@/components/ui/Spacer';
import { COLORS } from '@/constants/brandColors';
import { radii, shadow, spacing, type } from '@/constants/theme';

const HERO_IMAGE =
  'https://gieogita.org/assets/images/services/gieo-gurukul%20copy.jpg';

export default function GurukulScreen() {
  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      <View style={styles.heroWrap}>
        <Image
          source={{ uri: HERO_IMAGE }}
          style={styles.heroImage}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.heroOverlay} />

        <View style={styles.heroIconRing}>
          <View style={styles.heroIcon}>
            <Ionicons name="school" size={28} color={COLORS.white} />
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>GIEO Gurukul</Text>
        <View style={styles.divider} />

        <Text style={styles.description}>
          Blending ancient Gurukul values with modern learning for holistic
          education.
        </Text>

        <View style={styles.pointsCard}>
          {[
            'Traditional Gurukul-style teaching rooted in the Bhagwad Gita',
            'A holistic approach combining spiritual and modern learning',
            'Focus on character, discipline and value-based education',
          ].map((point, index) => (
            <View key={index} style={styles.pointRow}>
              <View style={styles.pointDot} />
              <Text style={styles.pointText}>{point}</Text>
            </View>
          ))}
        </View>
      </View>
      <Spacer height={120} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  heroWrap: {
    height: 220,
    position: 'relative',
    backgroundColor: COLORS.creamDark,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(32,16,20,0.35)',
  },
  heroIconRing: {
    position: 'absolute',
    bottom: -32,
    alignSelf: 'center',
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.raised,
    shadowColor: COLORS.richBrown,
  },
  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.richBrown,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.cream,
  },
  body: {
    paddingTop: 44,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  title: {
    ...type.title,
    fontSize: 23,
    color: COLORS.deepBrown,
    textAlign: 'center',
  },
  divider: {
    width: 40,
    height: 3,
    borderRadius: radii.pill,
    backgroundColor: COLORS.gold,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  description: {
    ...type.body,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.warmBrown,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  pointsCard: {
    width: '100%',
    backgroundColor: COLORS.creamDark,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm + 2,
    marginBottom: spacing.xl,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  pointDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.saffron,
    marginTop: 7,
  },
  pointText: {
    ...type.body,
    fontSize: 13.5,
    lineHeight: 20,
    color: COLORS.deepBrown,
    flex: 1,
  },
});

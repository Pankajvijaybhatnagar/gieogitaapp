import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from '@/components/ui/Card';
import { RGB } from '@/constants/brandColors';
import { radii, spacing, type } from '@/constants/theme';
import { aboutInitiatives, COLORS } from './constant';
import { SectionHeader } from './Sharedui';

export default function InitiativesSection() {
  const router = useRouter();

  return (
    <>
      <SectionHeader title="🌿 Our" accent="Initiatives" />
      <Card radius={radii.xl} style={styles.aboutSection}>
        <Text style={styles.aboutHeading}>
          Serving With{' '}
          <Text style={styles.aboutHeadingAccent}>Spiritual Purpose</Text>
          {'\n'}And Social Responsibility
        </Text>
        <Text style={styles.aboutDesc}>
          GIEO Gita is a spiritual mission dedicated to spreading the timeless wisdom of
          the Bhagwad Gita. Our aim is to cultivate values, inspire transformation, and
          serve society with love, devotion, and selfless service.
        </Text>
        {aboutInitiatives.map((init) => (
          <TouchableOpacity
            key={init.title}
            style={styles.initiativeCard}
            activeOpacity={0.85}
            onPress={() => router.push(init.route)}  
          >
            <View style={styles.initiativeIcon}>
              <Text style={styles.initiativeIconText}>{init.icon}</Text>
            </View>
            <View style={styles.initiativeText}>
              <Text style={styles.initiativeTitle}>{init.title}</Text>
              <Text style={styles.initiativeDesc}>{init.desc}</Text>
            </View>
            <FontAwesome name="chevron-right" size={12} color={COLORS.goldDark} />
          </TouchableOpacity>
        ))}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  aboutSection: {
    marginHorizontal: spacing.md,
    padding: spacing.md + 2
  },
  aboutHeading: {
    ...type.headline,
    fontSize: 17,
    color: COLORS.deepBrown,
    lineHeight: 24,
    marginBottom: spacing.sm
  },
  aboutHeadingAccent: {
    color: COLORS.saffron
  },
  aboutDesc: {
    ...type.footnote,
    fontSize: 12,
    color: COLORS.warmBrown,
    lineHeight: 18,
    marginBottom: spacing.md
  },
  initiativeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: COLORS.creamDark,
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm + 2,
    marginBottom: spacing.sm
  },
  initiativeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `rgba(${RGB.saffron},0.14)`,
    alignItems: 'center',
    justifyContent: 'center'
  },
  initiativeIconText: {
    fontSize: 20
  },
  initiativeText: {
    flex: 1
  },
  initiativeTitle: {
    color: COLORS.deepBrown,
    fontSize: 13,
    fontWeight: '700'
  },
  initiativeDesc: {
    color: COLORS.warmBrown,
    fontSize: 12,
    marginTop: 2
  }
});
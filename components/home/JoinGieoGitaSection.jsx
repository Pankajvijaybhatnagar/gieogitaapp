import { DESIGN } from '@/constants/design';
import { StyleSheet, Text, View } from 'react-native';
import { hairline, radii, shadow, spacing, type } from '@/constants/theme';
import { COLORS } from './constant';
import { SectionHeader } from './Sharedui';

export default function JoinGieoGitaSection() {
  return (
    <>
      <SectionHeader title="🙏 Join" accent="Gieo Gita" />
      <View style={styles.container}>
        {/* Coming Soon Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✨ Coming Soon</Text>
        </View>

        <Text style={styles.heading}>
          Be Part Of{' '}
          <Text style={styles.headingAccent}>Something Sacred</Text>
        </Text>

        <Text style={styles.desc}>
          We are preparing something beautiful for all those who wish to walk the
          path of the Gita together. Stay tuned — your journey with us begins soon.
        </Text>

        {/* Placeholder dots */}
        <View style={styles.dotsRow}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[styles.dot, i === 1 && styles.dotLarge]}
            />
          ))}
        </View>

        <Text style={styles.footerNote}>
          🕉 &nbsp;Hare Krishna • Hare Gita • Hare GIEO
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cream,
    marginHorizontal: spacing.md,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
    minHeight: 220,
    justifyContent: 'center',
    ...shadow.card
  },
  badge: {
    backgroundColor: COLORS.creamDark,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: hairline,
    marginBottom: spacing.md
  },
  badgeText: {
    ...type.caption,
    color: COLORS.saffron
  },
  heading: {
    ...type.title,
    fontSize: 18,
    color: COLORS.deepBrown,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: spacing.sm,
    fontFamily: DESIGN.fonts.editorial,
    fontWeight: "400",
    letterSpacing: -0.4
  },
  headingAccent: {
    color: COLORS.saffron
  },
  desc: {
    ...type.body,
    color: COLORS.warmBrown,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: 8
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.lg
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.goldLight
  },
  dotLarge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.saffron
  },
  footerNote: {
    ...type.footnote,
    color: COLORS.warmBrown,
    letterSpacing: 0.5
  }
});

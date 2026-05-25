import { StyleSheet, Text, View } from 'react-native';
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
    backgroundColor: COLORS.richBrown,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.3)',
    alignItems: 'center',
    minHeight: 220,
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: 'rgba(201,162,39,0.15)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.4)',
    marginBottom: 16,
  },
  badgeText: {
    color: COLORS.goldLight,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heading: {
    color: COLORS.cream,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 12,
  },
  headingAccent: {
    color: COLORS.goldLight,
  },
  desc: {
    color: 'rgba(253,246,227,0.6)',
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(201,162,39,0.35)',
  },
  dotLarge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.goldLight,
  },
  footerNote: {
    color: 'rgba(253,246,227,0.4)',
    fontSize: 10,
    letterSpacing: 0.5,
    fontStyle: 'italic',
  },
});
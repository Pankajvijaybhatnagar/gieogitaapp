import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from './constant';

// ─── GOLD DIVIDER ─────────────────────────────────────────────────────────────
export function GoldDivider() {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <View style={styles.dividerDiamond} />
      <View style={styles.dividerLine} />
    </View>
  );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
export function SectionHeader({
  title,
  accent,
  onSeeAll,
  seeAllLabel = 'See all »',
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        {title}{' '}
        {accent ? <Text style={styles.sectionAccent}>{accent}</Text> : null}
      </Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          {/* <Text style={styles.seeAll}>{seeAllLabel}</Text> */}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.goldDark,
    opacity: 0.35,
  },
  dividerDiamond: {
    width: 7,
    height: 7,
    backgroundColor: COLORS.gold,
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.deepBrown,
    letterSpacing: 0.3,
  },
  sectionAccent: { color: COLORS.goldDark },
  seeAll: {
    fontSize: 12,
    color: COLORS.saffron,
    fontStyle: 'italic',
  },
});

import { StyleSheet, Text, View } from 'react-native';
import { C } from './constants';
import { hairline, spacing } from '@/constants/theme';

export function GoldDivider() {
  return <View style={styles.dividerRow} />;
}

export function SectionPillHeader({ label }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionLine} />
      <View style={styles.sectionPill}>
        <Text style={styles.sectionPillText}>{label}</Text>
      </View>
      <View style={styles.sectionLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  dividerRow: {
    height: 1,
    backgroundColor: hairline,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: hairline
  },
  sectionPill: {
    backgroundColor: C.creamDark,
    borderWidth: 1,
    borderColor: C.goldBorder,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginHorizontal: 10
  },
  sectionPillText: {
    fontSize: 10,
    fontWeight: "600",
    color: C.goldDark,
    letterSpacing: 2
  }
});

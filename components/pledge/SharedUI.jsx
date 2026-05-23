import { StyleSheet, Text, View } from 'react-native';
import { C } from './constants';

export function GoldDivider() {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerIcon}>🔱</Text>
      <View style={styles.dividerLine} />
    </View>
  );
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
  dividerRow:  { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.goldDark, opacity: 0.3 },
  dividerIcon: { fontSize: 14, marginHorizontal: 10 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionLine:   { flex: 1, height: 1, backgroundColor: C.goldDark, opacity: 0.25 },
  sectionPill: {
    backgroundColor: C.creamDark, borderWidth: 1, borderColor: C.goldBorder,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginHorizontal: 10,
  },
  sectionPillText: { fontSize: 9, fontWeight: '800', color: C.goldDark, letterSpacing: 2 },
});
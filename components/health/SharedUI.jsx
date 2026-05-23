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

export function SectionHead({ label, title, accent }) {
  return (
    <View style={styles.sectionHead}>
      <View style={styles.sectionHeadPillRow}>
        <View style={styles.sectionLine} />
        <View style={styles.sectionPill}>
          <Text style={styles.sectionPillText}>{label}</Text>
        </View>
        <View style={styles.sectionLine} />
      </View>
      <Text style={styles.sectionTitle}>
        {title} <Text style={styles.sectionTitleAccent}>{accent}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dividerRow:  { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.goldDark, opacity: 0.3 },
  dividerIcon: { fontSize: 14, marginHorizontal: 10 },

  sectionHead:        { paddingHorizontal: 20, paddingTop: 4, marginBottom: 16 },
  sectionHeadPillRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  sectionLine:        { flex: 1, height: 1, backgroundColor: C.goldDark, opacity: 0.25 },
  sectionPill: {
    backgroundColor: C.creamDark, borderWidth: 1, borderColor: C.goldBorder,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginHorizontal: 10,
  },
  sectionPillText:    { fontSize: 9, fontWeight: '800', color: C.goldDark, letterSpacing: 2 },
  sectionTitle:       { fontSize: 20, fontWeight: '800', color: C.deepBrown },
  sectionTitleAccent: { color: C.medantaBlue },
});
import { StyleSheet, Text, View } from 'react-native';
import { C } from './constants';
import { hairline, radii, type } from '@/constants/theme';

export function GoldDivider() {
  return (
    <View style={styles.dividerRow}>
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
  dividerRow: {
    marginHorizontal: 20,
    marginVertical: 16
  },
  dividerLine: {
    height: 1,
    backgroundColor: hairline
  },
  sectionHead: {
    paddingHorizontal: 20,
    paddingTop: 4,
    marginBottom: 16
  },
  sectionHeadPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
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
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginHorizontal: 10
  },
  sectionPillText: {
    fontSize: 10,
    fontWeight: "600",
    color: C.goldDark,
    letterSpacing: 2
  },
  sectionTitle: {
    ...type.title,
    color: C.deepBrown
  },
  sectionTitleAccent: {
    color: C.medantaBlue
  }
});
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { C, TRUST_ITEMS } from './constants';
import { SectionPillHeader } from './SharedUI';

const { width } = Dimensions.get('window');

export default function TrustSection() {
  return (
    <View style={styles.trustSection}>
      <SectionPillHeader label="OUR COMMITMENT" />
      <View style={styles.trustGrid}>
        {TRUST_ITEMS.map((t) => (
          <View key={t.title} style={styles.trustCard}>
            <Text style={styles.trustIcon}>{t.icon}</Text>
            <Text style={styles.trustTitle}>{t.title}</Text>
            <Text style={styles.trustDesc}>{t.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  trustSection: {
    paddingHorizontal: 16,
    paddingTop: 4
  },
  trustGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  trustCard: {
    width: (width - 52) / 2,
    backgroundColor: C.cream,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.goldBorder,
    alignItems: 'center'
  },
  trustIcon: {
    fontSize: 26,
    marginBottom: 8
  },
  trustTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: C.deepBrown,
    textAlign: 'center',
    marginBottom: 4
  },
  trustDesc: {
    fontSize: 12,
    color: C.warmBrown,
    textAlign: 'center',
    lineHeight: 18
  }
});
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { C, FREE_SERVICES } from './constants';
import { SectionHead } from './SharedUI';

const { width } = Dimensions.get('window');

export default function FreeServices() {
  return (
    <View style={styles.servicesSection}>
      <SectionHead label="FREE SERVICES" title="What's" accent="Covered?" />
      <View style={styles.servicesGrid}>
        {FREE_SERVICES.map((svc, i) => (
          <View key={i} style={styles.serviceCard}>
            <Text style={styles.serviceCardIcon}>{svc.icon}</Text>
            <Text style={styles.serviceCardTitle}>{svc.title}</Text>
            <Text style={styles.serviceCardDesc}>{svc.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  servicesSection: { paddingHorizontal: 20 },
  servicesGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  serviceCard: {
    width: (width - 60) / 2,
    backgroundColor: C.white, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: C.goldBorder,
    shadowColor: C.deepBrown, shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2,
  },
  serviceCardIcon:  { fontSize: 28, marginBottom: 8 },
  serviceCardTitle: { fontSize: 12, fontWeight: '800', color: C.deepBrown, marginBottom: 4 },
  serviceCardDesc:  { fontSize: 10, color: '#666', lineHeight: 14, fontStyle: 'italic' },
});
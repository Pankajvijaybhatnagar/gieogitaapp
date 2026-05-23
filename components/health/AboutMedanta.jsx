import { StyleSheet, Text, View } from 'react-native';
import { C } from './constants';
import { SectionHead } from './SharedUI';

const STATS = [
  { value: '45+',   label: 'Specialties' },
  { value: '2500+', label: 'Beds'        },
  { value: '1000+', label: 'Doctors'     },
  { value: 'FREE',  label: 'At GIEO'     },
];

export default function AboutMedanta() {
  return (
    <View style={styles.aboutSection}>
      <SectionHead label="ABOUT" title="Medanta at" accent="GIEO GITA" />
      <View style={styles.aboutCard}>
        <View style={styles.aboutLogoRow}>
          <View style={styles.aboutLogoBox}>
            <Text style={styles.aboutLogoText}>M</Text>
          </View>
          <View style={styles.aboutLogoTextCol}>
            <Text style={styles.aboutLogoTitle}>Medanta — The Medicity</Text>
            <Text style={styles.aboutLogoSub}>India's Leading Multi-Specialty Hospital</Text>
          </View>
        </View>
        <Text style={styles.aboutDesc}>
          Medanta is one of India's largest and most prestigious hospital groups. In a divine seva
          initiative, Medanta has partnered with GIEO GITA to provide FREE quality healthcare to all
          devotees, pilgrims, and visitors at Gita Gyan Sansthanam, Kurukshetra — bringing healing
          to the holy land.
        </Text>
        <View style={styles.aboutStatsRow}>
          {STATS.map((st) => (
            <View key={st.label} style={styles.aboutStatBox}>
              <Text style={styles.aboutStatValue}>{st.value}</Text>
              <Text style={styles.aboutStatLabel}>{st.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  aboutSection: { paddingHorizontal: 20, paddingTop: 20 },
  aboutCard: {
    backgroundColor: C.white, borderRadius: 20, padding: 18,
    borderWidth: 1, borderColor: C.medantaBorder,
    shadowColor: C.medantaBlue, shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 2,
  },
  aboutLogoRow:     { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  aboutLogoBox: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: C.medantaBlue, alignItems: 'center', justifyContent: 'center',
  },
  aboutLogoText:    { fontSize: 22, fontWeight: '900', color: C.white },
  aboutLogoTextCol: { flex: 1 },
  aboutLogoTitle:   { fontSize: 13, fontWeight: '800', color: C.medantaBlue },
  aboutLogoSub:     { fontSize: 10, color: C.goldDark, fontStyle: 'italic', marginTop: 2 },
  aboutDesc:        { fontSize: 12, color: '#444', lineHeight: 19, marginBottom: 16 },
  aboutStatsRow:    { flexDirection: 'row', gap: 10 },
  aboutStatBox: {
    flex: 1, backgroundColor: C.medantaPale, borderRadius: 12, padding: 10,
    alignItems: 'center', borderWidth: 1, borderColor: C.medantaBorder,
  },
  aboutStatValue: { fontSize: 16, fontWeight: '800', color: C.medantaBlue },
  aboutStatLabel: { fontSize: 9, color: C.goldDark, marginTop: 2, fontWeight: '600' },
});
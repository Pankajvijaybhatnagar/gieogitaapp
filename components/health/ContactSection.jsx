import { FontAwesome } from '@expo/vector-icons';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { C } from './constants';
import { SectionHead } from './SharedUI';

export default function ContactSection() {
  return (
    <View style={styles.contactSection}>
      <SectionHead label="LOCATION" title="Visit Us" accent="At Kurukshetra" />

      <View style={styles.locationCard}>
        <View style={styles.locationIconBox}>
          <Text style={styles.locationIcon}>📍</Text>
        </View>
        <View style={styles.locationTextCol}>
          <Text style={styles.locationTitle}>Gita Gyan Sansthanam</Text>
          <Text style={styles.locationAddr}>Kurukshetra, Haryana — 136118</Text>
          <Text style={styles.locationSub}>Medanta Health Camp — Complimentary for all</Text>
        </View>
      </View>

      <View style={styles.contactBtnRow}>
        <TouchableOpacity
          style={styles.contactBtn}
          onPress={() => Linking.openURL('tel:+911234567890')}
          activeOpacity={0.85}
        >
          <FontAwesome name="phone" size={14} color={C.deepBrown} />
          <Text style={styles.contactBtnText}>Call Us</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.contactBtn, { backgroundColor: C.green }]}
          onPress={() => Linking.openURL('https://wa.me/911234567890')}
          activeOpacity={0.85}
        >
          <FontAwesome name="whatsapp" size={14} color={C.white} />
          <Text style={[styles.contactBtnText, { color: C.white }]}>WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.contactBtn, { backgroundColor: C.medantaBlue }]}
          onPress={() => Linking.openURL('https://www.medanta.org')}
          activeOpacity={0.85}
        >
          <FontAwesome name="globe" size={14} color={C.white} />
          <Text style={[styles.contactBtnText, { color: C.white }]}>Medanta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contactSection: { paddingHorizontal: 20 },
  locationCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: C.deepBrown, borderRadius: 16, padding: 16,
    marginBottom: 14, borderWidth: 1, borderColor: C.goldBorder,
  },
  locationIconBox: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: 'rgba(201,162,39,0.12)', borderWidth: 1, borderColor: C.goldBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  locationIcon:    { fontSize: 20 },
  locationTextCol: { flex: 1 },
  locationTitle:   { fontSize: 14, fontWeight: '800', color: C.cream, marginBottom: 3 },
  locationAddr:    { fontSize: 12, color: C.goldLight, marginBottom: 3 },
  locationSub:     { fontSize: 10, color: C.goldDark, fontStyle: 'italic' },
  contactBtnRow:   { flexDirection: 'row', gap: 10 },
  contactBtn: {
    flex: 1, backgroundColor: C.gold, borderRadius: 12,
    paddingVertical: 12, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 7,
  },
  contactBtnText: { fontSize: 12, fontWeight: '800', color: C.deepBrown },
});
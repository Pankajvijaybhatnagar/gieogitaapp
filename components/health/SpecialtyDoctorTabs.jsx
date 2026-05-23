import { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { C, DOCTORS, SPECIALTIES } from './constants';
import { SectionHead } from './SharedUI';

const { width } = Dimensions.get('window');

function SpecialtyGrid({ onBook }) {
  return (
    <View style={styles.specialtyGrid}>
      {SPECIALTIES.map((spec) => (
        <TouchableOpacity
          key={spec.id}
          style={styles.specCard}
          onPress={() => onBook(spec)}
          activeOpacity={0.82}
        >
          <Text style={styles.specIcon}>{spec.icon}</Text>
          <Text style={styles.specName}>{spec.name}</Text>
          <Text style={styles.specDesc} numberOfLines={2}>{spec.desc}</Text>
          <View style={styles.specBookBtn}>
            <Text style={styles.specBookBtnText}>Book Free</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function DoctorsList({ onBook }) {
  return (
    <View style={styles.doctorsList}>
      {DOCTORS.map((doc) => (
        <View key={doc.id} style={styles.doctorCard}>
          <View style={styles.doctorAvatarBox}>
            <Text style={styles.doctorAvatar}>{doc.icon}</Text>
          </View>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doc.name}</Text>
            <Text style={styles.doctorSpec}>{doc.spec}</Text>
            <View style={styles.doctorMetaRow}>
              <View style={styles.doctorMetaPill}>
                <Text style={styles.doctorMetaText}>🎓 {doc.exp} exp</Text>
              </View>
              <View style={styles.doctorMetaPill}>
                <Text style={styles.doctorMetaText}>📅 {doc.avail}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.doctorBookBtn}
            onPress={() =>
              onBook(SPECIALTIES.find((s) => s.name.includes(doc.spec.split(' ')[0])) || SPECIALTIES[8])
            }
            activeOpacity={0.85}
          >
            <Text style={styles.doctorBookBtnText}>Book</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

export default function SpecialtyDoctorTabs({ onBook }) {
  const [activeTab, setActiveTab] = useState('services');

  return (
    <View style={styles.tabSection}>
      <SectionHead label="BOOK APPOINTMENT" title="Choose" accent="Specialty" />

      <View style={styles.tabRow}>
        {['services', 'doctors'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabChip, activeTab === tab && styles.tabChipActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabChipText, activeTab === tab && styles.tabChipTextActive]}>
              {tab === 'services' ? '🩺  By Specialty' : '👨‍⚕️  By Doctor'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'services' ? (
        <SpecialtyGrid onBook={onBook} />
      ) : (
        <DoctorsList onBook={onBook} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabSection: { paddingHorizontal: 20 },
  tabRow:     { flexDirection: 'row', gap: 10, marginBottom: 14 },
  tabChip: {
    flex: 1, backgroundColor: C.creamDark, borderWidth: 1, borderColor: C.goldBorder,
    borderRadius: 14, paddingVertical: 11, alignItems: 'center',
  },
  tabChipActive:     { backgroundColor: C.deepBrown, borderColor: C.gold },
  tabChipText:       { fontSize: 12, fontWeight: '700', color: C.warmBrown },
  tabChipTextActive: { color: C.goldLight },

  // Specialty
  specialtyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  specCard: {
    width: (width - 60) / 2,
    backgroundColor: C.white, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: C.goldBorder, alignItems: 'center',
    shadowColor: C.deepBrown, shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2,
  },
  specIcon: { fontSize: 32, marginBottom: 8 },
  specName: { fontSize: 12, fontWeight: '800', color: C.deepBrown, textAlign: 'center', marginBottom: 4 },
  specDesc: { fontSize: 9, color: '#777', textAlign: 'center', lineHeight: 13, fontStyle: 'italic', marginBottom: 10 },
  specBookBtn: {
    backgroundColor: C.medantaBlue, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 6,
  },
  specBookBtnText: { fontSize: 10, fontWeight: '800', color: C.white },

  // Doctors
  doctorsList: { gap: 12 },
  doctorCard: {
    backgroundColor: C.white, borderRadius: 16, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: C.goldBorder,
    shadowColor: C.deepBrown, shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2,
  },
  doctorAvatarBox: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: C.medantaPale, borderWidth: 1.5, borderColor: C.medantaBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  doctorAvatar:  { fontSize: 26 },
  doctorInfo:    { flex: 1 },
  doctorName:    { fontSize: 13, fontWeight: '800', color: C.deepBrown, marginBottom: 2 },
  doctorSpec:    { fontSize: 11, color: C.medantaBlue, fontWeight: '600', marginBottom: 6 },
  doctorMetaRow: { flexDirection: 'row', gap: 6 },
  doctorMetaPill:{ backgroundColor: C.creamDark, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  doctorMetaText:{ fontSize: 9, color: C.goldDark, fontWeight: '600' },
  doctorBookBtn: {
    backgroundColor: C.gold, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
  },
  doctorBookBtnText: { fontSize: 11, fontWeight: '800', color: C.deepBrown },
});
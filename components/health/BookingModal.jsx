import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { C, getDates, TIME_SLOTS } from './constants';

export default function BookingModal({ visible, onClose, specialty }) {
  const [step,         setStep]         = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [name,         setName]         = useState('');
  const [phone,        setPhone]        = useState('');
  const [age,          setAge]          = useState('');
  const [gender,       setGender]       = useState('');
  const dates = getDates();

  const resetAndClose = () => {
    setStep(1); setSelectedDate(null); setSelectedSlot(null);
    setName(''); setPhone(''); setAge(''); setGender('');
    onClose();
  };

  const handleConfirm = () => {
    if (!name.trim() || !phone.trim() || !age.trim() || !gender) {
      Alert.alert('⚠️ Missing Details', 'Please fill all fields before confirming.');
      return;
    }
    setStep(3);
  };

  const handleDone = () => {
    Alert.alert(
      '✅ Appointment Booked!',
      `Your free Medanta health check-up has been booked at Gita Gyan Sansthanam, Kurukshetra.\n\nDate: ${selectedDate?.date}\nTime: ${selectedSlot}\nSpecialty: ${specialty?.name}\n\nOur team will contact you on ${phone} for confirmation.`,
      [{ text: 'OK 🙏', onPress: resetAndClose }]
    );
  };

  if (!specialty) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={resetAndClose}>
      <View style={BM.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={resetAndClose} />
        <View style={BM.sheet}>
          <View style={BM.handle} />

          {/* Header */}
          <View style={BM.header}>
            <View style={BM.headerBlob} />
            <Text style={BM.headerIcon}>{specialty.icon}</Text>
            <View style={BM.headerTextCol}>
              <Text style={BM.headerTitle}>{specialty.name}</Text>
              <Text style={BM.headerDesc}>{specialty.desc}</Text>
              <View style={BM.freeBadge}>
                <Text style={BM.freeBadgeText}>✅  FREE Service by Medanta</Text>
              </View>
            </View>
            <TouchableOpacity style={BM.closeBtn} onPress={resetAndClose}>
              <FontAwesome name="times" size={14} color={C.goldLight} />
            </TouchableOpacity>
          </View>

          {/* Step indicator */}
          <View style={BM.stepRow}>
            {['Select Date & Time', 'Your Details', 'Confirm'].map((s, i) => (
              <View key={i} style={BM.stepItem}>
                <View style={[BM.stepCircle, step > i + 1 && BM.stepDone, step === i + 1 && BM.stepActive]}>
                  {step > i + 1
                    ? <FontAwesome name="check" size={10} color={C.white} />
                    : <Text style={[BM.stepNum, step === i + 1 && { color: C.white }]}>{i + 1}</Text>
                  }
                </View>
                <Text style={[BM.stepLabel, step === i + 1 && BM.stepLabelActive]}>{s}</Text>
              </View>
            ))}
          </View>

          <ScrollView style={BM.body} showsVerticalScrollIndicator={false}>

            {/* STEP 1 */}
            {step === 1 && (
              <View>
                <Text style={BM.fieldLabel}>Select Date</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {dates.map((d, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[BM.dateChip, selectedDate?.full === d.full && BM.dateChipActive]}
                      onPress={() => setSelectedDate(d)}
                      activeOpacity={0.8}
                    >
                      <Text style={[BM.dateDayText, selectedDate?.full === d.full && BM.dateActiveText]}>{d.label}</Text>
                      <Text style={[BM.dateDateText, selectedDate?.full === d.full && BM.dateActiveText]}>{d.date}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={[BM.fieldLabel, { marginTop: 18 }]}>Select Time Slot</Text>
                <View style={BM.slotsGrid}>
                  {TIME_SLOTS.map((slot) => (
                    <TouchableOpacity
                      key={slot}
                      style={[BM.slotChip, selectedSlot === slot && BM.slotChipActive]}
                      onPress={() => setSelectedSlot(slot)}
                      activeOpacity={0.8}
                    >
                      <Text style={[BM.slotText, selectedSlot === slot && BM.slotTextActive]}>{slot}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={[BM.nextBtn, (!selectedDate || !selectedSlot) && BM.nextBtnDisabled]}
                  onPress={() => { if (selectedDate && selectedSlot) setStep(2); }}
                  disabled={!selectedDate || !selectedSlot}
                  activeOpacity={0.85}
                >
                  <Text style={BM.nextBtnText}>Next  ›</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <View>
                <Text style={BM.bookingSummary}>📅 {selectedDate?.date}  •  ⏰ {selectedSlot}</Text>

                <Text style={BM.fieldLabel}>Full Name *</Text>
                <TextInput style={BM.textInput} placeholder="Enter your full name" placeholderTextColor={C.goldDark} value={name} onChangeText={setName} />

                <Text style={BM.fieldLabel}>Phone Number *</Text>
                <TextInput style={BM.textInput} placeholder="Enter phone number" placeholderTextColor={C.goldDark} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

                <Text style={BM.fieldLabel}>Age *</Text>
                <TextInput style={BM.textInput} placeholder="Enter your age" placeholderTextColor={C.goldDark} value={age} onChangeText={setAge} keyboardType="numeric" />

                <Text style={BM.fieldLabel}>Gender *</Text>
                <View style={BM.genderRow}>
                  {['Male', 'Female', 'Other'].map((g) => (
                    <TouchableOpacity key={g} style={[BM.genderChip, gender === g && BM.genderChipActive]} onPress={() => setGender(g)} activeOpacity={0.8}>
                      <Text style={[BM.genderText, gender === g && BM.genderTextActive]}>{g}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={BM.btnRow}>
                  <TouchableOpacity style={BM.backBtn} onPress={() => setStep(1)} activeOpacity={0.8}>
                    <Text style={BM.backBtnText}>‹  Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={BM.nextBtn} onPress={handleConfirm} activeOpacity={0.85}>
                    <Text style={BM.nextBtnText}>Confirm  ›</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <View style={BM.confirmWrap}>
                <Text style={BM.confirmTick}>✅</Text>
                <Text style={BM.confirmTitle}>Appointment Ready!</Text>
                <Text style={BM.confirmSubtitle}>Please review your booking details below</Text>

                <View style={BM.confirmCard}>
                  {[
                    { icon: '🏥', label: 'Hospital',  value: 'Medanta at Gita Gyan Sansthanam' },
                    { icon: '📍', label: 'Location',  value: 'Kurukshetra, Haryana'            },
                    { icon: '🩺', label: 'Specialty', value: specialty.name                    },
                    { icon: '👤', label: 'Patient',   value: name                              },
                    { icon: '📞', label: 'Phone',     value: phone                             },
                    { icon: '📅', label: 'Date',      value: selectedDate?.date                },
                    { icon: '⏰', label: 'Time',      value: selectedSlot                      },
                    { icon: '💰', label: 'Charges',   value: 'FREE  (Complimentary by Medanta)'},
                  ].map((row, i) => (
                    <View key={i} style={BM.confirmRow}>
                      <Text style={BM.confirmRowIcon}>{row.icon}</Text>
                      <Text style={BM.confirmRowLabel}>{row.label}</Text>
                      <Text style={BM.confirmRowValue}>{row.value}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity style={BM.doneBtn} onPress={handleDone} activeOpacity={0.85}>
                  <FontAwesome name="check-circle" size={16} color={C.white} style={{ marginRight: 8 }} />
                  <Text style={BM.doneBtnText}>Book Appointment</Text>
                </TouchableOpacity>

                <TouchableOpacity style={BM.editBtn} onPress={() => setStep(2)} activeOpacity={0.8}>
                  <Text style={BM.editBtnText}>✏️  Edit Details</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const BM = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    backgroundColor: C.cream, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    borderTopWidth: 2, borderTopColor: C.medantaBlue, maxHeight: '92%',
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.goldDark, alignSelf: 'center', marginTop: 10, marginBottom: 4 },

  header: {
    backgroundColor: C.medantaBlue, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,63,125,0.3)',
    position: 'relative', overflow: 'hidden',
  },
  headerBlob:    { position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.05)', top: -50, right: -40 },
  headerIcon:    { fontSize: 34 },
  headerTextCol: { flex: 1 },
  headerTitle:   { fontSize: 16, fontWeight: '800', color: C.white },
  headerDesc:    { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', marginTop: 2 },
  freeBadge: {
    backgroundColor: 'rgba(39,174,96,0.2)', borderWidth: 1, borderColor: 'rgba(39,174,96,0.4)',
    borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, marginTop: 6, alignSelf: 'flex-start',
  },
  freeBadgeText: { fontSize: 9, color: '#27AE60', fontWeight: '800' },
  closeBtn:      { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },

  stepRow: {
    flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: C.creamDark, borderBottomWidth: 1, borderBottomColor: C.goldBorder, gap: 4,
  },
  stepItem:   { flex: 1, alignItems: 'center', gap: 4 },
  stepCircle: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: C.creamDark, borderWidth: 1.5, borderColor: C.goldBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  stepActive:      { backgroundColor: C.medantaBlue, borderColor: C.medantaBlue },
  stepDone:        { backgroundColor: C.green, borderColor: C.green },
  stepNum:         { fontSize: 11, fontWeight: '800', color: C.goldDark },
  stepLabel:       { fontSize: 8, color: C.goldDark, textAlign: 'center', fontWeight: '600' },
  stepLabelActive: { color: C.medantaBlue },

  body:       { paddingHorizontal: 18, paddingTop: 14 },
  fieldLabel: { fontSize: 11, fontWeight: '800', color: C.goldDark, letterSpacing: 0.5, marginBottom: 8 },

  dateChip:       { alignItems: 'center', backgroundColor: C.white, borderWidth: 1.5, borderColor: C.goldBorder, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, marginRight: 8, minWidth: 76 },
  dateChipActive: { backgroundColor: C.medantaBlue, borderColor: C.medantaBlue },
  dateDayText:    { fontSize: 11, fontWeight: '800', color: C.warmBrown, marginBottom: 2 },
  dateDateText:   { fontSize: 9, color: C.goldDark },
  dateActiveText: { color: C.white },

  slotsGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotChip:       { backgroundColor: C.white, borderWidth: 1.5, borderColor: C.goldBorder, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  slotChipActive: { backgroundColor: C.medantaBlue, borderColor: C.medantaBlue },
  slotText:       { fontSize: 11, fontWeight: '700', color: C.warmBrown },
  slotTextActive: { color: C.white },

  textInput: {
    backgroundColor: C.white, borderWidth: 1.5, borderColor: C.goldBorder,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: C.deepBrown, marginBottom: 12,
  },

  genderRow:        { flexDirection: 'row', gap: 10, marginBottom: 16 },
  genderChip:       { flex: 1, backgroundColor: C.white, borderWidth: 1.5, borderColor: C.goldBorder, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  genderChipActive: { backgroundColor: C.medantaBlue, borderColor: C.medantaBlue },
  genderText:       { fontSize: 12, fontWeight: '700', color: C.warmBrown },
  genderTextActive: { color: C.white },

  btnRow:          { flexDirection: 'row', gap: 10, marginTop: 4 },
  nextBtn:         { flex: 1, backgroundColor: C.medantaBlue, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  nextBtnDisabled: { opacity: 0.5 },
  nextBtnText:     { fontSize: 14, fontWeight: '800', color: C.white },
  backBtn:         { flex: 0.6, backgroundColor: C.creamDark, borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: C.goldBorder },
  backBtnText:     { fontSize: 14, fontWeight: '700', color: C.warmBrown },
  bookingSummary:  { backgroundColor: C.medantaPale, borderWidth: 1, borderColor: C.medantaBorder, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, fontSize: 11, color: C.medantaBlue, fontWeight: '700', marginBottom: 16 },

  confirmWrap:     { alignItems: 'center', paddingTop: 8 },
  confirmTick:     { fontSize: 52, marginBottom: 10 },
  confirmTitle:    { fontSize: 20, fontWeight: '800', color: C.deepBrown, marginBottom: 4 },
  confirmSubtitle: { fontSize: 12, color: C.warmBrown, fontStyle: 'italic', marginBottom: 16 },
  confirmCard:     { width: '100%', backgroundColor: C.white, borderRadius: 16, borderWidth: 1, borderColor: C.goldBorder, overflow: 'hidden', marginBottom: 16 },
  confirmRow:      { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(201,162,39,0.15)' },
  confirmRowIcon:  { fontSize: 16, width: 24, textAlign: 'center' },
  confirmRowLabel: { fontSize: 11, color: C.goldDark, fontWeight: '700', width: 70 },
  confirmRowValue: { flex: 1, fontSize: 12, color: C.deepBrown, fontWeight: '600' },

  doneBtn:     { width: '100%', backgroundColor: C.green, borderRadius: 14, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  doneBtnText: { fontSize: 15, fontWeight: '800', color: C.white },
  editBtn:     { backgroundColor: C.creamDark, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 24, borderWidth: 1, borderColor: C.goldBorder },
  editBtnText: { fontSize: 12, fontWeight: '700', color: C.warmBrown },
});
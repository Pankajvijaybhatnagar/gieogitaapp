import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { getDates, TIME_SLOTS } from './constants';

// ============================================================
// BRAND THEME
// ============================================================

const COLORS = {
  // Your exact brand colors
  darkBrown: '#3a2c16',
  brown: '#5a3816',

  // Supporting browns
  mediumBrown: '#72502C',
  softBrown: '#987953',
  mutedBrown: '#A08A70',

  // Biscuit / cream
  background: '#F4E9D8',
  biscuit: '#EEDFC9',
  biscuitLight: '#F8F1E7',
  cream: '#FFFDF8',
  white: '#FFFFFF',

  // Borders
  border: '#DDC8AA',
  borderSoft: '#E9DCC8',

  // Success
  green: '#667747',
  greenLight: '#EEF3E5',
  greenBorder: '#CAD6B3',

  // Error
  error: '#A34F39',

  // Overlay
  overlay: 'rgba(30, 18, 7, 0.66)',
};

// ============================================================
// COMPONENT
// ============================================================

export default function BookingModal({ visible, onClose, specialty }) {
  // ==========================================================
  // STATES
  // ==========================================================

  const [step, setStep] = useState(1);

  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedSlot, setSelectedSlot] = useState(null);

  const [name, setName] = useState('');

  const [phone, setPhone] = useState('');

  const [age, setAge] = useState('');

  const [gender, setGender] = useState('');

  const dates = getDates();

  // ==========================================================
  // RESET
  // ==========================================================

  const resetAndClose = () => {
    setStep(1);

    setSelectedDate(null);
    setSelectedSlot(null);

    setName('');
    setPhone('');
    setAge('');
    setGender('');

    onClose();
  };

  // ==========================================================
  // PHONE
  // ==========================================================

  const handlePhoneChange = value => {
    const cleanValue = value.replace(/[^0-9]/g, '');

    setPhone(cleanValue.slice(0, 10));
  };

  // ==========================================================
  // AGE
  // ==========================================================

  const handleAgeChange = value => {
    const cleanValue = value.replace(/[^0-9]/g, '');

    setAge(cleanValue.slice(0, 3));
  };

  // ==========================================================
  // VALIDATION
  // ==========================================================

  const handleConfirm = () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter the patient name.');

      return;
    }

    if (!phone.trim()) {
      Alert.alert('Phone Required', 'Please enter the mobile number.');

      return;
    }

    if (phone.length !== 10) {
      Alert.alert(
        'Invalid Mobile Number',
        'Please enter a valid 10-digit mobile number.',
      );

      return;
    }

    if (!age.trim()) {
      Alert.alert('Age Required', 'Please enter the patient age.');

      return;
    }

    const patientAge = Number(age);

    if (patientAge <= 0 || patientAge > 120) {
      Alert.alert('Invalid Age', 'Please enter a valid age.');

      return;
    }

    if (!gender) {
      Alert.alert('Gender Required', 'Please select gender.');

      return;
    }

    setStep(3);
  };

  // ==========================================================
  // FINAL BOOKING
  // ==========================================================

  const handleDone = () => {
    Alert.alert(
      'Appointment Booked!',
      `Your free Medanta health check-up has been booked at Gita Gyan Sansthanam, Kurukshetra.\n\nDate: ${
        selectedDate?.date || ''
      }\nTime: ${selectedSlot || ''}\nSpecialty: ${
        specialty?.name || ''
      }\n\nOur team will contact you on ${phone} for confirmation.`,
      [
        {
          text: 'OK',
          onPress: resetAndClose,
        },
      ],
    );
  };

  // ==========================================================
  // NO SPECIALTY
  // ==========================================================

  if (!specialty) {
    return null;
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={resetAndClose}>
      <KeyboardAvoidingView
        style={BM.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* BACKDROP */}

        <TouchableOpacity
          activeOpacity={1}
          style={StyleSheet.absoluteFill}
          onPress={resetAndClose}
        />

        {/* ===================================================
            BOTTOM SHEET
        =================================================== */}

        <View style={BM.sheet}>
          {/* DRAG HANDLE */}

          <View style={BM.handle} />

          {/* =================================================
              HEADER
          ================================================= */}

          <View style={BM.header}>
            {/* DECORATIVE BACKGROUND */}

            <View style={BM.headerCircleOne} />

            <View style={BM.headerCircleTwo} />

            {/* SPECIALTY ICON */}

            <View style={BM.headerIconContainer}>
              <Text style={BM.headerIcon}>{specialty.icon}</Text>
            </View>

            {/* TEXT */}

            <View style={BM.headerTextCol}>
              <Text style={BM.headerTitle} numberOfLines={1}>
                {specialty.name}
              </Text>

              <Text style={BM.headerDesc} numberOfLines={2}>
                {specialty.desc}
              </Text>

              <View style={BM.freeBadge}>
                <View style={BM.freeBadgeDot} />

                <Text style={BM.freeBadgeText}>FREE HEALTH SERVICE</Text>
              </View>
            </View>

            {/* CLOSE */}

            <TouchableOpacity
              style={BM.closeBtn}
              activeOpacity={0.8}
              onPress={resetAndClose}>
              <FontAwesome name="times" size={14} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* =================================================
              STEP INDICATOR
          ================================================= */}

          <View style={BM.stepContainer}>
            <View style={BM.stepRow}>
              {['Date & Time', 'Your Details', 'Confirm'].map(
                (label, index) => {
                  const stepNumber = index + 1;

                  const completed = step > stepNumber;

                  const active = step === stepNumber;

                  return (
                    <View key={label} style={BM.stepItem}>
                      {/* TOP */}

                      <View style={BM.stepCircleRow}>
                        {index > 0 && (
                          <View
                            style={[
                              BM.stepConnector,

                              step > index && BM.stepConnectorActive,
                            ]}
                          />
                        )}

                        <View
                          style={[
                            BM.stepCircle,

                            active && BM.stepActive,

                            completed && BM.stepDone,
                          ]}>
                          {completed ? (
                            <FontAwesome
                              name="check"
                              size={10}
                              color={COLORS.white}
                            />
                          ) : (
                            <Text
                              style={[BM.stepNum, active && BM.stepNumActive]}>
                              {stepNumber}
                            </Text>
                          )}
                        </View>

                        {index < 2 && (
                          <View
                            style={[
                              BM.stepConnector,

                              step > stepNumber && BM.stepConnectorActive,
                            ]}
                          />
                        )}
                      </View>

                      {/* LABEL */}

                      <Text
                        numberOfLines={1}
                        style={[
                          BM.stepLabel,

                          active && BM.stepLabelActive,

                          completed && BM.stepLabelDone,
                        ]}>
                        {label}
                      </Text>
                    </View>
                  );
                },
              )}
            </View>
          </View>

          {/* =================================================
              BODY
          ================================================= */}

          <ScrollView
            style={BM.body}
            contentContainerStyle={BM.bodyContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {/* =================================================
                STEP 1
            ================================================= */}

            {step === 1 && (
              <View>
                {/* HEADER */}

                <View style={BM.contentHeading}>
                  <Text style={BM.contentTitle}>Choose Appointment</Text>

                  <Text style={BM.contentSubtitle}>
                    Select your preferred date and time.
                  </Text>
                </View>

                {/* DATE */}

                <Text style={BM.fieldLabel}>Select Date</Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={BM.dateScrollContent}>
                  {dates.map((dateItem, index) => {
                    const active = selectedDate?.full === dateItem.full;

                    return (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.82}
                        onPress={() => setSelectedDate(dateItem)}
                        style={[BM.dateChip, active && BM.dateChipActive]}>
                        <Text
                          style={[BM.dateDayText, active && BM.dateActiveText]}>
                          {dateItem.label}
                        </Text>

                        <Text
                          style={[
                            BM.dateDateText,

                            active && BM.dateActiveSubText,
                          ]}>
                          {dateItem.date}
                        </Text>

                        {active && <View style={BM.selectedMiniDot} />}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* TIME */}

                <Text style={[BM.fieldLabel, BM.timeLabel]}>
                  Select Time Slot
                </Text>

                <View style={BM.slotsGrid}>
                  {TIME_SLOTS.map(slot => {
                    const active = selectedSlot === slot;

                    return (
                      <TouchableOpacity
                        key={slot}
                        activeOpacity={0.82}
                        onPress={() => setSelectedSlot(slot)}
                        style={[BM.slotChip, active && BM.slotChipActive]}>
                        <FontAwesome
                          name="clock-o"
                          size={11}
                          color={active ? COLORS.white : COLORS.brown}
                        />

                        <Text
                          style={[BM.slotText, active && BM.slotTextActive]}>
                          {slot}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* NEXT */}

                <TouchableOpacity
                  activeOpacity={0.86}
                  disabled={!selectedDate || !selectedSlot}
                  onPress={() => {
                    if (selectedDate && selectedSlot) {
                      setStep(2);
                    }
                  }}
                  style={[
                    BM.nextBtn,

                    (!selectedDate || !selectedSlot) && BM.nextBtnDisabled,
                  ]}>
                  <Text style={BM.nextBtnText}>Continue</Text>

                  <View style={BM.buttonArrowBox}>
                    <FontAwesome
                      name="angle-right"
                      size={18}
                      color={COLORS.white}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* =================================================
                STEP 2
            ================================================= */}

            {step === 2 && (
              <View>
                {/* SUMMARY */}

                <View style={BM.bookingSummary}>
                  <View style={BM.summaryIconBox}>
                    <FontAwesome
                      name="calendar"
                      size={14}
                      color={COLORS.brown}
                    />
                  </View>

                  <View style={BM.summaryTextArea}>
                    <Text style={BM.summarySmallText}>
                      SELECTED APPOINTMENT
                    </Text>

                    <Text style={BM.summaryMainText}>
                      {selectedDate?.date}
                      {'  •  '}
                      {selectedSlot}
                    </Text>
                  </View>
                </View>

                <View style={BM.contentHeading}>
                  <Text style={BM.contentTitle}>Patient Details</Text>

                  <Text style={BM.contentSubtitle}>
                    Enter basic information for the appointment.
                  </Text>
                </View>

                {/* NAME */}

                <Text style={BM.fieldLabel}>Full Name *</Text>

                <TextInput
                  style={BM.textInput}
                  placeholder="Enter your full name"
                  placeholderTextColor={COLORS.mutedBrown}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  returnKeyType="next"
                />

                {/* PHONE */}

                <Text style={BM.fieldLabel}>Mobile Number *</Text>

                <View style={BM.phoneInputContainer}>
                  <View style={BM.countryCodeBox}>
                    <Text style={BM.countryCode}>+91</Text>
                  </View>

                  <TextInput
                    style={BM.phoneInput}
                    placeholder="Enter mobile number"
                    placeholderTextColor={COLORS.mutedBrown}
                    value={phone}
                    onChangeText={handlePhoneChange}
                    keyboardType="number-pad"
                    maxLength={10}
                    returnKeyType="next"
                  />
                </View>

                {/* AGE */}

                <Text style={BM.fieldLabel}>Age *</Text>

                <TextInput
                  style={BM.textInput}
                  placeholder="Enter your age"
                  placeholderTextColor={COLORS.mutedBrown}
                  value={age}
                  onChangeText={handleAgeChange}
                  keyboardType="number-pad"
                  maxLength={3}
                />

                {/* GENDER */}

                <Text style={BM.fieldLabel}>Gender *</Text>

                <View style={BM.genderRow}>
                  {['Male', 'Female', 'Other'].map(item => {
                    const active = gender === item;

                    return (
                      <TouchableOpacity
                        key={item}
                        activeOpacity={0.82}
                        onPress={() => setGender(item)}
                        style={[BM.genderChip, active && BM.genderChipActive]}>
                        <Text
                          style={[
                            BM.genderText,

                            active && BM.genderTextActive,
                          ]}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* BUTTONS */}

                <View style={BM.btnRow}>
                  <TouchableOpacity
                    activeOpacity={0.82}
                    onPress={() => setStep(1)}
                    style={BM.backBtn}>
                    <FontAwesome
                      name="angle-left"
                      size={17}
                      color={COLORS.brown}
                    />

                    <Text style={BM.backBtnText}>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.86}
                    onPress={handleConfirm}
                    style={BM.confirmBtn}>
                    <Text style={BM.nextBtnText}>Review</Text>

                    <FontAwesome
                      name="angle-right"
                      size={17}
                      color={COLORS.white}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* =================================================
                STEP 3
            ================================================= */}

            {step === 3 && (
              <View style={BM.confirmWrap}>
                {/* SUCCESS ICON */}

                <View style={BM.confirmIconOuter}>
                  <View style={BM.confirmIconInner}>
                    <FontAwesome name="check" size={25} color={COLORS.white} />
                  </View>
                </View>

                <Text style={BM.confirmTitle}>Ready to Book</Text>

                <Text style={BM.confirmSubtitle}>
                  Please review your appointment details.
                </Text>

                {/* CONFIRM CARD */}

                <View style={BM.confirmCard}>
                  {[
                    {
                      icon: 'hospital-o',
                      label: 'Hospital',
                      value: 'Medanta at Gita Gyan Sansthanam',
                    },
                    {
                      icon: 'map-marker',
                      label: 'Location',
                      value: 'Kurukshetra, Haryana',
                    },
                    {
                      icon: 'stethoscope',
                      label: 'Specialty',
                      value: specialty.name,
                    },
                    {
                      icon: 'user',
                      label: 'Patient',
                      value: name,
                    },
                    {
                      icon: 'phone',
                      label: 'Phone',
                      value: `+91 ${phone}`,
                    },
                    {
                      icon: 'calendar',
                      label: 'Date',
                      value: selectedDate?.date,
                    },
                    {
                      icon: 'clock-o',
                      label: 'Time',
                      value: selectedSlot,
                    },
                    {
                      icon: 'inr',
                      label: 'Charges',
                      value: 'FREE',
                    },
                  ].map((row, index) => (
                    <View
                      key={row.label}
                      style={[BM.confirmRow, index === 7 && BM.confirmRowLast]}>
                      <View style={BM.confirmRowIconBox}>
                        <FontAwesome
                          name={row.icon}
                          size={13}
                          color={COLORS.brown}
                        />
                      </View>

                      <View style={BM.confirmRowContent}>
                        <Text style={BM.confirmRowLabel}>{row.label}</Text>

                        <Text
                          style={
                            row.label === 'Charges'
                              ? BM.freeValue
                              : BM.confirmRowValue
                          }>
                          {row.value}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* BOOK */}

                <TouchableOpacity
                  style={BM.doneBtn}
                  onPress={handleDone}
                  activeOpacity={0.86}>
                  <FontAwesome
                    name="check-circle"
                    size={16}
                    color={COLORS.white}
                  />

                  <Text style={BM.doneBtnText}>Book Appointment</Text>
                </TouchableOpacity>

                {/* EDIT */}

                <TouchableOpacity
                  style={BM.editBtn}
                  activeOpacity={0.82}
                  onPress={() => setStep(2)}>
                  <FontAwesome name="pencil" size={12} color={COLORS.brown} />

                  <Text style={BM.editBtnText}>Edit Details</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={BM.bottomSpace} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ============================================================
// STYLES
// ============================================================

const BM = StyleSheet.create({
  // ==========================================================
  // OVERLAY
  // ==========================================================

  overlay: {
    flex: 1,

    justifyContent: 'flex-end',

    backgroundColor: COLORS.overlay,
  },

  // ==========================================================
  // SHEET
  // ==========================================================

  sheet: {
    maxHeight: '92%',

    backgroundColor: COLORS.background,

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    overflow: 'hidden',

    borderTopWidth: 1,

    borderTopColor: COLORS.border,
  },

  handle: {
    position: 'absolute',

    zIndex: 20,

    top: 8,

    alignSelf: 'center',

    width: 42,
    height: 4,

    borderRadius: 2,

    backgroundColor: 'rgba(255,255,255,0.42)',
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
    minHeight: 112,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 17,

    paddingTop: 25,
    paddingBottom: 15,

    backgroundColor: COLORS.darkBrown,

    position: 'relative',

    overflow: 'hidden',
  },

  headerCircleOne: {
    position: 'absolute',

    width: 160,
    height: 160,

    borderRadius: 80,

    right: -55,
    top: -85,

    backgroundColor: 'rgba(255,255,255,0.04)',
  },

  headerCircleTwo: {
    position: 'absolute',

    width: 90,
    height: 90,

    borderRadius: 45,

    right: 35,
    bottom: -65,

    backgroundColor: 'rgba(238,223,201,0.06)',
  },

  headerIconContainer: {
    width: 52,
    height: 52,

    borderRadius: 16,

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 12,

    backgroundColor: COLORS.brown,

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.13)',
  },

  headerIcon: {
    fontSize: 27,
  },

  headerTextCol: {
    flex: 1,

    paddingRight: 8,
  },

  headerTitle: {
    color: COLORS.white,

    fontSize: 17,

    fontWeight: '800',

    marginBottom: 2,
  },

  headerDesc: {
    color: 'rgba(255,255,255,0.65)',

    fontSize: 10.5,

    lineHeight: 14,
  },

  // ==========================================================
  // FREE BADGE
  // ==========================================================

  freeBadge: {
    alignSelf: 'flex-start',

    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 7,

    paddingHorizontal: 8,

    paddingVertical: 4,

    borderRadius: 20,

    backgroundColor: 'rgba(238,243,229,0.12)',

    borderWidth: 1,

    borderColor: 'rgba(202,214,179,0.25)',
  },

  freeBadgeDot: {
    width: 6,
    height: 6,

    borderRadius: 3,

    marginRight: 5,

    backgroundColor: '#9EB277',
  },

  freeBadgeText: {
    color: '#CFDDB5',

    fontSize: 7.5,

    fontWeight: '800',

    letterSpacing: 0.5,
  },

  closeBtn: {
    width: 34,
    height: 34,

    borderRadius: 17,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: 'rgba(255,255,255,0.09)',

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.10)',
  },

  // ==========================================================
  // STEPS
  // ==========================================================

  stepContainer: {
    backgroundColor: COLORS.cream,

    borderBottomWidth: 1,

    borderBottomColor: COLORS.borderSoft,
  },

  stepRow: {
    flexDirection: 'row',

    paddingHorizontal: 8,

    paddingTop: 12,
    paddingBottom: 10,
  },

  stepItem: {
    flex: 1,

    alignItems: 'center',
  },

  stepCircleRow: {
    width: '100%',

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',
  },

  stepCircle: {
    width: 28,
    height: 28,

    borderRadius: 14,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: COLORS.biscuitLight,

    borderWidth: 1.5,

    borderColor: COLORS.border,
  },

  stepActive: {
    backgroundColor: COLORS.brown,

    borderColor: COLORS.brown,
  },

  stepDone: {
    backgroundColor: COLORS.green,

    borderColor: COLORS.green,
  },

  stepNum: {
    color: COLORS.softBrown,

    fontSize: 10.5,

    fontWeight: '800',
  },

  stepNumActive: {
    color: COLORS.white,
  },

  stepConnector: {
    flex: 1,

    height: 1.5,

    backgroundColor: COLORS.border,
  },

  stepConnectorActive: {
    backgroundColor: COLORS.green,
  },

  stepLabel: {
    marginTop: 5,

    color: COLORS.mutedBrown,

    fontSize: 8,

    fontWeight: '600',

    textAlign: 'center',
  },

  stepLabelActive: {
    color: COLORS.brown,

    fontWeight: '800',
  },

  stepLabelDone: {
    color: COLORS.green,
  },

  // ==========================================================
  // BODY
  // ==========================================================

  body: {
    paddingHorizontal: 18,

    paddingTop: 15,
  },

  bodyContent: {
    paddingBottom: 5,
  },

  contentHeading: {
    marginBottom: 16,
  },

  contentTitle: {
    color: COLORS.darkBrown,

    fontSize: 18,

    fontWeight: '800',
  },

  contentSubtitle: {
    marginTop: 3,

    color: COLORS.softBrown,

    fontSize: 10.5,

    lineHeight: 15,
  },

  // ==========================================================
  // LABEL
  // ==========================================================

  fieldLabel: {
    marginBottom: 7,

    color: COLORS.darkBrown,

    fontSize: 11,

    fontWeight: '800',
  },

  // ==========================================================
  // DATES
  // ==========================================================

  dateScrollContent: {
    paddingRight: 8,
  },

  dateChip: {
    minWidth: 78,

    alignItems: 'center',

    paddingHorizontal: 14,

    paddingVertical: 11,

    marginRight: 8,

    borderRadius: 14,

    backgroundColor: COLORS.cream,

    borderWidth: 1.5,

    borderColor: COLORS.border,

    position: 'relative',
  },

  dateChipActive: {
    backgroundColor: COLORS.brown,

    borderColor: COLORS.darkBrown,

    elevation: 3,

    shadowColor: COLORS.darkBrown,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.15,

    shadowRadius: 5,
  },

  dateDayText: {
    color: COLORS.darkBrown,

    fontSize: 11,

    fontWeight: '800',

    marginBottom: 3,
  },

  dateDateText: {
    color: COLORS.softBrown,

    fontSize: 9,
  },

  dateActiveText: {
    color: COLORS.white,
  },

  dateActiveSubText: {
    color: 'rgba(255,255,255,0.72)',
  },

  selectedMiniDot: {
    position: 'absolute',

    top: 6,
    right: 6,

    width: 5,
    height: 5,

    borderRadius: 3,

    backgroundColor: COLORS.biscuit,
  },

  // ==========================================================
  // TIME
  // ==========================================================

  timeLabel: {
    marginTop: 19,
  },

  slotsGrid: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    marginHorizontal: -4,
  },

  slotChip: {
    flexDirection: 'row',

    alignItems: 'center',

    marginHorizontal: 4,

    marginBottom: 8,

    paddingHorizontal: 11,

    paddingVertical: 9,

    borderRadius: 10,

    backgroundColor: COLORS.cream,

    borderWidth: 1,

    borderColor: COLORS.border,
  },

  slotChipActive: {
    backgroundColor: COLORS.brown,

    borderColor: COLORS.darkBrown,
  },

  slotText: {
    color: COLORS.darkBrown,

    marginLeft: 5,

    fontSize: 10.5,

    fontWeight: '700',
  },

  slotTextActive: {
    color: COLORS.white,
  },

  // ==========================================================
  // INPUTS
  // ==========================================================

  textInput: {
    minHeight: 48,

    marginBottom: 13,

    paddingHorizontal: 13,

    borderRadius: 11,

    backgroundColor: COLORS.cream,

    borderWidth: 1,

    borderColor: COLORS.border,

    color: COLORS.darkBrown,

    fontSize: 13,
  },

  // ==========================================================
  // PHONE INPUT
  // ==========================================================

  phoneInputContainer: {
    minHeight: 48,

    flexDirection: 'row',

    overflow: 'hidden',

    marginBottom: 13,

    borderRadius: 11,

    backgroundColor: COLORS.cream,

    borderWidth: 1,

    borderColor: COLORS.border,
  },

  countryCodeBox: {
    width: 57,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: COLORS.biscuitLight,

    borderRightWidth: 1,

    borderRightColor: COLORS.border,
  },

  countryCode: {
    color: COLORS.brown,

    fontSize: 12,

    fontWeight: '800',
  },

  phoneInput: {
    flex: 1,

    paddingHorizontal: 12,

    color: COLORS.darkBrown,

    fontSize: 13,
  },

  // ==========================================================
  // GENDER
  // ==========================================================

  genderRow: {
    flexDirection: 'row',

    marginHorizontal: -4,

    marginBottom: 16,
  },

  genderChip: {
    flex: 1,

    alignItems: 'center',

    marginHorizontal: 4,

    paddingVertical: 11,

    borderRadius: 10,

    backgroundColor: COLORS.cream,

    borderWidth: 1,

    borderColor: COLORS.border,
  },

  genderChipActive: {
    backgroundColor: COLORS.brown,

    borderColor: COLORS.darkBrown,
  },

  genderText: {
    color: COLORS.darkBrown,

    fontSize: 11,

    fontWeight: '700',
  },

  genderTextActive: {
    color: COLORS.white,
  },

  // ==========================================================
  // BUTTONS
  // ==========================================================

  nextBtn: {
    minHeight: 50,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 16,

    borderRadius: 12,

    backgroundColor: COLORS.brown,

    borderWidth: 1,

    borderColor: COLORS.darkBrown,

    elevation: 3,

    shadowColor: COLORS.darkBrown,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.16,

    shadowRadius: 5,
  },

  nextBtnDisabled: {
    opacity: 0.42,
  },

  nextBtnText: {
    color: COLORS.white,

    fontSize: 13,

    fontWeight: '800',
  },

  buttonArrowBox: {
    width: 24,
    height: 24,

    alignItems: 'center',

    justifyContent: 'center',

    marginLeft: 8,

    borderRadius: 12,

    backgroundColor: COLORS.darkBrown,
  },

  btnRow: {
    flexDirection: 'row',

    marginHorizontal: -4,

    marginTop: 4,
  },

  backBtn: {
    flex: 0.65,

    minHeight: 48,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    marginHorizontal: 4,

    borderRadius: 11,

    backgroundColor: COLORS.biscuitLight,

    borderWidth: 1,

    borderColor: COLORS.border,
  },

  backBtnText: {
    color: COLORS.brown,

    marginLeft: 6,

    fontSize: 12,

    fontWeight: '800',
  },

  confirmBtn: {
    flex: 1,

    minHeight: 48,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    marginHorizontal: 4,

    borderRadius: 11,

    backgroundColor: COLORS.brown,

    borderWidth: 1,

    borderColor: COLORS.darkBrown,
  },

  // ==========================================================
  // APPOINTMENT SUMMARY
  // ==========================================================

  bookingSummary: {
    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 17,

    paddingHorizontal: 11,

    paddingVertical: 10,

    borderRadius: 12,

    backgroundColor: COLORS.biscuitLight,

    borderWidth: 1,

    borderColor: COLORS.border,
  },

  summaryIconBox: {
    width: 34,
    height: 34,

    borderRadius: 10,

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 9,

    backgroundColor: COLORS.biscuit,
  },

  summaryTextArea: {
    flex: 1,
  },

  summarySmallText: {
    color: COLORS.mutedBrown,

    fontSize: 7.5,

    fontWeight: '800',

    letterSpacing: 0.7,

    marginBottom: 2,
  },

  summaryMainText: {
    color: COLORS.darkBrown,

    fontSize: 11,

    fontWeight: '800',
  },

  // ==========================================================
  // CONFIRM
  // ==========================================================

  confirmWrap: {
    alignItems: 'center',

    paddingTop: 5,
  },

  confirmIconOuter: {
    width: 76,
    height: 76,

    borderRadius: 38,

    alignItems: 'center',

    justifyContent: 'center',

    marginBottom: 12,

    backgroundColor: COLORS.greenLight,

    borderWidth: 1,

    borderColor: COLORS.greenBorder,
  },

  confirmIconInner: {
    width: 50,
    height: 50,

    borderRadius: 25,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: COLORS.green,
  },

  confirmTitle: {
    color: COLORS.darkBrown,

    fontSize: 20,

    fontWeight: '800',

    marginBottom: 4,
  },

  confirmSubtitle: {
    color: COLORS.softBrown,

    fontSize: 10.5,

    textAlign: 'center',

    marginBottom: 17,
  },

  // ==========================================================
  // CONFIRM CARD
  // ==========================================================

  confirmCard: {
    width: '100%',

    overflow: 'hidden',

    marginBottom: 16,

    borderRadius: 15,

    backgroundColor: COLORS.cream,

    borderWidth: 1,

    borderColor: COLORS.border,

    elevation: 2,

    shadowColor: COLORS.darkBrown,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.06,

    shadowRadius: 5,
  },

  confirmRow: {
    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 12,

    paddingVertical: 10,

    borderBottomWidth: 1,

    borderBottomColor: COLORS.borderSoft,
  },

  confirmRowLast: {
    borderBottomWidth: 0,
  },

  confirmRowIconBox: {
    width: 32,
    height: 32,

    borderRadius: 9,

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 10,

    backgroundColor: COLORS.biscuitLight,
  },

  confirmRowContent: {
    flex: 1,
  },

  confirmRowLabel: {
    color: COLORS.mutedBrown,

    fontSize: 8.5,

    fontWeight: '600',

    marginBottom: 2,
  },

  confirmRowValue: {
    color: COLORS.darkBrown,

    fontSize: 11.5,

    fontWeight: '700',

    lineHeight: 15,
  },

  freeValue: {
    color: COLORS.green,

    fontSize: 12,

    fontWeight: '900',
  },

  // ==========================================================
  // FINAL BUTTONS
  // ==========================================================

  doneBtn: {
    width: '100%',

    minHeight: 50,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    marginBottom: 9,

    borderRadius: 12,

    backgroundColor: COLORS.brown,

    borderWidth: 1,

    borderColor: COLORS.darkBrown,

    elevation: 3,

    shadowColor: COLORS.darkBrown,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.16,

    shadowRadius: 5,
  },

  doneBtnText: {
    color: COLORS.white,

    marginLeft: 8,

    fontSize: 13.5,

    fontWeight: '800',
  },

  editBtn: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 20,

    paddingVertical: 10,

    borderRadius: 10,

    backgroundColor: COLORS.biscuitLight,

    borderWidth: 1,

    borderColor: COLORS.border,
  },

  editBtnText: {
    color: COLORS.brown,

    marginLeft: 7,

    fontSize: 11,

    fontWeight: '800',
  },

  bottomSpace: {
    height: 30,
  },
});

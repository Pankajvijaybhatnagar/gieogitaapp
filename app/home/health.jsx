import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Modal,
  Alert,
  Linking,
} from 'react-native';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
const C = {
  deepBrown:    '#2C1A0A',
  warmBrown:    '#4A2C0D',
  richBrown:    '#3D2010',
  gold:         '#C9A227',
  goldLight:    '#E8C55A',
  goldDark:     '#8B6914',
  goldBorder:   'rgba(201,162,39,0.30)',
  cream:        '#FDF6E3',
  creamDark:    '#F5E6C8',
  saffron:      '#E8721C',
  saffronLight: '#F4A44A',
  white:        '#FFFFFF',
  // Medanta brand
  medantaBlue:  '#003F7D',
  medantaLight: '#0062B8',
  medantaPale:  'rgba(0,63,125,0.08)',
  medantaBorder:'rgba(0,63,125,0.25)',
  green:        '#1A8F4A',
  greenLight:   '#27AE60',
  greenPale:    'rgba(26,143,74,0.1)',
  error:        '#E74C3C',
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SPECIALTIES = [
  { id: '1',  icon: '🫀', name: 'Cardiology',       desc: 'Heart health & ECG screening'          },
  { id: '2',  icon: '🦴', name: 'Orthopaedics',     desc: 'Bone, joint & spine check-up'          },
  { id: '3',  icon: '🧠', name: 'Neurology',         desc: 'Brain & nervous system care'           },
  { id: '4',  icon: '👁️', name: 'Ophthalmology',    desc: 'Eye check-up & vision care'            },
  { id: '5',  icon: '🦷', name: 'Dental',            desc: 'Dental screening & care'               },
  { id: '6',  icon: '🫁', name: 'Pulmonology',       desc: 'Lung & respiratory health'             },
  { id: '7',  icon: '🩸', name: 'Diabetology',       desc: 'Diabetes screening & management'       },
  { id: '8',  icon: '🧪', name: 'Pathology',         desc: 'Blood tests & lab investigations'      },
  { id: '9',  icon: '🩺', name: 'General Medicine',  desc: 'Comprehensive health check-up'         },
  { id: '10', icon: '👶', name: 'Paediatrics',       desc: 'Child health & wellness'               },
  { id: '11', icon: '👩', name: 'Gynaecology',       desc: "Women's health & wellness"             },
  { id: '12', icon: '🧴', name: 'Dermatology',       desc: 'Skin & hair health screening'          },
];

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM',
  '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
  '04:30 PM', '05:00 PM',
];

const FREE_SERVICES = [
  { icon: '🩺', title: 'General Health Check-up',  desc: 'Complete physical examination by Medanta doctors'         },
  { icon: '🫀', title: 'ECG Screening',             desc: 'Electrocardiogram for heart health assessment'            },
  { icon: '🩸', title: 'Blood Sugar Test',          desc: 'Fasting & post-prandial blood glucose measurement'        },
  { icon: '💊', title: 'Blood Pressure Check',      desc: 'Hypertension screening & lifestyle counselling'           },
  { icon: '👁️', title: 'Eye Screening',            desc: 'Basic vision check & eye pressure measurement'            },
  { icon: '🦷', title: 'Dental Check-up',           desc: 'Oral health examination & hygiene advice'                 },
  { icon: '🧪', title: 'BMI & Nutrition',           desc: 'Body mass index & personalized diet counselling'          },
  { icon: '🫁', title: 'Respiratory Check',         desc: 'Lung function screening & breathing assessment'           },
];

const DOCTORS = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    spec: 'General Physician',
    exp: '14 yrs',
    icon: '👩‍⚕️',
    avail: 'Mon – Sat',
  },
  {
    id: '2',
    name: 'Dr. Rajesh Gupta',
    spec: 'Cardiologist',
    exp: '18 yrs',
    icon: '👨‍⚕️',
    avail: 'Tue, Thu, Sat',
  },
  {
    id: '3',
    name: 'Dr. Sunita Mehta',
    spec: 'Gynaecologist',
    exp: '12 yrs',
    icon: '👩‍⚕️',
    avail: 'Mon, Wed, Fri',
  },
  {
    id: '4',
    name: 'Dr. Anil Verma',
    spec: 'Orthopaedic Surgeon',
    exp: '20 yrs',
    icon: '👨‍⚕️',
    avail: 'Mon – Fri',
  },
];

// Generate next 7 days
const getDates = () => {
  const days   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dates  = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push({
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d.getDay()],
      date:  `${d.getDate()} ${months[d.getMonth()]}`,
      full:  d.toDateString(),
    });
  }
  return dates;
};

// ─── GOLD DIVIDER ─────────────────────────────────────────────────────────────
function GoldDivider() {
  return (
    <View style={S.dividerRow}>
      <View style={S.dividerLine} />
      <Text style={S.dividerIcon}>🔱</Text>
      <View style={S.dividerLine} />
    </View>
  );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
function SectionHead({ label, title, accent }) {
  return (
    <View style={S.sectionHead}>
      <View style={S.sectionHeadPillRow}>
        <View style={S.sectionLine} />
        <View style={S.sectionPill}>
          <Text style={S.sectionPillText}>{label}</Text>
        </View>
        <View style={S.sectionLine} />
      </View>
      <Text style={S.sectionTitle}>
        {title} <Text style={S.sectionTitleAccent}>{accent}</Text>
      </Text>
    </View>
  );
}

// ─── BOOKING MODAL ────────────────────────────────────────────────────────────
function BookingModal({ visible, onClose, specialty }) {
  const [step,          setStep]         = useState(1); // 1=dates, 2=details, 3=confirm
  const [selectedDate,  setSelectedDate] = useState(null);
  const [selectedSlot,  setSelectedSlot] = useState(null);
  const [name,          setName]         = useState('');
  const [phone,         setPhone]        = useState('');
  const [age,           setAge]          = useState('');
  const [gender,        setGender]       = useState('');
  const dates = getDates();

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

          {/* Handle */}
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

            {/* ── STEP 1: Date & Time ── */}
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
                      <Text style={[BM.dateDayText, selectedDate?.full === d.full && BM.dateActiveText]}>
                        {d.label}
                      </Text>
                      <Text style={[BM.dateDateText, selectedDate?.full === d.full && BM.dateActiveText]}>
                        {d.date}
                      </Text>
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
                      <Text style={[BM.slotText, selectedSlot === slot && BM.slotTextActive]}>
                        {slot}
                      </Text>
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

            {/* ── STEP 2: Patient Details ── */}
            {step === 2 && (
              <View>
                <Text style={BM.bookingSummary}>
                  📅 {selectedDate?.date}  •  ⏰ {selectedSlot}
                </Text>

                <Text style={BM.fieldLabel}>Full Name *</Text>
                <TextInput
                  style={BM.textInput}
                  placeholder="Enter your full name"
                  placeholderTextColor={C.goldDark}
                  value={name}
                  onChangeText={setName}
                />

                <Text style={BM.fieldLabel}>Phone Number *</Text>
                <TextInput
                  style={BM.textInput}
                  placeholder="Enter phone number"
                  placeholderTextColor={C.goldDark}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />

                <Text style={BM.fieldLabel}>Age *</Text>
                <TextInput
                  style={BM.textInput}
                  placeholder="Enter your age"
                  placeholderTextColor={C.goldDark}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                />

                <Text style={BM.fieldLabel}>Gender *</Text>
                <View style={BM.genderRow}>
                  {['Male', 'Female', 'Other'].map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[BM.genderChip, gender === g && BM.genderChipActive]}
                      onPress={() => setGender(g)}
                      activeOpacity={0.8}
                    >
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

            {/* ── STEP 3: Confirmation ── */}
            {step === 3 && (
              <View style={BM.confirmWrap}>
                <Text style={BM.confirmTick}>✅</Text>
                <Text style={BM.confirmTitle}>Appointment Ready!</Text>
                <Text style={BM.confirmSubtitle}>
                  Please review your booking details below
                </Text>

                <View style={BM.confirmCard}>
                  {[
                    { icon: '🏥', label: 'Hospital',   value: 'Medanta at Gita Gyan Sansthanam'     },
                    { icon: '📍', label: 'Location',   value: 'Kurukshetra, Haryana'                },
                    { icon: '🩺', label: 'Specialty',  value: specialty.name                        },
                    { icon: '👤', label: 'Patient',    value: name                                  },
                    { icon: '📞', label: 'Phone',      value: phone                                 },
                    { icon: '📅', label: 'Date',       value: selectedDate?.date                    },
                    { icon: '⏰', label: 'Time',       value: selectedSlot                          },
                    { icon: '💰', label: 'Charges',    value: 'FREE  (Complimentary by Medanta)'    },
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

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export default function HealthScreen() {
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [modalVisible,      setModalVisible]      = useState(false);
  const [activeTab,         setActiveTab]         = useState('services'); // services | doctors
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, []);

  const openBooking = (spec) => {
    setSelectedSpecialty(spec);
    setModalVisible(true);
  };

  return (
    <View style={S.root}>
      <ScrollView style={S.scroll} showsVerticalScrollIndicator={false}>

        {/* ══════════════════════════════════
            HERO BANNER
        ══════════════════════════════════ */}
        <Animated.View style={[S.hero, { opacity: fadeAnim }]}>
          <View style={S.heroBlob1} />
          <View style={S.heroBlob2} />
          <Text style={S.heroOm}>ॐ</Text>

          {/* Medanta badge */}
          <View style={S.medantaBadge}>
            <View style={S.medantaDot} />
            <Text style={S.medantaBadgeText}>MEDANTA  •  FREE HEALTH SERVICES</Text>
          </View>

          <Text style={S.heroTitle}>
            Free Healthcare{'\n'}
            <Text style={S.heroTitleAccent}>At Gita Gyan</Text>
            {'\n'}Sansthanam
          </Text>

          <Text style={S.heroDesc}>
            Medanta — The Medicity, in partnership with GIEO GITA, offers free world-class health services to all devotees and visitors at Gita Gyan Sansthanam, Kurukshetra.
          </Text>

          {/* Key pills */}
          <View style={S.heroPillsRow}>
            {['🆓 100% Free', '🏥 Medanta Doctors', '📍 Kurukshetra'].map((p) => (
              <View key={p} style={S.heroPill}>
                <Text style={S.heroPillText}>{p}</Text>
              </View>
            ))}
          </View>

          {/* Quick book CTA */}
          <TouchableOpacity
            style={S.heroBtn}
            onPress={() => openBooking(SPECIALTIES[8])}
            activeOpacity={0.85}
          >
            <FontAwesome name="calendar-plus-o" size={15} color={C.deepBrown} style={{ marginRight: 8 }} />
            <Text style={S.heroBtnText}>Book Free Appointment</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ══════════════════════════════════
            ABOUT MEDANTA
        ══════════════════════════════════ */}
        <View style={S.aboutSection}>
          <SectionHead label="ABOUT" title="Medanta at" accent="GIEO GITA" />
          <View style={S.aboutCard}>
            <View style={S.aboutLogoRow}>
              <View style={S.aboutLogoBox}>
                <Text style={S.aboutLogoText}>M</Text>
              </View>
              <View style={S.aboutLogoTextCol}>
                <Text style={S.aboutLogoTitle}>Medanta — The Medicity</Text>
                <Text style={S.aboutLogoSub}>India's Leading Multi-Specialty Hospital</Text>
              </View>
            </View>
            <Text style={S.aboutDesc}>
              Medanta is one of India's largest and most prestigious hospital groups. In a divine seva initiative, Medanta has partnered with GIEO GITA to provide FREE quality healthcare to all devotees, pilgrims, and visitors at Gita Gyan Sansthanam, Kurukshetra — bringing healing to the holy land.
            </Text>
            <View style={S.aboutStatsRow}>
              {[
                { value: '45+', label: 'Specialties' },
                { value: '2500+', label: 'Beds'       },
                { value: '1000+', label: 'Doctors'    },
                { value: 'FREE',  label: 'At GIEO'    },
              ].map((st) => (
                <View key={st.label} style={S.aboutStatBox}>
                  <Text style={S.aboutStatValue}>{st.value}</Text>
                  <Text style={S.aboutStatLabel}>{st.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <GoldDivider />

        {/* ══════════════════════════════════
            FREE SERVICES
        ══════════════════════════════════ */}
        <View style={S.servicesSection}>
          <SectionHead label="FREE SERVICES" title="What's" accent="Covered?" />
          <View style={S.servicesGrid}>
            {FREE_SERVICES.map((svc, i) => (
              <View key={i} style={S.serviceCard}>
                <Text style={S.serviceCardIcon}>{svc.icon}</Text>
                <Text style={S.serviceCardTitle}>{svc.title}</Text>
                <Text style={S.serviceCardDesc}>{svc.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        <GoldDivider />

        {/* ══════════════════════════════════
            SPECIALTIES + DOCTORS TABS
        ══════════════════════════════════ */}
        <View style={S.tabSection}>
          <SectionHead label="BOOK APPOINTMENT" title="Choose" accent="Specialty" />

          {/* Tabs */}
          <View style={S.tabRow}>
            {['services', 'doctors'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[S.tabChip, activeTab === tab && S.tabChipActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}
              >
                <Text style={[S.tabChipText, activeTab === tab && S.tabChipTextActive]}>
                  {tab === 'services' ? '🩺  By Specialty' : '👨‍⚕️  By Doctor'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── BY SPECIALTY ── */}
          {activeTab === 'services' && (
            <View style={S.specialtyGrid}>
              {SPECIALTIES.map((spec) => (
                <TouchableOpacity
                  key={spec.id}
                  style={S.specCard}
                  onPress={() => openBooking(spec)}
                  activeOpacity={0.82}
                >
                  <Text style={S.specIcon}>{spec.icon}</Text>
                  <Text style={S.specName}>{spec.name}</Text>
                  <Text style={S.specDesc} numberOfLines={2}>{spec.desc}</Text>
                  <View style={S.specBookBtn}>
                    <Text style={S.specBookBtnText}>Book Free</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ── BY DOCTOR ── */}
          {activeTab === 'doctors' && (
            <View style={S.doctorsList}>
              {DOCTORS.map((doc) => (
                <View key={doc.id} style={S.doctorCard}>
                  <View style={S.doctorAvatarBox}>
                    <Text style={S.doctorAvatar}>{doc.icon}</Text>
                  </View>
                  <View style={S.doctorInfo}>
                    <Text style={S.doctorName}>{doc.name}</Text>
                    <Text style={S.doctorSpec}>{doc.spec}</Text>
                    <View style={S.doctorMetaRow}>
                      <View style={S.doctorMetaPill}>
                        <Text style={S.doctorMetaText}>🎓 {doc.exp} exp</Text>
                      </View>
                      <View style={S.doctorMetaPill}>
                        <Text style={S.doctorMetaText}>📅 {doc.avail}</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={S.doctorBookBtn}
                    onPress={() => openBooking(SPECIALTIES.find(s => s.name.includes(doc.spec.split(' ')[0])) || SPECIALTIES[8])}
                    activeOpacity={0.85}
                  >
                    <Text style={S.doctorBookBtnText}>Book</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <GoldDivider />

        {/* ══════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════ */}
        <View style={S.howSection}>
          <SectionHead label="PROCESS" title="How To" accent="Book?" />
          <View style={S.howStepsCol}>
            {[
              { num: '01', icon: '📱', title: 'Select Specialty',    desc: 'Choose from 12+ medical specialties available'    },
              { num: '02', icon: '📅', title: 'Pick Date & Time',    desc: 'Choose from available slots at the camp'           },
              { num: '03', icon: '📝', title: 'Enter Details',       desc: 'Provide your name, phone and basic health info'    },
              { num: '04', icon: '✅', title: 'Get Confirmation',    desc: 'Receive booking confirmation on your phone'        },
              { num: '05', icon: '🏥', title: 'Visit & Get Treated', desc: 'Visit Gita Gyan Sansthanam on the booked day'      },
            ].map((step, i) => (
              <View key={i} style={S.howStep}>
                <View style={S.howStepLeft}>
                  <View style={S.howNumBadge}>
                    <Text style={S.howNum}>{step.num}</Text>
                  </View>
                  {i < 4 && <View style={S.howConnector} />}
                </View>
                <View style={S.howStepContent}>
                  <View style={S.howStepCard}>
                    <Text style={S.howStepIcon}>{step.icon}</Text>
                    <View style={S.howStepTextCol}>
                      <Text style={S.howStepTitle}>{step.title}</Text>
                      <Text style={S.howStepDesc}>{step.desc}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <GoldDivider />

        {/* ══════════════════════════════════
            CONTACT & LOCATION
        ══════════════════════════════════ */}
        <View style={S.contactSection}>
          <SectionHead label="LOCATION" title="Visit Us" accent="At Kurukshetra" />

          <View style={S.locationCard}>
            <View style={S.locationIconBox}>
              <Text style={S.locationIcon}>📍</Text>
            </View>
            <View style={S.locationTextCol}>
              <Text style={S.locationTitle}>Gita Gyan Sansthanam</Text>
              <Text style={S.locationAddr}>Kurukshetra, Haryana — 136118</Text>
              <Text style={S.locationSub}>Medanta Health Camp — Complimentary for all</Text>
            </View>
          </View>

          <View style={S.contactBtnRow}>
            <TouchableOpacity
              style={S.contactBtn}
              onPress={() => Linking.openURL('tel:+911234567890')}
              activeOpacity={0.85}
            >
              <FontAwesome name="phone" size={14} color={C.deepBrown} />
              <Text style={S.contactBtnText}>Call Us</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[S.contactBtn, { backgroundColor: C.green }]}
              onPress={() => Linking.openURL('https://wa.me/911234567890')}
              activeOpacity={0.85}
            >
              <FontAwesome name="whatsapp" size={14} color={C.white} />
              <Text style={[S.contactBtnText, { color: C.white }]}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[S.contactBtn, { backgroundColor: C.medantaBlue }]}
              onPress={() => Linking.openURL('https://www.medanta.org')}
              activeOpacity={0.85}
            >
              <FontAwesome name="globe" size={14} color={C.white} />
              <Text style={[S.contactBtnText, { color: C.white }]}>Medanta</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* ── BOOKING MODAL ── */}
      <BookingModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        specialty={selectedSpecialty}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN STYLES
// ─────────────────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.cream },
  scroll: { flex: 1 },

  dividerRow:  { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.goldDark, opacity: 0.3 },
  dividerIcon: { fontSize: 14, marginHorizontal: 10 },

  // ── SECTION HEADER ──────────────────────────────────────────────
  sectionHead:       { paddingHorizontal: 20, paddingTop: 4, marginBottom: 16 },
  sectionHeadPillRow:{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  sectionLine:       { flex: 1, height: 1, backgroundColor: C.goldDark, opacity: 0.25 },
  sectionPill: {
    backgroundColor: C.creamDark, borderWidth: 1, borderColor: C.goldBorder,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginHorizontal: 10,
  },
  sectionPillText:    { fontSize: 9, fontWeight: '800', color: C.goldDark, letterSpacing: 2 },
  sectionTitle:       { fontSize: 20, fontWeight: '800', color: C.deepBrown },
  sectionTitleAccent: { color: C.medantaBlue },

  // ── HERO ────────────────────────────────────────────────────────
  hero: {
    backgroundColor: C.deepBrown,
    paddingTop: 28, paddingBottom: 28, paddingHorizontal: 22,
    position: 'relative', overflow: 'hidden',
  },
  heroBlob1: { position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: 'rgba(0,63,125,0.12)', top: -80, right: -60 },
  heroBlob2: { position: 'absolute', width: 140, height: 140, borderRadius: 70,  backgroundColor: 'rgba(74,44,13,0.25)',  bottom: -50, left: -40 },
  heroOm:    { position: 'absolute', right: 20, top: 10, fontSize: 90, color: 'rgba(201,162,39,0.05)', lineHeight: 100 },

  medantaBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.medantaPale,
    borderWidth: 1, borderColor: C.medantaBorder,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
    alignSelf: 'flex-start', marginBottom: 16,
  },
  medantaDot:      { width: 7, height: 7, borderRadius: 4, backgroundColor: C.medantaLight },
  medantaBadgeText:{ fontSize: 9, color: C.medantaLight, letterSpacing: 1.5, fontWeight: '800' },

  heroTitle:       { fontSize: 28, fontWeight: '800', color: C.cream, lineHeight: 34, marginBottom: 10 },
  heroTitleAccent: { color: C.goldLight },
  heroDesc:        { fontSize: 12, color: 'rgba(253,246,227,0.7)', lineHeight: 19, fontStyle: 'italic', marginBottom: 16 },
  heroPillsRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  heroPill: {
    backgroundColor: 'rgba(201,162,39,0.12)',
    borderWidth: 1, borderColor: C.goldBorder,
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
  },
  heroPillText: { fontSize: 10, color: C.goldLight, fontWeight: '700' },
  heroBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.gold, borderRadius: 22,
    paddingVertical: 13, paddingHorizontal: 22,
    alignSelf: 'flex-start',
    shadowColor: C.gold, shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 5,
  },
  heroBtnText: { fontSize: 14, fontWeight: '800', color: C.deepBrown, letterSpacing: 0.3 },

  // ── ABOUT ───────────────────────────────────────────────────────
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
    backgroundColor: C.medantaBlue,
    alignItems: 'center', justifyContent: 'center',
  },
  aboutLogoText:    { fontSize: 22, fontWeight: '900', color: C.white },
  aboutLogoTextCol: { flex: 1 },
  aboutLogoTitle:   { fontSize: 13, fontWeight: '800', color: C.medantaBlue },
  aboutLogoSub:     { fontSize: 10, color: C.goldDark, fontStyle: 'italic', marginTop: 2 },
  aboutDesc:        { fontSize: 12, color: '#444', lineHeight: 19, marginBottom: 16 },
  aboutStatsRow:    { flexDirection: 'row', gap: 10 },
  aboutStatBox: {
    flex: 1, backgroundColor: C.medantaPale,
    borderRadius: 12, padding: 10, alignItems: 'center',
    borderWidth: 1, borderColor: C.medantaBorder,
  },
  aboutStatValue: { fontSize: 16, fontWeight: '800', color: C.medantaBlue },
  aboutStatLabel: { fontSize: 9,  color: C.goldDark, marginTop: 2, fontWeight: '600' },

  // ── FREE SERVICES ───────────────────────────────────────────────
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

  // ── TABS ────────────────────────────────────────────────────────
  tabSection: { paddingHorizontal: 20 },
  tabRow:     { flexDirection: 'row', gap: 10, marginBottom: 14 },
  tabChip: {
    flex: 1, backgroundColor: C.creamDark,
    borderWidth: 1, borderColor: C.goldBorder,
    borderRadius: 14, paddingVertical: 11, alignItems: 'center',
  },
  tabChipActive:     { backgroundColor: C.deepBrown, borderColor: C.gold },
  tabChipText:       { fontSize: 12, fontWeight: '700', color: C.warmBrown },
  tabChipTextActive: { color: C.goldLight },

  // ── SPECIALTY GRID ──────────────────────────────────────────────
  specialtyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  specCard: {
    width: (width - 60) / 2,
    backgroundColor: C.white, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: C.goldBorder,
    alignItems: 'center',
    shadowColor: C.deepBrown, shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2,
  },
  specIcon: { fontSize: 32, marginBottom: 8 },
  specName: { fontSize: 12, fontWeight: '800', color: C.deepBrown, textAlign: 'center', marginBottom: 4 },
  specDesc: { fontSize: 9, color: '#777', textAlign: 'center', lineHeight: 13, fontStyle: 'italic', marginBottom: 10 },
  specBookBtn: {
    backgroundColor: C.medantaBlue, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  specBookBtnText: { fontSize: 10, fontWeight: '800', color: C.white },

  // ── DOCTORS ─────────────────────────────────────────────────────
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
    backgroundColor: C.medantaPale,
    borderWidth: 1.5, borderColor: C.medantaBorder,
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
    backgroundColor: C.gold, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  doctorBookBtnText: { fontSize: 11, fontWeight: '800', color: C.deepBrown },

  // ── HOW IT WORKS ────────────────────────────────────────────────
  howSection:    { paddingHorizontal: 20 },
  howStepsCol:   { gap: 0 },
  howStep:       { flexDirection: 'row', gap: 14 },
  howStepLeft:   { alignItems: 'center', width: 36 },
  howNumBadge: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: C.deepBrown,
    borderWidth: 1.5, borderColor: C.gold,
    alignItems: 'center', justifyContent: 'center',
  },
  howNum:        { fontSize: 11, fontWeight: '800', color: C.goldLight },
  howConnector:  { width: 2, flex: 1, backgroundColor: C.goldBorder, marginVertical: 4, minHeight: 16 },
  howStepContent:{ flex: 1, paddingBottom: 14 },
  howStepCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: C.white, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: C.goldBorder,
  },
  howStepIcon:    { fontSize: 22 },
  howStepTextCol: { flex: 1 },
  howStepTitle:   { fontSize: 13, fontWeight: '800', color: C.deepBrown, marginBottom: 3 },
  howStepDesc:    { fontSize: 11, color: '#666', lineHeight: 16 },

  // ── CONTACT ─────────────────────────────────────────────────────
  contactSection: { paddingHorizontal: 20 },
  locationCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: C.deepBrown, borderRadius: 16, padding: 16,
    marginBottom: 14, borderWidth: 1, borderColor: C.goldBorder,
  },
  locationIconBox: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: 'rgba(201,162,39,0.12)',
    borderWidth: 1, borderColor: C.goldBorder,
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

// ─────────────────────────────────────────────────────────────────────────────
// BOOKING MODAL STYLES
// ─────────────────────────────────────────────────────────────────────────────
const BM = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: C.cream, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    borderTopWidth: 2, borderTopColor: C.medantaBlue, maxHeight: '92%',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: C.goldDark, alignSelf: 'center', marginTop: 10, marginBottom: 4,
  },

  // Header
  header: {
    backgroundColor: C.medantaBlue, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,63,125,0.3)',
    position: 'relative', overflow: 'hidden',
  },
  headerBlob: {
    position: 'absolute', width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.05)', top: -50, right: -40,
  },
  headerIcon:    { fontSize: 34 },
  headerTextCol: { flex: 1 },
  headerTitle:   { fontSize: 16, fontWeight: '800', color: C.white },
  headerDesc:    { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', marginTop: 2 },
  freeBadge: {
    backgroundColor: 'rgba(39,174,96,0.2)', borderWidth: 1,
    borderColor: 'rgba(39,174,96,0.4)', borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 3, marginTop: 6, alignSelf: 'flex-start',
  },
  freeBadgeText: { fontSize: 9, color: '#27AE60', fontWeight: '800' },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Step row
  stepRow: {
    flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: C.creamDark, borderBottomWidth: 1, borderBottomColor: C.goldBorder,
    gap: 4,
  },
  stepItem:        { flex: 1, alignItems: 'center', gap: 4 },
  stepCircle: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: C.creamDark, borderWidth: 1.5, borderColor: C.goldBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  stepActive: { backgroundColor: C.medantaBlue, borderColor: C.medantaBlue },
  stepDone:   { backgroundColor: C.green,       borderColor: C.green },
  stepNum:    { fontSize: 11, fontWeight: '800', color: C.goldDark },
  stepLabel:  { fontSize: 8, color: C.goldDark, textAlign: 'center', fontWeight: '600' },
  stepLabelActive: { color: C.medantaBlue },

  // Body
  body: { paddingHorizontal: 18, paddingTop: 14 },

  fieldLabel: {
    fontSize: 11, fontWeight: '800', color: C.goldDark,
    letterSpacing: 0.5, marginBottom: 8,
  },

  // Dates
  dateChip: {
    alignItems: 'center', backgroundColor: C.white,
    borderWidth: 1.5, borderColor: C.goldBorder,
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10,
    marginRight: 8, minWidth: 76,
  },
  dateChipActive:  { backgroundColor: C.medantaBlue, borderColor: C.medantaBlue },
  dateDayText:     { fontSize: 11, fontWeight: '800', color: C.warmBrown, marginBottom: 2 },
  dateDateText:    { fontSize: 9,  color: C.goldDark },
  dateActiveText:  { color: C.white },

  // Slots
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotChip: {
    backgroundColor: C.white, borderWidth: 1.5, borderColor: C.goldBorder,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
  },
  slotChipActive: { backgroundColor: C.medantaBlue, borderColor: C.medantaBlue },
  slotText:       { fontSize: 11, fontWeight: '700', color: C.warmBrown },
  slotTextActive: { color: C.white },

  // Text inputs
  textInput: {
    backgroundColor: C.white, borderWidth: 1.5, borderColor: C.goldBorder,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: C.deepBrown, marginBottom: 12,
  },

  // Gender
  genderRow:  { flexDirection: 'row', gap: 10, marginBottom: 16 },
  genderChip: {
    flex: 1, backgroundColor: C.white, borderWidth: 1.5, borderColor: C.goldBorder,
    borderRadius: 10, paddingVertical: 10, alignItems: 'center',
  },
  genderChipActive: { backgroundColor: C.medantaBlue, borderColor: C.medantaBlue },
  genderText:       { fontSize: 12, fontWeight: '700', color: C.warmBrown },
  genderTextActive: { color: C.white },

  // Buttons
  btnRow:    { flexDirection: 'row', gap: 10, marginTop: 4 },
  nextBtn: {
    flex: 1, backgroundColor: C.medantaBlue, borderRadius: 14,
    paddingVertical: 14, alignItems: 'center',
  },
  nextBtnDisabled: { opacity: 0.5 },
  nextBtnText:     { fontSize: 14, fontWeight: '800', color: C.white },
  backBtn: {
    flex: 0.6, backgroundColor: C.creamDark, borderRadius: 14,
    paddingVertical: 14, alignItems: 'center',
    borderWidth: 1, borderColor: C.goldBorder,
  },
  backBtnText: { fontSize: 14, fontWeight: '700', color: C.warmBrown },

  bookingSummary: {
    backgroundColor: C.medantaPale, borderWidth: 1, borderColor: C.medantaBorder,
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8,
    fontSize: 11, color: C.medantaBlue, fontWeight: '700',
    marginBottom: 16,
  },

  // Confirm
  confirmWrap:     { alignItems: 'center', paddingTop: 8 },
  confirmTick:     { fontSize: 52, marginBottom: 10 },
  confirmTitle:    { fontSize: 20, fontWeight: '800', color: C.deepBrown, marginBottom: 4 },
  confirmSubtitle: { fontSize: 12, color: C.warmBrown, fontStyle: 'italic', marginBottom: 16 },
  confirmCard: {
    width: '100%', backgroundColor: C.white, borderRadius: 16,
    borderWidth: 1, borderColor: C.goldBorder, overflow: 'hidden', marginBottom: 16,
  },
  confirmRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(201,162,39,0.15)',
  },
  confirmRowIcon:  { fontSize: 16, width: 24, textAlign: 'center' },
  confirmRowLabel: { fontSize: 11, color: C.goldDark, fontWeight: '700', width: 70 },
  confirmRowValue: { flex: 1, fontSize: 12, color: C.deepBrown, fontWeight: '600' },
  doneBtn: {
    width: '100%', backgroundColor: C.green, borderRadius: 14,
    paddingVertical: 14, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  doneBtnText: { fontSize: 15, fontWeight: '800', color: C.white },
  editBtn: {
    backgroundColor: C.creamDark, borderRadius: 12,
    paddingVertical: 10, paddingHorizontal: 24,
    borderWidth: 1, borderColor: C.goldBorder,
  },
  editBtnText: { fontSize: 12, fontWeight: '700', color: C.warmBrown },
});
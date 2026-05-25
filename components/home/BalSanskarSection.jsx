import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from './constant';
import { SectionHeader } from './Sharedui';

const curriculum = [
  { icon: '📖', title: 'Gita Shloka Recitation', desc: 'Daily memorisation and chanting of all 18 chapters', level: 'Foundation' },
  { icon: '🧘', title: 'Yoga & Pranayama', desc: 'Holistic wellness through ancient yogic practices', level: 'Wellness' },
  { icon: '🎨', title: 'Cultural Arts', desc: 'Classical music, dance, and devotional expression', level: 'Creative' },
  { icon: '🤝', title: 'Seva & Values', desc: 'Building character through selfless service', level: 'Character' },
  { icon: '🕉️', title: 'Sanskrit & Vedic Maths', desc: 'Ancient language and mathematical wisdom', level: 'Academic' },
  { icon: '🌱', title: 'Nature & Ecology', desc: 'Reverence for creation through Gita teachings', level: 'Spiritual' },
];

const teachers = [
  { name: 'Pandit Ramesh Sharma', role: 'Head — Gita & Sanskrit', exp: '22 yrs', icon: '🪔' },
  { name: 'Dr. Meera Devi', role: 'Yoga & Meditation', exp: '15 yrs', icon: '🧘' },
  { name: 'Acharya Sunil Ji', role: 'Vedic Philosophy', exp: '18 yrs', icon: '📿' },
  { name: 'Smt. Kavita Gupta', role: 'Cultural Arts', exp: '12 yrs', icon: '🎶' },
];

const ageGroups = [
  { age: '5–8', label: 'Balak', color: 'rgba(201,162,39,0.2)', desc: 'Stories & Songs' },
  { age: '9–12', label: 'Kishora', color: 'rgba(201,162,39,0.3)', desc: 'Shlokas & Yoga' },
  { age: '13–16', label: 'Yuva', color: 'rgba(201,162,39,0.45)', desc: 'Deep Study' },
];

const stats = [
  { value: '500+', label: 'Students' },
  { value: '12', label: 'Subjects' },
  { value: '4', label: 'Teachers' },
  { value: '10+', label: 'Years' },
];

const schedule = [
  { day: 'Mon & Wed', time: '4:00 – 6:00 PM', topic: 'Gita Shlokas & Sanskrit' },
  { day: 'Tue & Thu', time: '4:00 – 5:30 PM', topic: 'Yoga & Pranayama' },
  { day: 'Saturday', time: '10:00 AM – 1:00 PM', topic: 'Cultural Arts & Seva' },
  { day: 'Sunday', time: '9:00 – 11:00 AM', topic: 'Vedic Philosophy & Satsang' },
];

export default function BalSanskarSection() {
  return (
    <>
      <SectionHeader title="📚 Bal" accent="Sanskar" />

      {/* Hero Card */}
      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✨ Vedic Education Program</Text>
        </View>
        <Text style={styles.heroHeading}>
          Nurturing{' '}
          <Text style={styles.accent}>Young Minds</Text>
          {'\n'}With Timeless Values
        </Text>
        <Text style={styles.desc}>
          Bal Sanskar blends the sacred wisdom of the Bhagwad Gita with joyful,
          modern learning — building spiritual character from an early age.
        </Text>
        <View style={styles.statsRow}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Age Groups */}
      <View style={styles.card}>
        <View style={styles.rowTitle}>
          <Text style={styles.rowIcon}>🎓</Text>
          <Text style={styles.sectionTitle}>Age Groups</Text>
        </View>
        <View style={styles.ageRow}>
          {ageGroups.map((g) => (
            <View key={g.label} style={[styles.ageCard, { backgroundColor: g.color }]}>
              <Text style={styles.ageNum}>{g.age}</Text>
              <Text style={styles.ageLabel}>{g.label}</Text>
              <Text style={styles.ageDesc}>{g.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Curriculum */}
      <View style={styles.card}>
        <View style={styles.rowTitle}>
          <Text style={styles.rowIcon}>📜</Text>
          <Text style={styles.sectionTitle}>Our Curriculum</Text>
        </View>
        <View style={styles.grid}>
          {curriculum.map((item) => (
            <View key={item.title} style={styles.currCard}>
              <Text style={styles.currIcon}>{item.icon}</Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>{item.level}</Text>
              </View>
              <Text style={styles.currTitle}>{item.title}</Text>
              <Text style={styles.currDesc}>{item.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Teachers */}
      <View style={styles.card}>
        <View style={styles.rowTitle}>
          <Text style={styles.rowIcon}>🙏</Text>
          <Text style={styles.sectionTitle}>Our Acharyas</Text>
        </View>
        <Text style={styles.subText}>
          Experienced spiritual educators devoted to shaping the next generation
        </Text>
        {teachers.map((t) => (
          <View key={t.name} style={styles.teacherCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>{t.icon}</Text>
            </View>
            <View style={styles.teacherInfo}>
              <Text style={styles.teacherName}>{t.name}</Text>
              <Text style={styles.teacherRole}>{t.role}</Text>
            </View>
            <View style={styles.expBadge}>
              <Text style={styles.expText}>{t.exp}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Schedule */}
      <View style={styles.card}>
        <View style={styles.rowTitle}>
          <Text style={styles.rowIcon}>🗓️</Text>
          <Text style={styles.sectionTitle}>Weekly Schedule</Text>
        </View>
        {schedule.map((s, i) => (
          <View key={s.day} style={[styles.scheduleRow, i === schedule.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={styles.dot} />
            <View style={styles.scheduleInfo}>
              <Text style={styles.scheduleDay}>{s.day}</Text>
              <Text style={styles.scheduleTopic}>{s.topic}</Text>
            </View>
            <Text style={styles.scheduleTime}>{s.time}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <View style={[styles.card, styles.ctaCard]}>
        <Text style={styles.ctaHeading}>Enroll Your Child Today</Text>
        <Text style={styles.ctaSubtext}>
          Give your child the gift of Gita wisdom.{'\n'}Admissions open for all age groups.
        </Text>
        <TouchableOpacity style={styles.ctaButton} activeOpacity={0.85}>
          <Text style={styles.ctaButtonText}>Apply for Admission</Text>
          <FontAwesome name="arrow-right" size={12} color="#2C1A0E" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.85}>
          <Text style={styles.secondaryText}>Download Brochure</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.richBrown,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.3)',
    marginBottom: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(201,162,39,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.35)',
    marginBottom: 12,
  },
  badgeText: { color: COLORS.goldLight, fontSize: 10, fontWeight: '700', letterSpacing: 0.4 },
  heroHeading: { color: COLORS.cream, fontSize: 20, fontWeight: '800', lineHeight: 28, marginBottom: 10 },
  accent: { color: COLORS.goldLight },
  desc: { color: 'rgba(253,246,227,0.65)', fontSize: 12, lineHeight: 18, fontStyle: 'italic', marginBottom: 14 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(201,162,39,0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.2)',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { color: COLORS.goldLight, fontSize: 16, fontWeight: '800' },
  statLabel: { color: 'rgba(253,246,227,0.5)', fontSize: 9, marginTop: 2, textAlign: 'center', fontStyle: 'italic' },

  rowTitle: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  rowIcon: { fontSize: 18 },
  sectionTitle: { color: COLORS.cream, fontSize: 15, fontWeight: '800' },
  subText: { color: 'rgba(253,246,227,0.55)', fontSize: 11, fontStyle: 'italic', marginBottom: 12, lineHeight: 16 },

  ageRow: { flexDirection: 'row', gap: 8 },
  ageCard: {
    flex: 1, borderRadius: 12, padding: 12, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.3)',
  },
  ageNum: { color: COLORS.goldLight, fontSize: 15, fontWeight: '800' },
  ageLabel: { color: COLORS.cream, fontSize: 11, fontWeight: '700', marginTop: 2 },
  ageDesc: { color: 'rgba(253,246,227,0.55)', fontSize: 9, marginTop: 3, textAlign: 'center', fontStyle: 'italic' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  currCard: {
    width: '47%', backgroundColor: 'rgba(201,162,39,0.08)',
    borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(201,162,39,0.2)',
  },
  currIcon: { fontSize: 22, marginBottom: 6 },
  levelBadge: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(201,162,39,0.2)',
    borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginBottom: 5,
  },
  levelText: { color: COLORS.goldLight, fontSize: 8, fontWeight: '700' },
  currTitle: { color: COLORS.cream, fontSize: 11, fontWeight: '700', marginBottom: 3 },
  currDesc: { color: 'rgba(253,246,227,0.5)', fontSize: 9, fontStyle: 'italic', lineHeight: 13 },

  teacherCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(201,162,39,0.08)', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.2)',
  },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(201,162,39,0.2)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.4)',
  },
  avatarIcon: { fontSize: 20 },
  teacherInfo: { flex: 1 },
  teacherName: { color: COLORS.cream, fontSize: 13, fontWeight: '700' },
  teacherRole: { color: 'rgba(253,246,227,0.55)', fontSize: 10, marginTop: 2, fontStyle: 'italic' },
  expBadge: {
    backgroundColor: 'rgba(201,162,39,0.15)', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(201,162,39,0.35)',
  },
  expText: { color: COLORS.goldLight, fontSize: 10, fontWeight: '700' },

  scheduleRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: 'rgba(201,162,39,0.12)',
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.goldLight },
  scheduleInfo: { flex: 1 },
  scheduleDay: { color: COLORS.cream, fontSize: 12, fontWeight: '700' },
  scheduleTopic: { color: 'rgba(253,246,227,0.55)', fontSize: 10, marginTop: 1, fontStyle: 'italic' },
  scheduleTime: { color: COLORS.goldLight, fontSize: 10, fontWeight: '600' },

  ctaCard: { alignItems: 'center', borderColor: 'rgba(201,162,39,0.45)', padding: 20 },
  ctaHeading: { color: COLORS.cream, fontSize: 17, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  ctaSubtext: { color: 'rgba(253,246,227,0.6)', fontSize: 11, fontStyle: 'italic', textAlign: 'center', lineHeight: 16, marginBottom: 16 },
  ctaButton: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.goldLight, borderRadius: 10,
    paddingVertical: 13, paddingHorizontal: 28, marginBottom: 10,
  },
  ctaButtonText: { color: '#2C1A0E', fontSize: 13, fontWeight: '800' },
  secondaryBtn: { paddingVertical: 6 },
  secondaryText: { color: 'rgba(253,246,227,0.45)', fontSize: 12, fontStyle: 'italic', textDecorationLine: 'underline' },
});
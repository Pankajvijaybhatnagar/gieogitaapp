import { DESIGN } from '@/constants/design';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from '@/components/ui/Card';
import { hairline, radii, spacing, type } from '@/constants/theme';
import { RGB } from '@/constants/brandColors';
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
  { age: '5–8', label: 'Balak', tint: 0.08, desc: 'Stories & Songs' },
  { age: '9–12', label: 'Kishora', tint: 0.14, desc: 'Shlokas & Yoga' },
  { age: '13–16', label: 'Yuva', tint: 0.2, desc: 'Deep Study' },
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
      <Card radius={radii.xl} style={styles.card}>
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
      </Card>

      {/* Age Groups */}
      <Card radius={radii.xl} style={styles.card}>
        <View style={styles.rowTitle}>
          <Text style={styles.rowIcon}>🎓</Text>
          <Text style={styles.sectionTitle}>Age Groups</Text>
        </View>
        <View style={styles.ageRow}>
          {ageGroups.map((g) => (
            <View
              key={g.label}
              style={[styles.ageCard, { backgroundColor: `rgba(${RGB.saffron},${g.tint})` }]}>
              <Text style={styles.ageNum}>{g.age}</Text>
              <Text style={styles.ageLabel}>{g.label}</Text>
              <Text style={styles.ageDesc}>{g.desc}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Curriculum */}
      <Card radius={radii.xl} style={styles.card}>
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
      </Card>

      {/* Teachers */}
      <Card radius={radii.xl} style={styles.card}>
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
      </Card>

      {/* Schedule */}
      <Card radius={radii.xl} style={styles.card}>
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
      </Card>

      {/* CTA */}
      <Card radius={radii.xl} style={[styles.card, styles.ctaCard]}>
        <Text style={styles.ctaHeading}>Enroll Your Child Today</Text>
        <Text style={styles.ctaSubtext}>
          Give your child the gift of Gita wisdom.{'\n'}Admissions open for all age groups.
        </Text>
        <TouchableOpacity style={styles.ctaButton} activeOpacity={0.85}>
          <Text style={styles.ctaButtonText}>Apply for Admission</Text>
          <FontAwesome name="arrow-right" size={12} color={COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.85}>
          <Text style={styles.secondaryText}>Download Brochure</Text>
        </TouchableOpacity>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.md
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: `rgba(${RGB.saffron},0.12)`,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: `rgba(${RGB.saffron},0.3)`,
    marginBottom: spacing.sm
  },
  badgeText: {
    color: COLORS.saffron,
    ...type.caption,
    letterSpacing: 0.4
  },
  heroHeading: {
    ...type.title,
    fontSize: 20,
    color: COLORS.deepBrown,
    lineHeight: 28,
    marginBottom: spacing.sm,
    fontFamily: DESIGN.fonts.editorial,
    fontWeight: "400",
    letterSpacing: -0.4
  },
  accent: {
    color: COLORS.saffron
  },
  desc: {
    ...type.body,
    color: COLORS.warmBrown,
    marginBottom: spacing.md
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.creamDark,
    borderRadius: radii.md,
    padding: spacing.sm
  },
  statItem: {
    alignItems: 'center',
    flex: 1
  },
  statValue: {
    color: COLORS.saffron,
    fontSize: 16,
    fontWeight: "600"
  },
  statLabel: {
    ...type.footnote,
    fontSize: 12,
    color: COLORS.warmBrown,
    marginTop: 2,
    textAlign: 'center'
  },
  rowTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  rowIcon: {
    fontSize: 18
  },
  sectionTitle: {
    ...type.headline,
    fontSize: 15,
    color: COLORS.deepBrown
  },
  subText: {
    ...type.footnote,
    color: COLORS.warmBrown,
    marginBottom: spacing.sm,
    lineHeight: 16
  },
  ageRow: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  ageCard: {
    flex: 1,
    borderRadius: radii.md,
    padding: spacing.sm,
    alignItems: 'center'
  },
  ageNum: {
    color: COLORS.saffron,
    fontSize: 15,
    fontWeight: "600"
  },
  ageLabel: {
    color: COLORS.deepBrown,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2
  },
  ageDesc: {
    color: COLORS.warmBrown,
    fontSize: 12,
    marginTop: 3,
    textAlign: 'center'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  currCard: {
    width: '47%',
    backgroundColor: DESIGN.colors.surface,
    borderRadius: 24,
    padding: spacing.sm,
    borderColor: DESIGN.colors.border,
    borderWidth: 1,
    shadowOpacity: 0.045,
    elevation: 2
  },
  currIcon: {
    fontSize: 22,
    marginBottom: spacing.xs
  },
  levelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: `rgba(${RGB.saffron},0.14)`,
    borderRadius: radii.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 5
  },
  levelText: {
    color: COLORS.saffron,
    fontSize: 12,
    fontWeight: '700'
  },
  currTitle: {
    color: COLORS.deepBrown,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 3
  },
  currDesc: {
    color: COLORS.warmBrown,
    fontSize: 12,
    lineHeight: 18
  },
  teacherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: DESIGN.colors.surface,
    borderRadius: 24,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
    marginBottom: spacing.sm,
    borderColor: DESIGN.colors.border,
    borderWidth: 1,
    shadowOpacity: 0.045,
    elevation: 2
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: `rgba(${RGB.saffron},0.14)`,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarIcon: {
    fontSize: 20
  },
  teacherInfo: {
    flex: 1
  },
  teacherName: {
    color: COLORS.deepBrown,
    fontSize: 13,
    fontWeight: '700'
  },
  teacherRole: {
    color: COLORS.warmBrown,
    fontSize: 12,
    marginTop: 2
  },
  expBadge: {
    backgroundColor: `rgba(${RGB.saffron},0.12)`,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 4
  },
  expText: {
    color: COLORS.saffron,
    fontSize: 12,
    fontWeight: '700'
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: hairline
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.saffron
  },
  scheduleInfo: {
    flex: 1
  },
  scheduleDay: {
    color: COLORS.deepBrown,
    fontSize: 12,
    fontWeight: '700'
  },
  scheduleTopic: {
    color: COLORS.warmBrown,
    fontSize: 12,
    marginTop: 1
  },
  scheduleTime: {
    color: COLORS.saffron,
    fontSize: 12,
    fontWeight: '600'
  },
  ctaCard: {
    alignItems: 'center',
    padding: spacing.lg
  },
  ctaHeading: {
    ...type.headline,
    fontSize: 17,
    color: COLORS.deepBrown,
    textAlign: 'center',
    marginBottom: spacing.sm
  },
  ctaSubtext: {
    ...type.footnote,
    color: COLORS.warmBrown,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: spacing.md
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: COLORS.saffron,
    borderRadius: radii.lg,
    paddingVertical: 13,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm
  },
  ctaButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600"
  },
  secondaryBtn: {
    paddingVertical: spacing.xs
  },
  secondaryText: {
    color: COLORS.warmBrown,
    fontSize: 12,
    textDecorationLine: 'underline'
  }
});

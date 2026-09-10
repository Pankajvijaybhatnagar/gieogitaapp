import { DESIGN } from '@/constants/design';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from '@/components/ui/Card';
import { hairline, radii, spacing, type } from '@/constants/theme';
import { COLORS, RGB } from '@/constants/brandColors';
import { SectionHeader } from './Sharedui';

const sevas = [
  { icon: '🐄', title: 'Gau Seva', desc: 'Daily care, feeding, and tending of each sacred cow with love and devotion' },
  { icon: '🌿', title: 'Organic Farming', desc: 'Natural cultivation using Panchagavya techniques blessed by Gita wisdom' },
  { icon: '🍶', title: 'Gau Products', desc: 'Pure A2 milk, ghee, and herbal preparations prepared with sacred intent' },
  { icon: '🙏', title: 'Gau Puja', desc: 'Devotional rituals honouring the divine presence in every cow' },
  { icon: '🌾', title: 'Gobar Krishi', desc: 'Cow dung–based natural farming reviving ancient agricultural traditions' },
  { icon: '💧', title: 'Gomutra Therapy', desc: 'Traditional Ayurvedic wellness using purified cow urine preparations' },
];

const stats = [
  { value: '108+', label: 'Cows Sheltered' },
  { value: '12', label: 'Acres of Land' },
  { value: '365', label: 'Days of Seva' },
  { value: '50+', label: 'Seva Volunteers' },
];

const products = [
  { icon: '🥛', name: 'A2 Milk', tag: 'Daily' },
  { icon: '🧈', name: 'Desi Ghee', tag: 'Pure' },
  { icon: '🌿', name: 'Gomutra Ark', tag: 'Herbal' },
  { icon: '🪴', name: 'Gobar Khad', tag: 'Organic' },
];

const timeline = [
  { year: '2012', event: 'Gaushala founded with 7 cows' },
  { year: '2015', event: 'Expanded to 12 acres of land' },
  { year: '2018', event: 'Launched organic farming unit' },
  { year: '2022', event: 'Crossed 100+ cows sheltered' },
  { year: '2024', event: 'Ayurvedic products range launched' },
];

export default function GieoGaushalaSection() {
  return (
    <View style={styles.page}>
      <SectionHeader title="🐄 Gieo" accent="Gaushala" />

      {/* ── Hero ── */}
      <Card radius={radii.xl} style={styles.heroCard}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>🕉️  Sacred Cow Sanctuary</Text>
        </View>
        <Text style={styles.heroHeading}>
          Where Every Cow Is{'\n'}
          <Text style={styles.heroAccent}>Worshipped As Gau Mata</Text>
        </Text>
        <Text style={styles.heroDesc}>
          Gieo Gaushala is our lovingly maintained sanctuary where gau mata is
          protected, worshipped, and served. Every act of seva here is a divine
          offering rooted in the wisdom of the Bhagwad Gita.
        </Text>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {stats.map((s, i) => (
            <View key={s.label} style={[styles.statBox, i % 2 !== 1 && styles.statBoxRight]}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* ── Seva Activities ── */}
      <Card radius={radii.xl} style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🌸</Text>
          <View>
            <Text style={styles.sectionTitle}>Our Seva Activities</Text>
            <Text style={styles.sectionSubtitle}>Six pillars of our daily devotion</Text>
          </View>
        </View>
        <View style={styles.sevaGrid}>
          {sevas.map((s) => (
            <View key={s.title} style={styles.sevaCard}>
              <View style={styles.sevaIconCircle}>
                <Text style={styles.sevaIconText}>{s.icon}</Text>
              </View>
              <Text style={styles.sevaTitle}>{s.title}</Text>
              <Text style={styles.sevaDesc}>{s.desc}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* ── Gau Products ── */}
      <Card radius={radii.xl} style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🛕</Text>
          <View>
            <Text style={styles.sectionTitle}>Gaushala Products</Text>
            <Text style={styles.sectionSubtitle}>Pure, natural, and divinely prepared</Text>
          </View>
        </View>
        <View style={styles.productsRow}>
          {products.map((p) => (
            <View key={p.name} style={styles.productCard}>
              <Text style={styles.productIcon}>{p.icon}</Text>
              <View style={styles.productTag}>
                <Text style={styles.productTagText}>{p.tag}</Text>
              </View>
              <Text style={styles.productName}>{p.name}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.productsCta} activeOpacity={0.85}>
          <Text style={styles.productsCtaText}>View All Products</Text>
          <FontAwesome name="chevron-right" size={11} color={COLORS.saffron} />
        </TouchableOpacity>
      </Card>

      {/* ── Our Journey ── */}
      <Card radius={radii.xl} style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>📿</Text>
          <View>
            <Text style={styles.sectionTitle}>Our Journey</Text>
            <Text style={styles.sectionSubtitle}>A decade of devotion and growth</Text>
          </View>
        </View>
        {timeline.map((t, i) => (
          <View key={t.year} style={styles.timelineRow}>
            <View style={styles.timelineLeft}>
              <Text style={styles.timelineYear}>{t.year}</Text>
              {i < timeline.length - 1 && <View style={styles.timelineLine} />}
            </View>
            <View style={[styles.timelineCard, i === timeline.length - 1 && { marginBottom: 0 }]}>
              <Text style={styles.timelineEvent}>{t.event}</Text>
            </View>
          </View>
        ))}
      </Card>

      {/* ── Volunteer / Visit ── */}
      <Card radius={radii.xl} style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🤝</Text>
          <View>
            <Text style={styles.sectionTitle}>Join Our Seva</Text>
            <Text style={styles.sectionSubtitle}>Come volunteer or visit the Gaushala</Text>
          </View>
        </View>
        <View style={styles.joinRow}>
          <View style={styles.joinCard}>
            <Text style={styles.joinCardIcon}>🌅</Text>
            <Text style={styles.joinCardTitle}>Morning Seva</Text>
            <Text style={styles.joinCardTime}>5:30 – 8:00 AM</Text>
            <Text style={styles.joinCardDesc}>Feeding, cleaning & Gau Puja</Text>
          </View>
          <View style={styles.joinCard}>
            <Text style={styles.joinCardIcon}>🌇</Text>
            <Text style={styles.joinCardTitle}>Evening Seva</Text>
            <Text style={styles.joinCardTime}>5:00 – 7:00 PM</Text>
            <Text style={styles.joinCardDesc}>Aarti, milking & care</Text>
          </View>
        </View>
        <View style={styles.visitInfo}>
          <FontAwesome name="map-marker" size={13} color={COLORS.goldDark} />
          <Text style={styles.visitText}>GIEO Gaushala, Vrindavan Road, Mathura, UP</Text>
        </View>
      </Card>

      {/* ── Donation CTA ── */}
      <Card radius={radii.xl} style={styles.donateCard}>
        <Text style={styles.donateEmoji}>🐄</Text>
        <Text style={styles.donateHeading}>Support Gau Mata Today</Text>
        <Text style={styles.donateSubtext}>
          Your contribution feeds, shelters, and protects our sacred cows.
          Even ₹108 makes a meaningful difference.
        </Text>
        <View style={styles.donateAmounts}>
          {['₹108', '₹501', '₹1001', '₹5100'].map((amt) => (
            <TouchableOpacity key={amt} style={styles.amountChip} activeOpacity={0.8}>
              <Text style={styles.amountText}>{amt}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.donateBtn} activeOpacity={0.85}>
          <Text style={styles.donateBtnText}>Donate for Gau Seva</Text>
          <FontAwesome name="heart" size={12} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.donateNote}>🕉️  Every seva is a step towards moksha</Text>
      </Card>

    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.cream
  },
  /* ── Hero ── */
  heroCard: {
    marginHorizontal: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.md
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: `rgba(${RGB.saffron},0.12)`,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: `rgba(${RGB.saffron},0.3)`,
    marginBottom: spacing.sm
  },
  heroBadgeText: {
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
  heroAccent: {
    color: COLORS.saffron
  },
  heroDesc: {
    ...type.body,
    color: COLORS.warmBrown,
    marginBottom: spacing.md
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  statBox: {
    width: '47%',
    backgroundColor: COLORS.creamDark,
    borderRadius: radii.md,
    padding: spacing.sm,
    alignItems: 'center'
  },
  statBoxRight: {},
  statValue: {
    color: COLORS.saffron,
    fontSize: 20,
    fontWeight: "600"
  },
  statLabel: {
    ...type.footnote,
    fontSize: 12,
    color: COLORS.warmBrown,
    marginTop: 3,
    textAlign: 'center'
  },
  /* ── Section Cards ── */
  sectionCard: {
    marginHorizontal: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.md
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  sectionIcon: {
    fontSize: 22,
    marginTop: 1
  },
  sectionTitle: {
    ...type.headline,
    fontSize: 15,
    color: COLORS.deepBrown
  },
  sectionSubtitle: {
    ...type.footnote,
    color: COLORS.warmBrown,
    marginTop: 2
  },
  /* ── Seva Grid ── */
  sevaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  sevaCard: {
    width: '47%',
    backgroundColor: DESIGN.colors.surface,
    borderRadius: 24,
    padding: spacing.sm,
    borderColor: DESIGN.colors.border,
    borderWidth: 1,
    shadowOpacity: 0.045,
    elevation: 2
  },
  sevaIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: `rgba(${RGB.saffron},0.14)`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs
  },
  sevaIconText: {
    fontSize: 18
  },
  sevaTitle: {
    color: COLORS.deepBrown,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4
  },
  sevaDesc: {
    color: COLORS.warmBrown,
    fontSize: 12,
    lineHeight: 18
  },
  /* ── Products ── */
  productsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  productCard: {
    flex: 1,
    backgroundColor: DESIGN.colors.surface,
    borderRadius: 24,
    padding: 10,
    alignItems: 'center',
    borderColor: DESIGN.colors.border,
    borderWidth: 1,
    shadowOpacity: 0.045,
    elevation: 2
  },
  productIcon: {
    fontSize: 22,
    marginBottom: 5
  },
  productTag: {
    backgroundColor: `rgba(${RGB.saffron},0.14)`,
    borderRadius: radii.sm,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginBottom: 4
  },
  productTagText: {
    color: COLORS.saffron,
    fontSize: 10,
    fontWeight: '700'
  },
  productName: {
    color: COLORS.deepBrown,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center'
  },
  productsCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: `rgba(${RGB.saffron},0.3)`,
    borderRadius: radii.sm,
    backgroundColor: `rgba(${RGB.saffron},0.08)`
  },
  productsCtaText: {
    color: COLORS.saffron,
    fontSize: 12,
    fontWeight: '700'
  },
  /* ── Timeline ── */
  timelineRow: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  timelineLeft: {
    alignItems: 'center',
    width: 40
  },
  timelineYear: {
    color: COLORS.saffron,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: hairline,
    marginBottom: 4
  },
  timelineCard: {
    flex: 1,
    backgroundColor: DESIGN.colors.surface,
    borderRadius: 24,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    justifyContent: 'center',
    borderColor: DESIGN.colors.border,
    borderWidth: 1,
    shadowOpacity: 0.045,
    elevation: 2
  },
  timelineEvent: {
    color: COLORS.deepBrown,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18
  },
  /* ── Join Seva ── */
  joinRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  joinCard: {
    flex: 1,
    backgroundColor: DESIGN.colors.surface,
    borderRadius: 24,
    padding: spacing.sm,
    alignItems: 'center',
    borderColor: DESIGN.colors.border,
    borderWidth: 1,
    shadowOpacity: 0.045,
    elevation: 2
  },
  joinCardIcon: {
    fontSize: 24,
    marginBottom: 6
  },
  joinCardTitle: {
    color: COLORS.deepBrown,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2
  },
  joinCardTime: {
    color: COLORS.saffron,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4
  },
  joinCardDesc: {
    color: COLORS.warmBrown,
    fontSize: 12,
    textAlign: 'center'
  },
  visitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: COLORS.creamDark,
    borderRadius: radii.sm,
    padding: spacing.sm
  },
  visitText: {
    color: COLORS.warmBrown,
    fontSize: 12,
    flex: 1
  },
  /* ── Donate ── */
  donateCard: {
    marginHorizontal: spacing.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md
  },
  donateEmoji: {
    fontSize: 36,
    marginBottom: spacing.sm
  },
  donateHeading: {
    ...type.headline,
    fontSize: 18,
    color: COLORS.deepBrown,
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontFamily: DESIGN.fonts.editorial,
    fontWeight: "400",
    letterSpacing: -0.4
  },
  donateSubtext: {
    ...type.footnote,
    color: COLORS.warmBrown,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: spacing.md
  },
  donateAmounts: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  amountChip: {
    backgroundColor: `rgba(${RGB.saffron},0.12)`,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: `rgba(${RGB.saffron},0.35)`
  },
  amountText: {
    color: COLORS.saffron,
    fontSize: 13,
    fontWeight: '700'
  },
  donateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: COLORS.richBrown,
    borderRadius: radii.lg,
    paddingVertical: 13,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm
  },
  donateBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600"
  },
  donateNote: {
    ...type.footnote,
    fontSize: 12,
    color: COLORS.warmBrown
  }
});

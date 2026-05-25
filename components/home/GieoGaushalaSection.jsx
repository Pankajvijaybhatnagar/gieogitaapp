import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from './constant';
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
      <View style={styles.heroCard}>
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
      </View>

      {/* ── Seva Activities ── */}
      <View style={styles.sectionCard}>
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
      </View>

      {/* ── Gau Products ── */}
      <View style={styles.sectionCard}>
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
          <FontAwesome name="chevron-right" size={11} color={COLORS.goldDark || '#C9A227'} />
        </TouchableOpacity>
      </View>

      {/* ── Our Journey ── */}
      <View style={styles.sectionCard}>
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
      </View>

      {/* ── Volunteer / Visit ── */}
      <View style={styles.sectionCard}>
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
          <FontAwesome name="map-marker" size={13} color={COLORS.goldDark || '#C9A227'} />
          <Text style={styles.visitText}>GIEO Gaushala, Vrindavan Road, Mathura, UP</Text>
        </View>
      </View>

      {/* ── Donation CTA ── */}
      <View style={styles.donateCard}>
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
          <FontAwesome name="heart" size={12} color="#2C1A0E" />
        </TouchableOpacity>
        <Text style={styles.donateNote}>🕉️  Every seva is a step towards moksha</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.cream,
  },

  /* ── Hero ── */
  heroCard: {
    backgroundColor: COLORS.richBrown,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.35)',
    marginBottom: 14,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(201,162,39,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.35)',
    marginBottom: 12,
  },
  heroBadgeText: { color: COLORS.goldLight, fontSize: 10, fontWeight: '700', letterSpacing: 0.4 },
  heroHeading: { color: COLORS.cream, fontSize: 20, fontWeight: '800', lineHeight: 28, marginBottom: 10 },
  heroAccent: { color: COLORS.goldLight },
  heroDesc: { color: 'rgba(253,246,227,0.65)', fontSize: 12, lineHeight: 18, fontStyle: 'italic', marginBottom: 16 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statBox: {
    width: '47%',
    backgroundColor: 'rgba(201,162,39,0.12)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.22)',
  },
  statBoxRight: { },
  statValue: { color: COLORS.goldLight, fontSize: 20, fontWeight: '800' },
  statLabel: { color: 'rgba(253,246,227,0.55)', fontSize: 9, marginTop: 3, textAlign: 'center', fontStyle: 'italic' },

  /* ── Section Cards ── */
  sectionCard: {
    backgroundColor: COLORS.richBrown,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.3)',
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 14,
  },
  sectionIcon: { fontSize: 22, marginTop: 1 },
  sectionTitle: { color: COLORS.cream, fontSize: 15, fontWeight: '800' },
  sectionSubtitle: { color: 'rgba(253,246,227,0.5)', fontSize: 10, marginTop: 2, fontStyle: 'italic' },

  /* ── Seva Grid ── */
  sevaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sevaCard: {
    width: '47%',
    backgroundColor: 'rgba(201,162,39,0.08)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.2)',
  },
  sevaIconCircle: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(201,162,39,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  sevaIconText: { fontSize: 18 },
  sevaTitle: { color: COLORS.cream, fontSize: 12, fontWeight: '700', marginBottom: 4 },
  sevaDesc: { color: 'rgba(253,246,227,0.5)', fontSize: 9, fontStyle: 'italic', lineHeight: 13 },

  /* ── Products ── */
  productsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  productCard: {
    flex: 1,
    backgroundColor: 'rgba(201,162,39,0.08)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.2)',
  },
  productIcon: { fontSize: 22, marginBottom: 5 },
  productTag: {
    backgroundColor: 'rgba(201,162,39,0.2)',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginBottom: 4,
  },
  productTagText: { color: COLORS.goldLight, fontSize: 7, fontWeight: '700' },
  productName: { color: COLORS.cream, fontSize: 10, fontWeight: '700', textAlign: 'center' },
  productsCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.3)',
    borderRadius: 10,
    backgroundColor: 'rgba(201,162,39,0.08)',
  },
  productsCtaText: { color: COLORS.goldLight, fontSize: 12, fontWeight: '700' },

  /* ── Timeline ── */
  timelineRow: { flexDirection: 'row', gap: 12 },
  timelineLeft: { alignItems: 'center', width: 40 },
  timelineYear: { color: COLORS.goldLight, fontSize: 10, fontWeight: '800', marginBottom: 4 },
  timelineLine: { width: 2, flex: 1, backgroundColor: 'rgba(201,162,39,0.25)', marginBottom: 4 },
  timelineCard: {
    flex: 1,
    backgroundColor: 'rgba(201,162,39,0.08)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.18)',
    justifyContent: 'center',
  },
  timelineEvent: { color: COLORS.cream, fontSize: 11, fontWeight: '600', lineHeight: 15 },

  /* ── Join Seva ── */
  joinRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  joinCard: {
    flex: 1,
    backgroundColor: 'rgba(201,162,39,0.08)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.2)',
  },
  joinCardIcon: { fontSize: 24, marginBottom: 6 },
  joinCardTitle: { color: COLORS.cream, fontSize: 12, fontWeight: '700', marginBottom: 2 },
  joinCardTime: { color: COLORS.goldLight, fontSize: 10, fontWeight: '700', marginBottom: 4 },
  joinCardDesc: { color: 'rgba(253,246,227,0.5)', fontSize: 9, fontStyle: 'italic', textAlign: 'center' },
  visitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(201,162,39,0.08)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.2)',
  },
  visitText: { color: 'rgba(253,246,227,0.65)', fontSize: 11, flex: 1, fontStyle: 'italic' },

  /* ── Donate ── */
  donateCard: {
    backgroundColor: COLORS.richBrown,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.45)',
    alignItems: 'center',
    marginBottom: 16,
  },
  donateEmoji: { fontSize: 36, marginBottom: 10 },
  donateHeading: { color: COLORS.cream, fontSize: 18, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  donateSubtext: { color: 'rgba(253,246,227,0.6)', fontSize: 11, fontStyle: 'italic', textAlign: 'center', lineHeight: 17, marginBottom: 16 },
  donateAmounts: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' },
  amountChip: {
    backgroundColor: 'rgba(201,162,39,0.15)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.4)',
  },
  amountText: { color: COLORS.goldLight, fontSize: 13, fontWeight: '700' },
  donateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.goldLight,
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 32,
    marginBottom: 12,
  },
  donateBtnText: { color: '#2C1A0E', fontSize: 14, fontWeight: '800' },
  donateNote: { color: 'rgba(253,246,227,0.4)', fontSize: 10, fontStyle: 'italic' },
});
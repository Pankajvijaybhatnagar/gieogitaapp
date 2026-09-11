import { DESIGN } from '@/constants/design';
import { PaathCounter } from '@/components/chants/PaathCounter';
import { TotalPaath } from '@/components/chants/TotalPaath';
import YourChants from '@/components/chants/YourChants';
import { COLORS, RGB } from '@/constants/brandColors';
import { hairline, radii, shadow, spacing, type } from '@/constants/theme';
import { useAppAlert } from '@/context/AppAlertContext';
import { useHeaderScrollProps } from '@/context/HeaderScrollContext';
import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

// ─── 18 ADHYAYS DATA ──────────────────────────────────────────────────────────
const ADHYAYS = [
  { num: 1, name: 'Arjuna Vishada Yoga', verses: 47, icon: '⚔️' },
  { num: 2, name: 'Sankhya Yoga', verses: 72, icon: '📜' },
  { num: 3, name: 'Karma Yoga', verses: 43, icon: '🌿' },
  { num: 4, name: 'Jnana Karma Sanyasa Yoga', verses: 42, icon: '🔥' },
  { num: 5, name: 'Karma Sanyasa Yoga', verses: 29, icon: '🕊️' },
  { num: 6, name: 'Atmasanyam Yoga', verses: 47, icon: '🧘' },
  { num: 7, name: 'Jnana Vijnana Yoga', verses: 30, icon: '✨' },
  { num: 8, name: 'Aksara Brahma Yoga', verses: 28, icon: '🌌' },
  { num: 9, name: 'Raja Vidya Yoga', verses: 34, icon: '👑' },
  { num: 10, name: 'Vibhuti Yoga', verses: 42, icon: '🌟' },
  { num: 11, name: 'Vishwarupa Darshana Yoga', verses: 55, icon: '🌍' },
  { num: 12, name: 'Bhakti Yoga', verses: 20, icon: '🪷' },
  { num: 13, name: 'Kshetra Kshetrajna Yoga', verses: 34, icon: '🌱' },
  { num: 14, name: 'Gunatraya Vibhaga Yoga', verses: 27, icon: '⚖️' },
  { num: 15, name: 'Purushottama Yoga', verses: 20, icon: '🌳' },
  { num: 16, name: 'Daivasura Vibhaga Yoga', verses: 24, icon: '🛡️' },
  { num: 17, name: 'Shraddhatraya Vibhaga', verses: 28, icon: '🙏' },
  { num: 18, name: 'Moksha Sanyasa Yoga', verses: 78, icon: '🕉️' },
];

// ─── REUSABLE: DIVIDER ────────────────────────────────────────────────────────
// A quiet hairline — no ornamental diamond, no gold.
function GoldDivider() {
  return <View style={sharedStyles.divider} />;
}

// ─── REUSABLE: SECTION LABEL ─────────────────────────────────────────────────
export function SectionLabel({ text }) {
  return (
    <View style={sharedStyles.sectionLabelRow}>
      <View style={sharedStyles.sectionLabelLine} />
      <Text style={sharedStyles.sectionLabelText}>{text}</Text>
      <View style={sharedStyles.sectionLabelLine} />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EK MIN EK SAATH SECTION  — about the campaign
// ─────────────────────────────────────────────────────────────────────────────
function EkMinSection() {
  const shimmer = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -7,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const shimmerOpacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  const benefits = [
    {
      icon: '🧘',
      title: 'Inner Peace',
      desc: 'Daily recitation calms the mind',
    },
    {
      icon: '📖',
      title: '18 Adhyays',
      desc: 'Complete Gita in 18 recitations',
    },
    {
      icon: '🌍',
      title: 'Global Togetherness',
      desc: 'Millions reciting at the same moment',
    },
    {
      icon: '🪷',
      title: 'Divine Grace',
      desc: "Krishna's blessings on every devotee",
    },
  ];

  const howToParticipate = [
    { icon: '⏰', text: 'Join at the designated time — Ek Minute together' },
    { icon: '📖', text: 'Open your Bhagavad Gita or use the GIEO GITA app' },
    { icon: '🗣️', text: 'Recite the assigned adhyay verse for that day' },
    { icon: '🙏', text: 'Offer your paath with full devotion and focus' },
    { icon: '📲', text: 'Submit your paath count through this screen' },
    { icon: '🌐', text: 'Share the campaign — invite family & friends' },
  ];

  return (
    <View style={pmStyles.wrapper}>
      {/* ── HERO BANNER ── */}
      <View style={pmStyles.heroBanner}>
        <View style={pmStyles.decCircle1} />
        <View style={pmStyles.decCircle2} />

        <View style={pmStyles.sacredTag}>
          <Text style={pmStyles.sacredTagText}>✦ GIEO GITA CAMPAIGN ✦</Text>
        </View>

        <Animated.Text
          style={[
            pmStyles.deityEmoji,
            { transform: [{ translateY: floatAnim }] },
          ]}>
          📖
        </Animated.Text>

        <Animated.Text
          style={[pmStyles.heroTitle, { opacity: shimmerOpacity }]}>
          {'एक मिन\n'}
          <Text style={pmStyles.heroTitleAccent}>एक साथ</Text>
        </Animated.Text>

        <Text style={pmStyles.heroSubtitle}>Ek Min Ek Saath Gita Paath</Text>

        <Text style={pmStyles.heroDesc}>
          A divine movement — millions reciting the Bhagavad Gita together, one
          minute at a time, united in devotion across the globe.
        </Text>

        <View style={pmStyles.datePill}>
          <FontAwesome name="users" size={11} color={COLORS.warmBrown} />
          <Text style={pmStyles.datePillText}>
            18 Adhyays • Daily Recitation Campaign
          </Text>
        </View>
      </View>

      {/* ── ABOUT THE CAMPAIGN ── */}
      <View style={pmStyles.significanceBox}>
        <Text style={pmStyles.pmSectionLabel}>✦ ABOUT THE CAMPAIGN</Text>
        <Text style={pmStyles.significanceTitle}>
          One Minute,{' '}
          <Text style={pmStyles.significanceTitleAccent}>
            One World, One Gita
          </Text>
        </Text>
        <Text style={pmStyles.significanceDesc}>
          &quot;Ek Min Ek Saath Gita Paath&quot; is a global initiative by GIEO Gita where
          millions of devotees pause together for one minute every day to recite
          a verse from the Bhagavad Gita — creating a powerful wave of
          collective consciousness and divine energy.
        </Text>
        <View style={pmStyles.shlokaBox}>
          <Text style={pmStyles.shlokaDevanagari}>
            {
              '"सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥"'
            }
          </Text>
          <Text style={pmStyles.shlokaTranslation}>
            Abandon all duties and take refuge in Me alone. I shall liberate you
            from all sins; do not grieve. — BG 18.66
          </Text>
        </View>
      </View>

      {/* ── 18 ADHYAYS SCROLL ── */}
      <View style={pmStyles.benefitsSection}>
        <Text style={pmStyles.pmSectionLabel}>✦ 18 ADHYAYS — GITA PAATH</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingVertical: 8 }}>
          {ADHYAYS.map(a => (
            <TouchableOpacity
              key={a.num}
              style={adhyayStyles.card}
              activeOpacity={0.82}>
              <View style={adhyayStyles.numBadge}>
                <Text style={adhyayStyles.numText}>{a.num}</Text>
              </View>
              <Text style={adhyayStyles.icon}>{a.icon}</Text>
              <Text style={adhyayStyles.name} numberOfLines={2}>
                {a.name}
              </Text>
              <Text style={adhyayStyles.verses}>{a.verses} verses</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── HOW TO PARTICIPATE ── */}
      <View style={pmStyles.observanceBox}>
        <Text style={pmStyles.pmSectionLabel}>✦ HOW TO PARTICIPATE</Text>
        {howToParticipate.map((item, i) => (
          <View key={i} style={pmStyles.observanceRow}>
            <View style={pmStyles.observanceIconBox}>
              <Text style={pmStyles.observanceIcon}>{item.icon}</Text>
            </View>
            <Text style={pmStyles.observanceText}>{item.text}</Text>
          </View>
        ))}
      </View>

      {/* ── CAMPAIGN BENEFITS GRID ── */}
      <View style={[pmStyles.benefitsSection, { marginTop: 0 }]}>
        <Text style={pmStyles.pmSectionLabel}>✦ BENEFITS OF DAILY PAATH</Text>
        <View style={pmStyles.benefitsGrid}>
          {benefits.map(b => (
            <View key={b.title} style={pmStyles.benefitCard}>
              <Text style={pmStyles.benefitIcon}>{b.icon}</Text>
              <Text style={pmStyles.benefitTitle}>{b.title}</Text>
              <Text style={pmStyles.benefitDesc}>{b.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── CTA ── */}
      <TouchableOpacity style={pmStyles.ctaBtn} activeOpacity={0.85}>
        <Text style={pmStyles.ctaBtnText}>📖 Join Ek Min Ek Saath Today</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PAATH DETAIL SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function PaathDetailScreen({ setShowPaath, stats, onSubmit }) {
  const headerScrollProps = useHeaderScrollProps();

  return (
    <ScrollView style={cdStyles.container} showsVerticalScrollIndicator={false} {...headerScrollProps}>
      <View style={cdStyles.header}>
        <TouchableOpacity
          style={cdStyles.backBtn}
          onPress={() => setShowPaath(false)}>
          <FontAwesome name="chevron-left" size={14} color={COLORS.saffron} />
        </TouchableOpacity>
        <Text style={cdStyles.headerTitle}>Gita Paath</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={{ height: 16 }} />
      <TotalPaath />

      <GoldDivider />
      <PaathCounter todayPaath={stats.todayChants} onSubmit={onSubmit} />
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MAIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export default function EkMinEkSaathScreen() {
  const [showPaath, setShowPaath] = useState(false);
  const { alert, success, error, warning, loading, hide } = useAppAlert();
  const headerScrollProps = useHeaderScrollProps();

  const [stats, setStats] = useState({
    totalChants: 8556,
    monthProgress: 50,
    weekProgress: 20,
    todayChants: 0,
  });

  const handleSubmit = count => {
    setStats(prev => ({
      totalChants: prev.totalChants + count,
      monthProgress: prev.monthProgress + count,
      weekProgress: prev.weekProgress + count,
      todayChants: prev.todayChants + count,
    }));
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  if (showPaath) {
    return (
      <PaathDetailScreen
        setShowPaath={setShowPaath}
        stats={stats}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <ScrollView
      style={mainStyles.container}
      showsVerticalScrollIndicator={false}
      {...headerScrollProps}>
      {/* ── CAMPAIGN BANNER CARD ── */}
      <View style={mainStyles.quoteCard}>
        <View style={mainStyles.quoteCardInner}>
          <Image
            source={require('@/assets/images/ek.png')}
            style={mainStyles.quoteImage}
          />
          <View style={mainStyles.quoteOverlay} />
          <View style={mainStyles.quoteBody}>
            <Text style={mainStyles.quoteTopLabel}>
              ✦ EK MIN EK SAATH GITA PAATH ✦
            </Text>
            {/* <Text style={mainStyles.quoteIconText}>❝</Text> */}
            <Text style={mainStyles.quoteText}>
              Let us all recite the Bhagavad Gita together — one minute, one
              world, one Krishna. Join millions in this divine movement of
              collective consciousness.
            </Text>
          </View>
        </View>
      </View>

      {/* ── GLOBAL PAATH COUNT ── */}
      <TotalPaath />

      <YourChants />

      {/* ── PAATH COUNTER ── */}
      <PaathCounter todayPaath={stats.todayChants} onSubmit={handleSubmit} />

      {/* ── LIVE SESSION ── */}
      <View style={mainStyles.liveSection}>
        <View style={mainStyles.liveTitleRow}>
          <View style={mainStyles.liveBadge}>
            <Animated.View
              style={[mainStyles.liveDot, { opacity: pulseAnim }]}
            />
            <Text style={mainStyles.liveBadgeText}>LIVE</Text>
          </View>
          <Text style={mainStyles.liveTitle}>Live Paath Session</Text>
        </View>
        <TouchableOpacity style={mainStyles.liveCard} activeOpacity={0.88}>
          <Image
            source={require('@/assets/images/ek.png')}
            style={mainStyles.liveImage}
          />
          <View style={mainStyles.livePlayOverlay}>
            <View style={mainStyles.livePlayBtn}>
              <FontAwesome name="play" size={18} color={COLORS.gold} />
            </View>
          </View>
          <View style={mainStyles.liveCardBody}>
            <Text style={mainStyles.liveDesc} numberOfLines={2}>
              Adhyay 12 — Bhakti Yoga | Ek Min Ek Saath Live Gita Paath with
              Guruji
            </Text>
            <View style={mainStyles.liveMetaRow}>
              <View style={mainStyles.liveTag}>
                <Text style={mainStyles.liveTagText}>GITA PAATH</Text>
              </View>
              <Text style={mainStyles.liveWatching}>👁 12.8k reciting</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <GoldDivider />

      {/* ── EK MIN EK SAATH SECTION ── */}
      <EkMinSection />

      <GoldDivider />

      {/* ── GO TO PAATH DETAIL ── */}
      <View style={mainStyles.chantsSection}>
        <Text style={mainStyles.chantsSectionTitle}>
          Gita <Text style={mainStyles.chantsSectionAccent}>Paath</Text>
        </Text>
        <Text style={mainStyles.chantsSectionDesc}>
          Record your daily Gita recitation and be a part of this divine global
          movement.
        </Text>
        <TouchableOpacity
          style={mainStyles.chantsBtn}
          onPress={() => setShowPaath(true)}
          activeOpacity={0.85}>
          <Text style={mainStyles.chantsBtnText}>📖 Go to Paath</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 28 }} />
    </ScrollView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADHYAY CARD STYLES
// ─────────────────────────────────────────────────────────────────────────────
const adhyayStyles = StyleSheet.create({
  card: {
    width: 110,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: hairline,
    ...shadow.card,
    shadowOpacity: 0.045,
    elevation: 2
  },
  numBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  numText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.deepBrown
  },
  icon: {
    fontSize: 22,
    marginBottom: 6
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.deepBrown,
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 18
  },
  verses: {
    fontSize: 12,
    color: COLORS.warmBrown
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SHARED STYLES
// ─────────────────────────────────────────────────────────────────────────────
const sharedStyles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: hairline,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.lg
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 14
  },
  sectionLabelLine: {
    flex: 1,
    height: 1,
    backgroundColor: hairline
  },
  sectionLabelText: {
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "600",
    color: COLORS.goldDark,
    marginHorizontal: 10
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// EK MIN EK SAATH SECTION STYLES
// ─────────────────────────────────────────────────────────────────────────────
const pmStyles = StyleSheet.create({
  wrapper: {
    marginBottom: 4
  },
  heroBanner: {
    backgroundColor: COLORS.cream,
    marginHorizontal: 16,
    borderRadius: radii.lg,
    padding: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: hairline,
    alignItems: 'center',
    marginBottom: 14,
    position: 'relative',
    ...shadow.card
  },
  decCircle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: `rgba(${RGB.saffron},0.08)`,
    top: -60,
    right: -60
  },
  decCircle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `rgba(${RGB.gold},0.08)`,
    bottom: -40,
    left: -30
  },
  sacredTag: {
    backgroundColor: COLORS.creamDark,
    borderWidth: 1,
    borderColor: hairline,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 14
  },
  sacredTagText: {
    fontSize: 10,
    color: COLORS.warmBrown,
    letterSpacing: 2,
    fontWeight: "600"
  },
  deityEmoji: {
    fontSize: 56,
    marginBottom: 10
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: "400",
    color: COLORS.deepBrown,
    textAlign: 'center',
    lineHeight: 45,
    letterSpacing: -0.4,
    fontFamily: DESIGN.fonts.editorial
  },
  heroTitleAccent: {
    color: COLORS.saffron,
    fontSize: 34,
    fontWeight: "600"
  },
  heroSubtitle: {
    ...type.subhead,
    color: COLORS.warmBrown,
    letterSpacing: 1.5,
    marginTop: 4,
    marginBottom: 10,
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  heroDesc: {
    ...type.body,
    color: COLORS.warmBrown,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 14
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.creamDark,
    borderWidth: 1,
    borderColor: hairline,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 6
  },
  datePillText: {
    fontSize: 11,
    color: COLORS.warmBrown,
    fontWeight: '600'
  },
  significanceBox: {
    backgroundColor: COLORS.cream,
    marginHorizontal: 16,
    borderRadius: radii.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: hairline,
    marginBottom: 14,
    ...shadow.card
  },
  pmSectionLabel: {
    fontSize: 12,
    letterSpacing: 2,
    color: COLORS.saffron,
    fontWeight: "600",
    marginBottom: 6
  },
  significanceTitle: {
    ...type.title,
    color: COLORS.deepBrown,
    marginBottom: 10
  },
  significanceTitleAccent: {
    color: COLORS.saffron
  },
  significanceDesc: {
    ...type.body,
    color: COLORS.warmBrown,
    marginBottom: 14
  },
  shlokaBox: {
    backgroundColor: COLORS.creamDark,
    borderRadius: radii.md,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.saffron
  },
  shlokaDevanagari: {
    fontSize: 12,
    color: COLORS.richBrown,
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 8
  },
  shlokaTranslation: {
    fontSize: 12,
    color: COLORS.warmBrown,
    lineHeight: 18
  },
  benefitsSection: {
    paddingHorizontal: 16,
    marginBottom: 14
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8
  },
  benefitCard: {
    width: (width - 52) / 2,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: hairline,
    alignItems: 'center',
    ...shadow.card,
    shadowOpacity: 0.045,
    elevation: 2
  },
  benefitIcon: {
    fontSize: 28,
    marginBottom: 8
  },
  benefitTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.deepBrown,
    textAlign: 'center',
    marginBottom: 4
  },
  benefitDesc: {
    fontSize: 12,
    color: COLORS.warmBrown,
    textAlign: 'center',
    lineHeight: 18
  },
  observanceBox: {
    backgroundColor: COLORS.cream,
    marginHorizontal: 16,
    borderRadius: radii.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: hairline,
    marginBottom: 14,
    ...shadow.card
  },
  observanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10
  },
  observanceIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  observanceIcon: {
    fontSize: 16
  },
  observanceText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.warmBrown,
    lineHeight: 20
  },
  ctaBtn: {
    backgroundColor: COLORS.saffron,
    marginHorizontal: 16,
    borderRadius: radii.pill,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 6
  },
  ctaBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PAATH DETAIL STYLES
// ─────────────────────────────────────────────────────────────────────────────
const cdStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream
  },
  header: {
    backgroundColor: COLORS.cream,
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: hairline
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.creamDark,
    borderWidth: 1,
    borderColor: hairline,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    color: COLORS.deepBrown,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCREEN STYLES
// ─────────────────────────────────────────────────────────────────────────────
const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream
  },
  header: {
    backgroundColor: COLORS.cream,
    paddingTop: 20,
    paddingBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  greetingSmall: {
    fontSize: 12,
    color: COLORS.goldDark,
    letterSpacing: 0.5,
    marginBottom: 2
  },
  greeting: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.deepBrown,
    letterSpacing: 0.5
  },
  notifBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.creamDark,
    borderWidth: 1,
    borderColor: hairline,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.saffron,
    borderWidth: 1,
    borderColor: COLORS.cream
  },
  quoteCard: {
    margin: 0
  },
  quoteCardInner: {
    backgroundColor: COLORS.cream,
    borderEndEndRadius: 70,
    overflow: 'hidden'
  },
  quoteTopStrip: {
    backgroundColor: COLORS.creamDark,
    paddingVertical: 7,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: hairline
  },
  quoteTopLabel: {
    fontSize: 15,
    color: COLORS.saffron,
    letterSpacing: 2,
    fontWeight: '700'
  },
  quoteImage: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.creamDark
  },
  quoteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: 'transparent'
  },
  quoteBody: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16
  },
  quoteIconText: {
    fontSize: 32,
    color: COLORS.gold,
    lineHeight: 36,
    marginBottom: 4
  },
  quoteText: {
    ...type.body,
    color: COLORS.warmBrown,
    marginBottom: 16
  },
  startDayBtn: {
    backgroundColor: COLORS.richBrown,
    paddingVertical: 11,
    paddingHorizontal: 24,
    borderRadius: radii.pill,
    alignSelf: 'flex-start'
  },
  startDayBtnText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 13,
    letterSpacing: 0.3
  },
  liveSection: {
    paddingHorizontal: 16,
    marginBottom: 4
  },
  liveTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(214,72,58,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(214,72,58,0.35)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.liveRed
  },
  liveBadgeText: {
    fontSize: 10,
    color: COLORS.liveRed,
    fontWeight: "600",
    letterSpacing: 1
  },
  liveTitle: {
    ...type.headline,
    color: COLORS.deepBrown,
    letterSpacing: 0.3
  },
  liveCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: hairline,
    ...shadow.card,
    shadowOpacity: 0.045,
    elevation: 2
  },
  liveImage: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.creamDark
  },
  livePlayOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `rgba(${RGB.deepBrown},0.35)`
  },
  livePlayBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: `rgba(${RGB.gold},0.2)`,
    borderWidth: 2,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center'
  },
  liveCardBody: {
    padding: 14
  },
  liveDesc: {
    ...type.body,
    color: COLORS.warmBrown,
    marginBottom: 10
  },
  liveMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  liveTag: {
    backgroundColor: `rgba(${RGB.saffron},0.15)`,
    borderWidth: 1,
    borderColor: `rgba(${RGB.saffron},0.35)`,
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 3
  },
  liveTagText: {
    fontSize: 10,
    color: COLORS.saffron,
    fontWeight: "600",
    letterSpacing: 0.5
  },
  liveWatching: {
    fontSize: 12,
    color: COLORS.warmBrown
  },
  chantsSection: {
    backgroundColor: COLORS.cream,
    marginHorizontal: 16,
    borderRadius: radii.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: hairline,
    alignItems: 'center',
    ...shadow.card
  },
  chantsSectionTitle: {
    ...type.title,
    color: COLORS.deepBrown,
    marginBottom: 6
  },
  chantsSectionAccent: {
    color: COLORS.saffron
  },
  chantsSectionDesc: {
    fontSize: 12,
    color: COLORS.warmBrown,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    maxWidth: 260
  },
  chantsBtn: {
    backgroundColor: COLORS.richBrown,
    paddingVertical: 13,
    paddingHorizontal: 32,
    borderRadius: radii.pill
  },
  chantsBtnText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
    letterSpacing: 0.3
  }
});

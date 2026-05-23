import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
const COLORS = {
  deepBrown: '#2C1A0A',
  warmBrown: '#4A2C0D',
  richBrown: '#3D2010',
  gold: '#C9A227',
  goldLight: '#E8C55A',
  goldDark: '#8B6914',
  cream: '#FDF6E3',
  creamDark: '#F5E6C8',
  saffron: '#E8721C',
  saffronLight: '#F4A44A',
  textDark: '#1A0E00',
  white: '#FFFFFF',
  liveRed: '#E53935',
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const exclusiveContent = [
  { id: '1', icon: '🕉️', title: 'Geometry of Life', meta: 'Sadhguru Series', badge: 'NEW' },
  { id: '2', icon: '📿', title: 'Intimate Moments with Guruji', meta: 'Deep Satsang', badge: null },
  { id: '3', icon: '🪔', title: 'Path of Devotion', meta: 'Bhakti Series', badge: null },
  { id: '4', icon: '📖', title: 'Karma Yoga Insights', meta: 'Knowledge Series', badge: null },
];

const adhyayList = [
  { id: '1', num: 'ADHYAY 1', name: 'Arjuna Vishada', icon: '🌸' },
  { id: '2', num: 'ADHYAY 2', name: 'Sankhya Yoga', icon: '✨' },
  { id: '3', num: 'ADHYAY 3', name: 'Karma Yoga', icon: '🌿' },
  { id: '4', num: 'ADHYAY 4', name: 'Jnana Yoga', icon: '🪷' },
  { id: '5', num: 'ADHYAY 5', name: 'Karma Sanyasa', icon: '🌺' },
  { id: '6', num: 'ADHYAY 6', name: 'Dhyana Yoga', icon: '🧘' },
];

const upcomingEvents = [
  {
    id: '1',
    day: '08',
    month: 'APR',
    title: 'Gita Satsang — Kurukshetra',
    location: 'Kurukshetra, Haryana',
    time: 'Full Day Program',
    tag: 'SATSANG',
  },
  {
    id: '2',
    day: '13',
    month: 'APR',
    title: 'Gita Satsang — Haridwar',
    location: 'Haridwar, Uttarakhand',
    time: '13 April 2026',
    tag: 'DIVINE EVENT',
  },
  {
    id: '3',
    day: '17',
    month: 'APR',
    title: 'Gita Satsang — Panipat',
    location: 'Devi Mandir, Panipat',
    time: '17–19 April 2026',
    tag: 'SATSANG',
  },
];

const sevaList = [
  'Shringaar Seva', 'Aarti Seva', 'Anna Seva',
  'Gaushala Seva', 'Vidya Seva', 'Jal Seva',
  'Gau-Poojan Seva', 'Gau-Grass Seva', 'Chikitsa Seva',
];

const aboutInitiatives = [
  { icon: '📚', title: 'Bal Sanskar', desc: 'Vedic teachings for children' },
  { icon: '🐄', title: 'GIEO Gaushala', desc: 'Cow seva & protection' },
  { icon: '🌏', title: 'Join GIEO Gita', desc: 'Spread Gita wisdom globally' },
];

const navTabs = [
  { icon: 'home', label: 'Home', active: true },
  { icon: 'book', label: 'Gita', active: false },
  { icon: 'calendar', label: 'Events', active: false },
  { icon: 'heart', label: 'Seva', active: false },
  { icon: 'user', label: 'Profile', active: false },
];

// ─── SUB COMPONENTS ───────────────────────────────────────────────────────────

function GoldDivider() {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <View style={styles.dividerDiamond} />
      <View style={styles.dividerLine} />
    </View>
  );
}

function SectionHeader({ title, accent, onSeeAll, seeAllLabel = 'See all »' }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        {title}{' '}
        {accent ? <Text style={styles.sectionAccent}>{accent}</Text> : null}
      </Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAll}>{seeAllLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function ExclusiveCard({ item }) {
  return (
    <TouchableOpacity style={styles.excCard} activeOpacity={0.85}>
      <View style={styles.excCardImg}>
        <Text style={styles.excCardIcon}>{item.icon}</Text>
        {item.badge && (
          <View style={styles.excBadge}>
            <Text style={styles.excBadgeText}>{item.badge}</Text>
          </View>
        )}
        <View style={styles.excImgOverlay} />
      </View>
      <View style={styles.excCardBody}>
        <Text style={styles.excCardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.excCardMeta}>{item.meta}</Text>
      </View>
    </TouchableOpacity>
  );
}

function AdhyayCard({ item }) {
  return (
    <TouchableOpacity style={styles.adhyayCard} activeOpacity={0.85}>
      <View style={styles.adhyayImg}>
        <Text style={styles.adhyayIcon}>{item.icon}</Text>
      </View>
      <View style={styles.adhyayBody}>
        <Text style={styles.adhyayNum}>{item.num}</Text>
        <Text style={styles.adhyayName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

function EventCard({ item }) {
  return (
    <TouchableOpacity style={styles.eventCard} activeOpacity={0.85}>
      <View style={styles.eventCardTop}>
        <View style={styles.eventDateBox}>
          <Text style={styles.eventDateDay}>{item.day}</Text>
          <Text style={styles.eventDateMonth}>{item.month}</Text>
        </View>
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.eventLoc}>📍 {item.location}</Text>
          <Text style={styles.eventTime}>⏰ {item.time}</Text>
        </View>
      </View>
      <View style={styles.eventFooter}>
        <View style={styles.eventTagBadge}>
          <Text style={styles.eventTagText}>{item.tag}</Text>
        </View>
        <Text style={styles.eventCta}>Register Now »</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function GieoGitaHome() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.2, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.deepBrown} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} bounces>

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.logoArea}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoCircleIcon}>🪷</Text>
              </View>
              <View>
                <Text style={styles.logoMain}>GIEO GITA</Text>
                <Text style={styles.logoSub}>॥ कृष्ण कृपा ॥</Text>
              </View>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconBtn}>
                <FontAwesome name="bell" size={15} color={COLORS.goldLight} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <FontAwesome name="search" size={15} color={COLORS.goldLight} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.greetingStrip}>
            <Text style={styles.greetingText}>
              🕉️  श्री कृष्ण शरणम् ममः — Spread the wisdom of Gita
            </Text>
          </View>
        </View>

        {/* ── HERO BANNER ────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.heroBanner,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.peacockBg}>🪶</Text>
          <View style={styles.heroTag}>
            <Text style={styles.heroTagText}>✦ DIVINE WISDOM</Text>
          </View>
          <Text style={styles.heroTitle}>
            Elevating Lives{'\n'}Through{' '}
            <Text style={styles.heroTitleAccent}>Gita Wisdom</Text>
          </Text>
          <Text style={styles.heroDesc}>
            Spreading the timeless teachings of Bhagavad Gita across the globe.
          </Text>
          <TouchableOpacity style={styles.heroBtn} activeOpacity={0.85}>
            <Text style={styles.heroBtnText}>Begin Journey  ›</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── EXCLUSIVE CONTENT ──────────────────────────────────── */}
        <SectionHeader title="✦ Exclusive" accent="Content" onSeeAll={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScrollContent}
        >
          {exclusiveContent.map((item) => (
            <ExclusiveCard key={item.id} item={item} />
          ))}
        </ScrollView>

        <GoldDivider />

        {/* ── LIVE DARSHAN ───────────────────────────────────────── */}
        <SectionHeader title="🔴 Live" accent="Darshan" />
        <TouchableOpacity style={styles.liveBanner} activeOpacity={0.88}>
          <View style={styles.livePlay}>
            <FontAwesome name="play" size={18} color={COLORS.gold} />
          </View>
          <View style={styles.liveTextCol}>
            <View style={styles.liveNowRow}>
              <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
              <Text style={styles.liveNowLabel}>LIVE NOW</Text>
            </View>
            <Text style={styles.liveTitle}>Gita Gyan Sansthanam</Text>
            <Text style={styles.liveSubtitle}>Kurukshetra Mandir  •  Live Aarti</Text>
          </View>
          <FontAwesome name="chevron-right" size={14} color={COLORS.goldDark} />
        </TouchableOpacity>

        <GoldDivider />

        {/* ── BHAGAVAD GITA ADHYAY ───────────────────────────────── */}
        <SectionHeader
          title="📖 Bhagavad Gita"
          accent="Adhyay"
          onSeeAll={() => {}}
          seeAllLabel="18 Chapters »"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScrollContent}
        >
          {adhyayList.map((item) => (
            <AdhyayCard key={item.id} item={item} />
          ))}
        </ScrollView>

        <GoldDivider />

        {/* ── UPCOMING EVENTS ────────────────────────────────────── */}
        <SectionHeader
          title="📅 Upcoming"
          accent="Events"
          onSeeAll={() => {}}
          seeAllLabel="View all »"
        />
        <View style={styles.eventsContainer}>
          {upcomingEvents.map((item) => (
            <EventCard key={item.id} item={item} />
          ))}
        </View>

        <GoldDivider />

        {/* ── SEVA SECTION ───────────────────────────────────────── */}
        <SectionHeader title="🙏 Choose Your" accent="Seva" />
        <View style={styles.sevaBg}>
          <Text style={styles.sevaOverlayText}>॥</Text>
          <Text style={styles.sevaLabel}>SUPPORT OUR MISSION</Text>
          <Text style={styles.sevaTitle}>
            Be Part Of{' '}
            <Text style={styles.sevaTitleAccent}>Gita Seva</Text>
          </Text>
          <View style={styles.sevaChips}>
            {sevaList.map((seva) => (
              <TouchableOpacity key={seva} style={styles.sevaChip} activeOpacity={0.75}>
                <Text style={styles.sevaChipText}>{seva}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <GoldDivider />

        {/* ── ABOUT / INITIATIVES ────────────────────────────────── */}
        <SectionHeader title="🌿 Our" accent="Initiatives" />
        <View style={styles.aboutSection}>
          <Text style={styles.aboutHeading}>
            Serving With{' '}
            <Text style={styles.aboutHeadingAccent}>Spiritual Purpose</Text>
            {'\n'}And Social Responsibility
          </Text>
          <Text style={styles.aboutDesc}>
            GIEO Gita is a spiritual mission dedicated to spreading the timeless wisdom of
            the Bhagwad Gita. Our aim is to cultivate values, inspire transformation, and
            serve society with love, devotion, and selfless service.
          </Text>
          {aboutInitiatives.map((init) => (
            <TouchableOpacity key={init.title} style={styles.initiativeCard} activeOpacity={0.85}>
              <View style={styles.initiativeIcon}>
                <Text style={styles.initiativeIconText}>{init.icon}</Text>
              </View>
              <View style={styles.initiativeText}>
                <Text style={styles.initiativeTitle}>{init.title}</Text>
                <Text style={styles.initiativeDesc}>{init.desc}</Text>
              </View>
              <FontAwesome name="chevron-right" size={12} color={COLORS.goldDark} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── BOTTOM NAVIGATION ──────────────────────────────────── */}
     
    </View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  // HEADER
  header: {
    backgroundColor: COLORS.deepBrown,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.warmBrown,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircleIcon: { fontSize: 20 },
  logoMain: {
    color: COLORS.goldLight,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  logoSub: {
    color: COLORS.goldDark,
    fontSize: 10,
    letterSpacing: 1,
    marginTop: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(201,162,39,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingStrip: {
    marginTop: 12,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  greetingText: {
    color: 'rgba(232,197,90,0.9)',
    fontSize: 11,
    fontStyle: 'italic',
  },

  // HERO BANNER
  heroBanner: {
    backgroundColor: COLORS.warmBrown,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  peacockBg: {
    position: 'absolute',
    right: 16,
    top: 10,
    fontSize: 64,
    opacity: 0.18,
    transform: [{ rotate: '-15deg' }],
  },
  heroTag: {
    backgroundColor: 'rgba(232,114,28,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(232,114,28,0.5)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  heroTagText: {
    color: COLORS.saffronLight,
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: '700',
  },
  heroTitle: {
    color: COLORS.cream,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
    marginBottom: 8,
  },
  heroTitleAccent: { color: COLORS.goldLight },
  heroDesc: {
    color: 'rgba(253,246,227,0.65)',
    fontSize: 13,
    lineHeight: 19,
    maxWidth: 240,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  heroBtn: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 22,
    alignSelf: 'flex-start',
  },
  heroBtnText: {
    color: COLORS.deepBrown,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // DIVIDER
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.goldDark,
    opacity: 0.35,
  },
  dividerDiamond: {
    width: 7,
    height: 7,
    backgroundColor: COLORS.gold,
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 8,
  },

  // SECTION HEADER
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.deepBrown,
    letterSpacing: 0.3,
  },
  sectionAccent: { color: COLORS.goldDark },
  seeAll: {
    fontSize: 12,
    color: COLORS.saffron,
    fontStyle: 'italic',
  },

  // HORIZONTAL SCROLL
  hScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 6,
    gap: 12,
  },

  // EXCLUSIVE CARDS
  excCard: {
    width: 130,
    backgroundColor: COLORS.deepBrown,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.3)',
  },
  excCardImg: {
    width: '100%',
    height: 92,
    backgroundColor: COLORS.warmBrown,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  excCardIcon: { fontSize: 36, zIndex: 1 },
  excImgOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: 'rgba(44,26,10,0.7)',
  },
  excBadge: {
    position: 'absolute',
    top: 7,
    left: 7,
    backgroundColor: COLORS.saffron,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    zIndex: 2,
  },
  excBadgeText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  excCardBody: { padding: 10 },
  excCardTitle: {
    color: COLORS.cream,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15,
  },
  excCardMeta: {
    color: 'rgba(232,197,90,0.6)',
    fontSize: 9,
    marginTop: 4,
    fontStyle: 'italic',
  },

  // LIVE DARSHAN
  liveBanner: {
    backgroundColor: COLORS.warmBrown,
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.4)',
  },
  livePlay: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(201,162,39,0.15)',
    borderWidth: 2,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveTextCol: { flex: 1 },
  liveNowRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.liveRed,
  },
  liveNowLabel: {
    color: 'rgba(253,246,227,0.6)',
    fontSize: 10,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  liveTitle: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '800',
  },
  liveSubtitle: {
    color: COLORS.goldLight,
    fontSize: 10,
    marginTop: 2,
  },

  // ADHYAY CARDS
  adhyayCard: {
    width: 112,
    backgroundColor: COLORS.creamDark,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.45)',
  },
  adhyayImg: {
    width: '100%',
    height: 76,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adhyayIcon: { fontSize: 30 },
  adhyayBody: { padding: 9 },
  adhyayNum: {
    fontSize: 9,
    color: COLORS.saffron,
    fontWeight: '800',
    letterSpacing: 1,
  },
  adhyayName: {
    fontSize: 11,
    color: COLORS.deepBrown,
    fontWeight: '700',
    lineHeight: 15,
    marginTop: 2,
  },

  // EVENTS
  eventsContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  eventCard: {
    backgroundColor: COLORS.deepBrown,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.3)',
  },
  eventCardTop: {
    backgroundColor: COLORS.richBrown,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  eventDateBox: {
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    alignItems: 'center',
    minWidth: 46,
  },
  eventDateDay: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.deepBrown,
    lineHeight: 22,
  },
  eventDateMonth: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.deepBrown,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  eventInfo: { flex: 1 },
  eventTitle: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 17,
  },
  eventLoc: {
    fontSize: 11,
    color: 'rgba(253,246,227,0.6)',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 11,
    color: COLORS.goldLight,
  },
  eventFooter: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(201,162,39,0.15)',
  },
  eventTagBadge: {
    backgroundColor: 'rgba(232,114,28,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(232,114,28,0.4)',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  eventTagText: {
    color: COLORS.saffronLight,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  eventCta: {
    fontSize: 11,
    color: COLORS.goldLight,
    fontStyle: 'italic',
  },

  // SEVA
  sevaBg: {
    backgroundColor: COLORS.creamDark,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.45)',
    position: 'relative',
    overflow: 'hidden',
  },
  sevaOverlayText: {
    position: 'absolute',
    right: 14,
    top: 6,
    fontSize: 72,
    color: 'rgba(201,162,39,0.1)',
    lineHeight: 80,
  },
  sevaLabel: {
    fontSize: 9,
    letterSpacing: 2,
    color: COLORS.saffron,
    fontWeight: '800',
    marginBottom: 4,
  },
  sevaTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.deepBrown,
    marginBottom: 12,
  },
  sevaTitleAccent: { color: COLORS.goldDark },
  sevaChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sevaChip: {
    backgroundColor: 'rgba(44,26,10,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.5)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  sevaChipText: {
    fontSize: 11,
    color: COLORS.warmBrown,
    fontWeight: '600',
  },

  // ABOUT
  aboutSection: {
    backgroundColor: COLORS.richBrown,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.3)',
  },
  aboutHeading: {
    color: COLORS.cream,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 10,
  },
  aboutHeadingAccent: { color: COLORS.goldLight },
  aboutDesc: {
    color: 'rgba(253,246,227,0.65)',
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 14,
  },
  initiativeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(201,162,39,0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.2)',
  },
  initiativeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(201,162,39,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initiativeIconText: { fontSize: 20 },
  initiativeText: { flex: 1 },
  initiativeTitle: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '700',
  },
  initiativeDesc: {
    color: 'rgba(253,246,227,0.55)',
    fontSize: 10,
    marginTop: 2,
    fontStyle: 'italic',
  },

  // BOTTOM NAV
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.deepBrown,
    borderTopWidth: 1,
    borderTopColor: 'rgba(201,162,39,0.3)',
    paddingTop: 10,
    paddingBottom: 18,
  },
  navItem: {
    alignItems: 'center',
    gap: 3,
    minWidth: 52,
  },
  navIconActive: {
    backgroundColor: 'rgba(201,162,39,0.15)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  navIconInactive: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  navLabel: {
    fontSize: 9,
    color: COLORS.goldDark,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  navLabelActive: { color: COLORS.goldLight },
});
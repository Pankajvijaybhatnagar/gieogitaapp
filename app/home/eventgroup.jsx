import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const COLORS = {
  deepBrown:  '#2C1A0A',
  warmBrown:  '#4A2C0D',
  richBrown:  '#3D2010',
  gold:       '#C9A227',
  goldLight:  '#E8C55A',
  goldDark:   '#8B6914',
  cream:      '#FDF6E3',
  saffron:    '#E8721C',
  saffronLight:'#F4A44A',
  liveRed:    '#E53935',
};

const CATEGORIES = ['All', 'Upcoming', 'Live', 'Satsang', 'Aarti', 'Pravachan', 'Festival'];

const EVENTS = [
  {
    id: '1',
    title: 'Gita Jayanti Mahotsav 2025',
    category: 'Festival',
    status: 'upcoming',
    date: '11 Dec 2025',
    day: 'Thursday',
    time: '6:00 AM – 10:00 PM',
    location: 'Kurukshetra, Haryana',
    desc: 'Grand celebration of the divine birth of the Bhagwad Gita. Pravachans, cultural programs, and mass shloka recitation by thousands of devotees.',
    icon: '🏮',
    speakers: ['Swami Giananand Ji', 'Pujya Maharaj Ji'],
    seats: '10,000+',
    registered: '7,842',
    tags: ['Grand Event', 'Free Entry'],
    highlight: true,
  },
  {
    id: '2',
    title: 'Morning Aarti & Satsang',
    category: 'Aarti',
    status: 'live',
    date: 'Daily',
    day: 'Every Day',
    time: '5:30 AM – 7:00 AM',
    location: 'GIEO Gita Ashram, Vrindavan',
    desc: 'Begin your day with the divine blessings of Maharaj Ji. Live aarti, bhajans, and morning satsang with chanting of Gita shlokas.',
    icon: '🪔',
    speakers: ['Maharaj Ji'],
    seats: 'Open',
    registered: '—',
    tags: ['Daily', 'Free', 'Live'],
    highlight: false,
  },
  {
    id: '3',
    title: 'Bhagwad Gita Pravachan Series',
    category: 'Pravachan',
    status: 'upcoming',
    date: '1 Jan 2026',
    day: 'Thursday',
    time: '7:00 PM – 9:00 PM',
    location: 'Online & Vrindavan Ashram',
    desc: 'A 7-day deep-dive pravachan series on the 18 chapters of the Bhagwad Gita. Open to all seekers of spiritual wisdom.',
    icon: '📖',
    speakers: ['Swami Giananand Ji'],
    seats: '500',
    registered: '312',
    tags: ['7 Days', 'Online + Offline'],
    highlight: false,
  },
  {
    id: '4',
    title: 'Gau Puja & Gaushala Utsav',
    category: 'Festival',
    status: 'upcoming',
    date: '14 Jan 2026',
    day: 'Wednesday',
    time: '8:00 AM – 12:00 PM',
    location: 'GIEO Gaushala, Mathura',
    desc: 'Sacred Gau Puja at the Gaushala on the auspicious occasion of Makar Sankranti. Witness the divine worship of gau mata.',
    icon: '🐄',
    speakers: ['Pujya Maharaj Ji'],
    seats: '2,000',
    registered: '1,104',
    tags: ['Makar Sankranti', 'Free'],
    highlight: false,
  },
  {
    id: '5',
    title: 'Bal Sanskar Annual Day',
    category: 'Festival',
    status: 'upcoming',
    date: '26 Jan 2026',
    day: 'Monday',
    time: '10:00 AM – 4:00 PM',
    location: 'GIEO Gita Campus, Kurukshetra',
    desc: 'Annual celebration of the Bal Sanskar program. Children present Vedic performances, shloka recitations, and cultural events.',
    icon: '📚',
    speakers: ['Maharaj Ji', 'Acharyas'],
    seats: '1,000',
    registered: '784',
    tags: ['Children', 'Cultural'],
    highlight: false,
  },
  {
    id: '6',
    title: 'Holi Milan Satsang',
    category: 'Satsang',
    status: 'upcoming',
    date: '14 Mar 2026',
    day: 'Saturday',
    time: '9:00 AM – 1:00 PM',
    location: 'Vrindavan Ashram',
    desc: 'Celebrate Holi with bhajans, kirtan, and divine satsang in the company of Maharaj Ji and fellow devotees.',
    icon: '🎨',
    speakers: ['Maharaj Ji'],
    seats: '3,000',
    registered: '1,891',
    tags: ['Holi', 'Bhajan', 'Satsang'],
    highlight: false,
  },
  {
    id: '7',
    title: 'Gita Gyan Shivir — 5 Day Camp',
    category: 'Pravachan',
    status: 'upcoming',
    date: '1 Feb 2026',
    day: 'Sunday',
    time: '6:00 AM – 8:00 PM',
    location: 'GIEO Gita Ashram, Haridwar',
    desc: 'Residential 5-day spiritual retreat with daily Gita classes, yoga, meditation, seva, and satsang with Maharaj Ji.',
    icon: '🏕️',
    speakers: ['Swami Giananand Ji', 'Senior Acharyas'],
    seats: '200',
    registered: '167',
    tags: ['Residential', '5 Days', 'Limited Seats'],
    highlight: true,
  },
];

const PAST_EVENTS = [
  { id: 'p1', title: 'Gita Jayanti 2024', date: 'Dec 2024', location: 'Kurukshetra', icon: '🏮', attendees: '12,000+' },
  { id: 'p2', title: 'Navratri Satsang 2024', date: 'Oct 2024', location: 'Vrindavan', icon: '🪔', attendees: '5,400+' },
  { id: 'p3', title: 'Guru Purnima Mahotsav', date: 'Jul 2024', location: 'Haridwar', icon: '🙏', attendees: '8,200+' },
];

// ── Status pill ───────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  if (status === 'live') {
    return (
      <View style={styles.livePill}>
        <View style={styles.liveDot} />
        <Text style={styles.livePillText}>LIVE NOW</Text>
      </View>
    );
  }
  return (
    <View style={styles.upcomingPill}>
      <Text style={styles.upcomingPillText}>UPCOMING</Text>
    </View>
  );
}

// ── Event Card ────────────────────────────────────────────────────────────────
function EventCard({ item, onRegister }) {
  const [expanded, setExpanded] = useState(false);
  const pct = item.seats === 'Open' ? 0
    : Math.round((parseInt(item.registered?.replace(/,/g,'') || 0) /
        parseInt(item.seats.replace(/,/g,'') || 1)) * 100);

  return (
    <View style={[styles.eventCard, item.highlight && styles.eventCardHighlight]}>
      {item.highlight && (
        <View style={styles.featuredBanner}>
          <MaterialCommunityIcons name="star-four-points" size={10} color={COLORS.deepBrown} />
          <Text style={styles.featuredBannerText}>FEATURED EVENT</Text>
        </View>
      )}

      {/* Top row */}
      <View style={styles.eventTop}>
        <View style={styles.eventIconBox}>
          <Text style={styles.eventIconText}>{item.icon}</Text>
        </View>
        <View style={styles.eventTopMid}>
          <StatusPill status={item.status} />
          <Text style={styles.eventCategory}>{item.category}</Text>
        </View>
        <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.expandBtn}>
          <MaterialCommunityIcons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18} color={COLORS.goldDark}
          />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.eventTitle}>{item.title}</Text>

      {/* Date / time / location row */}
      <View style={styles.eventMetaGrid}>
        <View style={styles.eventMetaItem}>
          <MaterialCommunityIcons name="calendar-outline" size={13} color={COLORS.goldLight} />
          <Text style={styles.eventMetaText}>{item.date}</Text>
        </View>
        <View style={styles.eventMetaItem}>
          <MaterialCommunityIcons name="clock-outline" size={13} color={COLORS.goldLight} />
          <Text style={styles.eventMetaText}>{item.time}</Text>
        </View>
        <View style={[styles.eventMetaItem, { flex: 1 }]}>
          <MaterialCommunityIcons name="map-marker-outline" size={13} color={COLORS.goldLight} />
          <Text style={styles.eventMetaText} numberOfLines={1}>{item.location}</Text>
        </View>
      </View>

      {/* Tags */}
      <View style={styles.tagsRow}>
        {item.tags.map((t) => (
          <View key={t} style={styles.tag}>
            <Text style={styles.tagText}>{t}</Text>
          </View>
        ))}
      </View>

      {/* Expanded section */}
      {expanded && (
        <View style={styles.expandedSection}>
          <View style={styles.expandDivider} />

          <Text style={styles.eventDesc}>{item.desc}</Text>

          {/* Speakers */}
          <View style={styles.speakersRow}>
            <MaterialCommunityIcons name="microphone-variant" size={13} color={COLORS.goldLight} />
            <Text style={styles.speakersLabel}>Speakers: </Text>
            <Text style={styles.speakersNames}>{item.speakers.join(' • ')}</Text>
          </View>

          {/* Seats progress */}
          {item.seats !== 'Open' && (
            <View style={styles.seatsBox}>
              <View style={styles.seatsTopRow}>
                <Text style={styles.seatsLabel}>Seats Registered</Text>
                <Text style={styles.seatsCount}>{item.registered} / {item.seats}</Text>
              </View>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${Math.min(pct, 100)}%` }]} />
              </View>
              <Text style={styles.seatsHint}>
                {pct >= 90 ? '🔥 Almost full!' : pct >= 70 ? '⚡ Filling fast' : '✅ Seats available'}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Footer */}
      <View style={styles.eventFooter}>
        <TouchableOpacity
          style={[styles.registerBtn, item.status === 'live' && styles.registerBtnLive]}
          activeOpacity={0.85}
          onPress={() => onRegister(item)}
        >
          <FontAwesome
            name={item.status === 'live' ? 'play-circle' : 'calendar-check-o'}
            size={13}
            color={item.status === 'live' ? '#fff' : COLORS.deepBrown}
          />
          <Text style={[styles.registerBtnText, item.status === 'live' && { color: '#fff' }]}>
            {item.status === 'live' ? 'Join Live Now' : 'Register Free'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareBtn} activeOpacity={0.8}>
          <MaterialCommunityIcons name="share-variant-outline" size={16} color={COLORS.goldDark} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Registration Modal ────────────────────────────────────────────────────────
function RegisterModal({ event, onClose }) {
  if (!event) return null;
  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalSheet}>
        <View style={styles.modalHandle} />
        <View style={styles.modalHeader}>
          <Text style={styles.modalIcon}>{event.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.modalTitle} numberOfLines={2}>{event.title}</Text>
            <Text style={styles.modalDate}>{event.date} • {event.location}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
            <MaterialCommunityIcons name="close" size={18} color={COLORS.goldDark} />
          </TouchableOpacity>
        </View>

        <View style={styles.modalSuccessBox}>
          <MaterialCommunityIcons name="check-circle" size={40} color="#4CAF50" />
          <Text style={styles.modalSuccessTitle}>Registration Confirmed!</Text>
          <Text style={styles.modalSuccessDesc}>
            You have successfully registered for this event. We will send you a reminder
            before the event begins. 🙏
          </Text>
        </View>

        <View style={styles.modalInfoRow}>
          <MaterialCommunityIcons name="calendar-check" size={14} color={COLORS.goldLight} />
          <Text style={styles.modalInfoText}>
            {event.date} at {event.time.split('–')[0].trim()}
          </Text>
        </View>
        <View style={styles.modalInfoRow}>
          <MaterialCommunityIcons name="map-marker" size={14} color={COLORS.goldLight} />
          <Text style={styles.modalInfoText}>{event.location}</Text>
        </View>

        <TouchableOpacity style={styles.modalDoneBtn} onPress={onClose} activeOpacity={0.85}>
          <Text style={styles.modalDoneBtnText}>Done • Jai Shri Krishna 🙏</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── MAIN SCREEN ───────────────────────────────────────────────────────────────
export default function EventGroupScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedEvent,  setSelectedEvent]  = useState(null);
  const scrollRef = useRef(null);

  const filtered = activeCategory === 'All'
    ? EVENTS
    : EVENTS.filter((e) =>
        e.category === activeCategory || e.status === activeCategory.toLowerCase()
      );

  const liveEvents     = EVENTS.filter((e) => e.status === 'live');
  const upcomingEvents = EVENTS.filter((e) => e.status === 'upcoming');

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <MaterialCommunityIcons name="calendar-star" size={12} color={COLORS.goldLight} />
            <Text style={styles.heroBadgeText}>Events & Satsangs</Text>
          </View>
          <Text style={styles.heroHeading}>
            Divine{' '}
            <Text style={styles.heroAccent}>Gatherings</Text>
            {'\n'}& Sacred Events
          </Text>
          <Text style={styles.heroDesc}>
            Join Maharaj Ji and thousands of devotees at satsangs, aartis, pravachans,
            and spiritual festivals across India.
          </Text>

          {/* Quick stats */}
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatVal}>{liveEvents.length}</Text>
              <Text style={styles.heroStatLabel}>Live Now</Text>
            </View>
            <View style={[styles.heroStat, styles.heroStatBorder]}>
              <Text style={styles.heroStatVal}>{upcomingEvents.length}</Text>
              <Text style={styles.heroStatLabel}>Upcoming</Text>
            </View>
            <View style={[styles.heroStat, styles.heroStatBorder]}>
              <Text style={styles.heroStatVal}>50K+</Text>
              <Text style={styles.heroStatLabel}>Devotees</Text>
            </View>
            <View style={[styles.heroStat, styles.heroStatBorder]}>
              <Text style={styles.heroStatVal}>12+</Text>
              <Text style={styles.heroStatLabel}>Cities</Text>
            </View>
          </View>
        </View>

        {/* ── Live Events Banner ── */}
        {liveEvents.length > 0 && (
          <View style={styles.liveBanner}>
            <View style={styles.liveBannerLeft}>
              <View style={styles.livePillLarge}>
                <View style={styles.liveDotLarge} />
                <Text style={styles.livePillLargeText}>LIVE NOW</Text>
              </View>
              <Text style={styles.liveBannerTitle}>{liveEvents[0].title}</Text>
              <Text style={styles.liveBannerSub}>{liveEvents[0].location}</Text>
            </View>
            <TouchableOpacity
              style={styles.joinLiveBtn}
              activeOpacity={0.85}
              onPress={() => setSelectedEvent(liveEvents[0])}
            >
              <FontAwesome name="play-circle" size={14} color="#fff" />
              <Text style={styles.joinLiveBtnText}>Join</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Category Filter ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.8}
            >
              <Text style={[styles.categoryChipText, activeCategory === cat && styles.categoryChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Events count ── */}
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
          </Text>
          <TouchableOpacity style={styles.sortBtn}>
            <MaterialCommunityIcons name="sort-calendar-ascending" size={14} color={COLORS.goldDark} />
            <Text style={styles.sortText}>By Date</Text>
          </TouchableOpacity>
        </View>

        {/* ── Event Cards ── */}
        <View style={styles.eventsList}>
          {filtered.map((item) => (
            <EventCard
              key={item.id}
              item={item}
              onRegister={(e) => setSelectedEvent(e)}
            />
          ))}
        </View>

        {/* ── Past Events ── */}
        <View style={styles.pastSection}>
          <View style={styles.pastHeader}>
            <MaterialCommunityIcons name="history" size={16} color={COLORS.richBrown} />
            <Text style={styles.pastHeaderTitle}>Past Events</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pastRow}>
            {PAST_EVENTS.map((e) => (
              <View key={e.id} style={styles.pastCard}>
                <Text style={styles.pastCardIcon}>{e.icon}</Text>
                <Text style={styles.pastCardTitle} numberOfLines={2}>{e.title}</Text>
                <Text style={styles.pastCardDate}>{e.date}</Text>
                <View style={styles.pastCardAttendees}>
                  <FontAwesome name="users" size={9} color={COLORS.goldDark} />
                  <Text style={styles.pastCardAttendeesText}>{e.attendees}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ── Notify Me CTA ── */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaEmoji}>🔔</Text>
          <Text style={styles.ctaHeading}>Never Miss an Event</Text>
          <Text style={styles.ctaDesc}>
            Get notified about upcoming satsangs, live aartis, and festivals
            by Maharaj Ji directly on your device.
          </Text>
          <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85}>
            <MaterialCommunityIcons name="bell-ring-outline" size={15} color={COLORS.deepBrown} />
            <Text style={styles.ctaBtnText}>Enable Event Notifications</Text>
          </TouchableOpacity>
          <Text style={styles.ctaNote}>🕉️  Jai Shri Krishna • GIEO Gita</Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* ── Registration Modal ── */}
      {selectedEvent && (
        <RegisterModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </View>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: COLORS.cream },
  scroll: { flex: 1 },

  /* Hero */
  hero: {
    backgroundColor: COLORS.richBrown,
    margin: 20, borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.35)',
  },
  heroBadge: {
    alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(201,162,39,0.15)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.35)', marginBottom: 12,
  },
  heroBadgeText: { color: COLORS.goldLight, fontSize: 10, fontWeight: '700' },
  heroHeading:   { color: COLORS.cream, fontSize: 22, fontWeight: '800', lineHeight: 30, marginBottom: 10 },
  heroAccent:    { color: COLORS.goldLight },
  heroDesc:      { color: 'rgba(253,246,227,0.65)', fontSize: 12, lineHeight: 18, fontStyle: 'italic', marginBottom: 16 },
  heroStatsRow: {
    flexDirection: 'row', backgroundColor: 'rgba(201,162,39,0.1)',
    borderRadius: 12, paddingVertical: 12,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.2)',
  },
  heroStat:       { flex: 1, alignItems: 'center' },
  heroStatBorder: { borderLeftWidth: 1, borderLeftColor: 'rgba(201,162,39,0.25)' },
  heroStatVal:    { color: COLORS.goldLight, fontSize: 16, fontWeight: '800' },
  heroStatLabel:  { color: 'rgba(253,246,227,0.5)', fontSize: 9, marginTop: 2, fontStyle: 'italic' },

  /* Live banner */
  liveBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.richBrown,
    marginHorizontal: 20, marginBottom: 12, borderRadius: 14, padding: 14,
    borderWidth: 1.5, borderColor: COLORS.liveRed,
    gap: 12,
  },
  liveBannerLeft: { flex: 1 },
  livePillLarge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(229,57,53,0.2)', borderRadius: 20,
    alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 3,
    borderWidth: 1, borderColor: 'rgba(229,57,53,0.5)', marginBottom: 6,
  },
  liveDotLarge:      { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.liveRed },
  livePillLargeText: { color: COLORS.liveRed, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  liveBannerTitle:   { color: COLORS.cream, fontSize: 13, fontWeight: '700', marginBottom: 3 },
  liveBannerSub:     { color: 'rgba(253,246,227,0.5)', fontSize: 10, fontStyle: 'italic' },
  joinLiveBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.liveRed, borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 14,
  },
  joinLiveBtnText: { color: '#fff', fontSize: 12, fontWeight: '800' },

  /* Categories */
  categoriesRow: { paddingHorizontal: 20, gap: 8, marginBottom: 4, paddingBottom: 4 },
  categoryChip: {
    backgroundColor: COLORS.richBrown, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
  },
  categoryChipActive: { backgroundColor: COLORS.goldLight, borderColor: COLORS.goldDark },
  categoryChipText:   { color: 'rgba(253,246,227,0.6)', fontSize: 11, fontWeight: '600' },
  categoryChipTextActive: { color: COLORS.deepBrown, fontWeight: '800' },

  /* Count row */
  countRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: 20, marginTop: 12, marginBottom: 8,
  },
  countText: { color: COLORS.richBrown, fontSize: 12, fontWeight: '700' },
  sortBtn:   { flexDirection: 'row', alignItems: 'center', gap: 5 },
  sortText:  { color: COLORS.goldDark, fontSize: 11, fontWeight: '600' },

  /* Event cards */
  eventsList: { marginHorizontal: 20, gap: 14, marginBottom: 8 },
  eventCard: {
    backgroundColor: COLORS.richBrown, borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
    overflow: 'hidden',
  },
  eventCardHighlight: {
    borderColor: COLORS.goldLight, borderWidth: 1.5,
  },
  featuredBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.goldLight,
    paddingHorizontal: 12, paddingVertical: 5, justifyContent: 'center',
  },
  featuredBannerText: { color: COLORS.deepBrown, fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },

  eventTop: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, paddingBottom: 8 },
  eventIconBox: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(201,162,39,0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.3)',
  },
  eventIconText: { fontSize: 22 },
  eventTopMid:   { flex: 1, gap: 4 },

  livePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(229,57,53,0.18)', borderRadius: 20,
    alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: 'rgba(229,57,53,0.45)',
  },
  liveDot:      { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.liveRed },
  livePillText: { color: COLORS.liveRed, fontSize: 8, fontWeight: '800', letterSpacing: 1 },

  upcomingPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(201,162,39,0.15)', borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.3)',
  },
  upcomingPillText: { color: COLORS.goldLight, fontSize: 8, fontWeight: '700', letterSpacing: 0.5 },

  eventCategory: { color: 'rgba(253,246,227,0.45)', fontSize: 9, fontStyle: 'italic' },
  expandBtn: { padding: 4 },

  eventTitle: { color: COLORS.cream, fontSize: 15, fontWeight: '800', paddingHorizontal: 14, marginBottom: 10, lineHeight: 20 },

  eventMetaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 14, marginBottom: 10 },
  eventMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  eventMetaText: { color: 'rgba(253,246,227,0.6)', fontSize: 10 },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 14, marginBottom: 12 },
  tag: {
    backgroundColor: 'rgba(201,162,39,0.1)', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.2)',
  },
  tagText: { color: COLORS.goldLight, fontSize: 9, fontWeight: '600' },

  expandedSection: { paddingHorizontal: 14, paddingBottom: 4 },
  expandDivider:   { height: 1, backgroundColor: 'rgba(201,162,39,0.15)', marginBottom: 12 },
  eventDesc: { color: 'rgba(253,246,227,0.6)', fontSize: 11, lineHeight: 17, fontStyle: 'italic', marginBottom: 12 },

  speakersRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 12, flexWrap: 'wrap' },
  speakersLabel: { color: 'rgba(253,246,227,0.45)', fontSize: 10 },
  speakersNames: { color: COLORS.goldLight, fontSize: 10, fontWeight: '700', flex: 1 },

  seatsBox: { backgroundColor: 'rgba(201,162,39,0.08)', borderRadius: 10, padding: 10, marginBottom: 10 },
  seatsTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  seatsLabel:  { color: 'rgba(253,246,227,0.5)', fontSize: 10 },
  seatsCount:  { color: COLORS.goldLight, fontSize: 10, fontWeight: '700' },
  progressBg:  { height: 6, backgroundColor: 'rgba(201,162,39,0.15)', borderRadius: 3, marginBottom: 5 },
  progressFill: { height: 6, backgroundColor: COLORS.goldLight, borderRadius: 3 },
  seatsHint:   { color: 'rgba(253,246,227,0.4)', fontSize: 9, fontStyle: 'italic' },

  eventFooter: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 14, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: 'rgba(201,162,39,0.12)',
  },
  registerBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
    backgroundColor: COLORS.goldLight, borderRadius: 10, paddingVertical: 11,
  },
  registerBtnLive: { backgroundColor: COLORS.liveRed },
  registerBtnText: { color: COLORS.deepBrown, fontSize: 12, fontWeight: '800' },
  shareBtn: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: 'rgba(201,162,39,0.1)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.2)',
  },

  /* Past events */
  pastSection: { marginTop: 16, marginBottom: 8 },
  pastHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 20, marginBottom: 12,
  },
  pastHeaderTitle: { color: COLORS.richBrown, fontSize: 15, fontWeight: '800' },
  pastRow: { paddingHorizontal: 20, gap: 10 },
  pastCard: {
    width: 140, backgroundColor: COLORS.richBrown, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
  },
  pastCardIcon:  { fontSize: 26, marginBottom: 8 },
  pastCardTitle: { color: COLORS.cream, fontSize: 11, fontWeight: '700', marginBottom: 4, lineHeight: 15 },
  pastCardDate:  { color: 'rgba(253,246,227,0.45)', fontSize: 9, fontStyle: 'italic', marginBottom: 6 },
  pastCardAttendees: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  pastCardAttendeesText: { color: COLORS.goldLight, fontSize: 9, fontWeight: '700' },

  /* CTA */
  ctaCard: {
    backgroundColor: COLORS.richBrown, margin: 20, borderRadius: 18, padding: 20,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(201,162,39,0.4)',
  },
  ctaEmoji:   { fontSize: 36, marginBottom: 10 },
  ctaHeading: { color: COLORS.cream, fontSize: 17, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  ctaDesc: {
    color: 'rgba(253,246,227,0.6)', fontSize: 11, fontStyle: 'italic',
    textAlign: 'center', lineHeight: 17, marginBottom: 16,
  },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.goldLight, borderRadius: 10,
    paddingVertical: 13, paddingHorizontal: 24, marginBottom: 12,
  },
  ctaBtnText: { color: COLORS.deepBrown, fontSize: 13, fontWeight: '800' },
  ctaNote:    { color: 'rgba(253,246,227,0.35)', fontSize: 10, fontStyle: 'italic' },

  /* Modal */
  modalOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.richBrown, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, paddingBottom: 36,
    borderTopWidth: 1, borderTopColor: 'rgba(201,162,39,0.4)',
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(201,162,39,0.4)', alignSelf: 'center', marginBottom: 16,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 20 },
  modalIcon:   { fontSize: 32 },
  modalTitle:  { color: COLORS.cream, fontSize: 15, fontWeight: '800', lineHeight: 20, marginBottom: 4 },
  modalDate:   { color: 'rgba(253,246,227,0.5)', fontSize: 10, fontStyle: 'italic' },
  modalCloseBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(201,162,39,0.12)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
  },
  modalSuccessBox: {
    alignItems: 'center', backgroundColor: 'rgba(76,175,80,0.1)',
    borderRadius: 14, padding: 18, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(76,175,80,0.25)',
  },
  modalSuccessTitle: { color: COLORS.cream, fontSize: 16, fontWeight: '800', marginTop: 10, marginBottom: 8 },
  modalSuccessDesc:  { color: 'rgba(253,246,227,0.6)', fontSize: 11, fontStyle: 'italic', textAlign: 'center', lineHeight: 17 },
  modalInfoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(201,162,39,0.12)',
  },
  modalInfoText: { color: 'rgba(253,246,227,0.65)', fontSize: 11 },
  modalDoneBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.goldLight, borderRadius: 12,
    paddingVertical: 14, marginTop: 16,
  },
  modalDoneBtnText: { color: COLORS.deepBrown, fontSize: 13, fontWeight: '800' },
});
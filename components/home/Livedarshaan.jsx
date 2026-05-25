import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from './constant';
import { SectionHeader } from './Sharedui';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

const cameras = [
  {
    id: 1,
    location: 'Kurukshetra',
    temple: 'Brahma Sarovar Mandir',
    description: 'Sacred birthplace of the Bhagwad Gita',
    icon: '🛕',
    status: 'live',
    viewers: '2.4K',
    currentEvent: 'Morning Aarti',
    time: '6:00 AM',
    tags: ['Aarti', 'Mandir'],
  },
  {
    id: 2,
    location: 'Vrindavan',
    temple: 'Banke Bihari Mandir',
    description: 'The eternal abode of Shri Krishna',
    icon: '🪔',
    status: 'live',
    viewers: '5.1K',
    currentEvent: 'Mangala Aarti',
    time: '5:30 AM',
    tags: ['Krishna', 'Aarti'],
  },
  {
    id: 3,
    location: 'Haridwar',
    temple: 'Har Ki Pauri Ghat',
    description: 'Gateway to moksha on the sacred Ganga',
    icon: '🌊',
    status: 'live',
    viewers: '8.7K',
    currentEvent: 'Ganga Aarti',
    time: '7:00 PM',
    tags: ['Ganga', 'Ghat'],
  },
  {
    id: 4,
    location: 'Mathura',
    temple: 'Shri Krishna Janmabhoomi',
    description: 'Birthplace of Bhagwan Shri Krishna',
    icon: '✨',
    status: 'upcoming',
    viewers: '—',
    currentEvent: 'Starts at 4:00 PM',
    time: '4:00 PM',
    tags: ['Krishna', 'Janmabhoomi'],
  },
];

const schedule = [
  { time: '5:30 AM', event: 'Mangala Aarti', location: 'Vrindavan' },
  { time: '6:00 AM', event: 'Morning Aarti', location: 'Kurukshetra' },
  { time: '12:00 PM', event: 'Madhyanha Aarti', location: 'All Temples' },
  { time: '7:00 PM', event: 'Ganga Aarti', location: 'Haridwar' },
  { time: '8:00 PM', event: 'Sandhya Aarti', location: 'Vrindavan' },
  { time: '9:00 PM', event: 'Shayan Aarti', location: 'Mathura' },
];

function PulseDot({ color = COLORS.liveRed || '#E53935' }) {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.15, duration: 600, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return <Animated.View style={[styles.pulseDot, { backgroundColor: color, opacity: anim }]} />;
}

function CameraCard({ cam, isActive, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isLive = cam.status === 'live';

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={handlePress}
        style={[styles.cameraCard, isActive && styles.cameraCardActive]}
      >
        {/* Fake video screen */}
        <View style={styles.videoScreen}>
          <View style={styles.videoOverlay}>
            {/* Top row */}
            <View style={styles.videoTopRow}>
              {isLive ? (
                <View style={styles.liveBadge}>
                  <PulseDot />
                  <Text style={styles.liveBadgeText}>LIVE</Text>
                </View>
              ) : (
                <View style={styles.upcomingBadge}>
                  <Text style={styles.upcomingBadgeText}>UPCOMING</Text>
                </View>
              )}
              {isLive && (
                <View style={styles.viewersBadge}>
                  <FontAwesome name="eye" size={9} color="rgba(255,255,255,0.85)" />
                  <Text style={styles.viewersText}>{cam.viewers}</Text>
                </View>
              )}
            </View>

            {/* Center play */}
            <View style={styles.playCircle}>
              <FontAwesome name={isLive ? 'play' : 'clock-o'} size={20} color={COLORS.goldLight} />
            </View>

            {/* Bottom info */}
            <View style={styles.videoBottom}>
              <Text style={styles.videoIcon}>{cam.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.videoLocation}>{cam.location}</Text>
                <Text style={styles.videoTemple} numberOfLines={1}>{cam.temple}</Text>
              </View>
            </View>
          </View>

          {/* Decorative scan lines */}
          <View style={styles.scanLine1} />
          <View style={styles.scanLine2} />
        </View>

        {/* Card body */}
        <View style={styles.cardBody}>
          <View style={styles.cardBodyTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardLocation}>{cam.location}</Text>
              <Text style={styles.cardTemple}>{cam.temple}</Text>
              <Text style={styles.cardDesc}>{cam.description}</Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <View style={styles.eventPill}>
              <FontAwesome name="music" size={8} color={COLORS.goldLight} />
              <Text style={styles.eventPillText}>{cam.currentEvent}</Text>
            </View>
            <Text style={styles.cardTime}>{cam.time}</Text>
          </View>
          <View style={styles.tagsRow}>
            {cam.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function LiveDarshan() {
  const [activeId, setActiveId] = useState(1);
  const scrollRef = useRef(null);
  const activeCount = cameras.filter((c) => c.status === 'live').length;

  return (
    <>
      <SectionHeader title="🔴 Live" accent="Darshan" />

      {/* ── Top summary banner ── */}
      <View style={styles.summaryBanner}>
        <View style={styles.summaryLeft}>
          <PulseDot />
          <Text style={styles.summaryLiveText}>{activeCount} Cameras Live</Text>
        </View>
        <View style={styles.summaryRight}>
          <FontAwesome name="users" size={10} color={COLORS.goldLight} />
          <Text style={styles.summaryViewers}>16.2K watching</Text>
        </View>
      </View>

      {/* ── Camera cards scroll ── */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 12}
      >
        {cameras.map((cam) => (
          <View key={cam.id} style={{ width: CARD_WIDTH, marginRight: 12 }}>
            <CameraCard
              cam={cam}
              isActive={activeId === cam.id}
              onPress={() => setActiveId(cam.id)}
            />
          </View>
        ))}
      </ScrollView>

      {/* ── Dot indicators ── */}
      <View style={styles.dotsRow}>
        {cameras.map((cam) => (
          <TouchableOpacity
            key={cam.id}
            onPress={() => {
              setActiveId(cam.id);
              scrollRef.current?.scrollTo({ x: (cam.id - 1) * (CARD_WIDTH + 12), animated: true });
            }}
          >
            <View style={[styles.pageDot, activeId === cam.id && styles.pageDotActive]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Quick location tabs ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
        {cameras.map((cam) => (
          <TouchableOpacity
            key={cam.id}
            style={[styles.locationTab, activeId === cam.id && styles.locationTabActive]}
            activeOpacity={0.8}
            onPress={() => {
              setActiveId(cam.id);
              scrollRef.current?.scrollTo({ x: (cam.id - 1) * (CARD_WIDTH + 12), animated: true });
            }}
          >
            <Text style={styles.locationTabIcon}>{cam.icon}</Text>
            <Text style={[styles.locationTabText, activeId === cam.id && styles.locationTabTextActive]}>
              {cam.location}
            </Text>
            {cam.status === 'live' && <View style={styles.tabLiveDot} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Aarti Schedule ── */}
      <View style={styles.scheduleCard}>
        <View style={styles.scheduleHeader}>
          <Text style={styles.scheduleHeaderIcon}>🗓️</Text>
          <Text style={styles.scheduleHeaderTitle}>Today's Aarti Schedule</Text>
        </View>
        {schedule.map((s, i) => (
          <View key={s.event} style={[styles.scheduleRow, i === schedule.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={styles.scheduleTimePill}>
              <Text style={styles.scheduleTimePillText}>{s.time}</Text>
            </View>
            <View style={styles.scheduleDetails}>
              <Text style={styles.scheduleEvent}>{s.event}</Text>
              <Text style={styles.scheduleLocation}>{s.location}</Text>
            </View>
            <FontAwesome name="bell-o" size={11} color="rgba(201,162,39,0.45)" />
          </View>
        ))}
      </View>

      {/* ── Watch CTA ── */}
      <TouchableOpacity style={styles.watchAllBtn} activeOpacity={0.85}>
        <FontAwesome name="video-camera" size={13} color="#2C1A0E" />
        <Text style={styles.watchAllText}>Watch All Live Cameras</Text>
        <FontAwesome name="chevron-right" size={11} color="#2C1A0E" />
      </TouchableOpacity>

    </>
  );
}

const styles = StyleSheet.create({
  /* Summary banner */
  summaryBanner: {
    marginHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.richBrown,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.3)',
  },
  summaryLeft: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  summaryLiveText: { color: COLORS.cream, fontSize: 12, fontWeight: '700' },
  summaryRight: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  summaryViewers: { color: COLORS.goldLight, fontSize: 11, fontWeight: '600' },

  pulseDot: { width: 8, height: 8, borderRadius: 4 },

  /* Scroll */
  scrollContent: { paddingHorizontal: 20, paddingBottom: 4 },

  /* Camera card */
  cameraCard: {
    backgroundColor: COLORS.richBrown,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.25)',
    overflow: 'hidden',
  },
  cameraCardActive: {
    borderColor: 'rgba(201,162,39,0.7)',
    borderWidth: 1.5,
  },

  /* Video screen */
  videoScreen: {
    height: 180,
    backgroundColor: '#0D0A06',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  videoOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    padding: 12,
    justifyContent: 'space-between',
  },
  videoTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(229,57,53,0.85)',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4,
  },
  liveBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  upcomingBadge: {
    backgroundColor: 'rgba(201,162,39,0.75)',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4,
  },
  upcomingBadgeText: { color: '#2C1A0E', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  viewersBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 6, paddingHorizontal: 7, paddingVertical: 4,
  },
  viewersText: { color: 'rgba(255,255,255,0.85)', fontSize: 9, fontWeight: '600' },
  playCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(201,162,39,0.18)',
    borderWidth: 1.5, borderColor: 'rgba(201,162,39,0.55)',
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
  },
  videoBottom: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 10, padding: 8,
  },
  videoIcon: { fontSize: 18 },
  videoLocation: { color: COLORS.goldLight, fontSize: 11, fontWeight: '800' },
  videoTemple: { color: 'rgba(255,255,255,0.7)', fontSize: 9, marginTop: 1 },
  scanLine1: {
    position: 'absolute', top: '33%', left: 0, right: 0,
    height: 1, backgroundColor: 'rgba(201,162,39,0.06)',
  },
  scanLine2: {
    position: 'absolute', top: '66%', left: 0, right: 0,
    height: 1, backgroundColor: 'rgba(201,162,39,0.06)',
  },

  /* Card body */
  cardBody: { padding: 14 },
  cardBodyTop: { flexDirection: 'row', marginBottom: 10 },
  cardLocation: { color: COLORS.goldLight, fontSize: 11, fontWeight: '800', marginBottom: 1 },
  cardTemple: { color: COLORS.cream, fontSize: 13, fontWeight: '700', marginBottom: 3 },
  cardDesc: { color: 'rgba(253,246,227,0.5)', fontSize: 10, fontStyle: 'italic', lineHeight: 14 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  eventPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(201,162,39,0.12)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
  },
  eventPillText: { color: COLORS.goldLight, fontSize: 10, fontWeight: '600' },
  cardTime: { color: 'rgba(253,246,227,0.45)', fontSize: 10 },
  tagsRow: { flexDirection: 'row', gap: 6 },
  tag: {
    backgroundColor: 'rgba(201,162,39,0.1)',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.2)',
  },
  tagText: { color: 'rgba(253,246,227,0.55)', fontSize: 9 },

  /* Dots */
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginVertical: 10 },
  pageDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(201,162,39,0.25)' },
  pageDotActive: { width: 18, borderRadius: 3, backgroundColor: COLORS.goldLight },

  /* Location tabs */
  tabsRow: { paddingHorizontal: 20, gap: 8, marginBottom: 14 },
  locationTab: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.richBrown,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
  },
  locationTabActive: { borderColor: COLORS.goldLight, backgroundColor: 'rgba(201,162,39,0.15)' },
  locationTabIcon: { fontSize: 13 },
  locationTabText: { color: 'rgba(253,246,227,0.55)', fontSize: 11, fontWeight: '600' },
  locationTabTextActive: { color: COLORS.goldLight },
  tabLiveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.liveRed || '#E53935' },

  /* Schedule */
  scheduleCard: {
    backgroundColor: COLORS.richBrown,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.3)',
    marginBottom: 14,
  },
  scheduleHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  scheduleHeaderIcon: { fontSize: 16 },
  scheduleHeaderTitle: { color: COLORS.cream, fontSize: 14, fontWeight: '800' },
  scheduleRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: 'rgba(201,162,39,0.1)',
  },
  scheduleTimePill: {
    backgroundColor: 'rgba(201,162,39,0.12)',
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
    minWidth: 65, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.2)',
  },
  scheduleTimePillText: { color: COLORS.goldLight, fontSize: 9, fontWeight: '700' },
  scheduleDetails: { flex: 1 },
  scheduleEvent: { color: COLORS.cream, fontSize: 12, fontWeight: '700' },
  scheduleLocation: { color: 'rgba(253,246,227,0.45)', fontSize: 9, marginTop: 1, fontStyle: 'italic' },

  /* Watch all CTA */
  watchAllBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.goldLight,
    marginHorizontal: 20, borderRadius: 12,
    paddingVertical: 14, marginBottom: 16,
  },
  watchAllText: { color: '#2C1A0E', fontSize: 13, fontWeight: '800' },
});
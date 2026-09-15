import Card from '@/components/ui/Card';
import { COLORS, RGB } from '@/constants/brandColors';
import { hairline, radii, spacing, type } from '@/constants/theme';
import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
    description: 'The eternal abode of Shri Krishan',
    icon: '🪔',
    status: 'live',
    viewers: '5.1K',
    currentEvent: 'Mangala Aarti',
    time: '5:30 AM',
    tags: ['Krishan', 'Aarti'],
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
    temple: 'Shri Krishan Janmabhoomi',
    description: 'Birthplace of Bhagwan Shri Krishan',
    icon: '✨',
    status: 'upcoming',
    viewers: '—',
    currentEvent: 'Starts at 4:00 PM',
    time: '4:00 PM',
    tags: ['Krishan', 'Janmabhoomi'],
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

function PulseDot({ color = COLORS.liveRed }) {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 0.15,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);
  return (
    <Animated.View
      style={[styles.pulseDot, { backgroundColor: color, opacity: anim }]}
    />
  );
}

function CameraCard({ cam, isActive, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isLive = cam.status === 'live';

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity activeOpacity={0.92} onPress={handlePress}>
        <Card
          radius={radii.xl}
          style={[styles.cameraCard, isActive && styles.cameraCardActive]}>
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
                    <FontAwesome
                      name="eye"
                      size={9}
                      color="rgba(255,255,255,0.85)"
                    />
                    <Text style={styles.viewersText}>{cam.viewers}</Text>
                  </View>
                )}
              </View>

              {/* Center play */}
              <View style={styles.playCircle}>
                <FontAwesome
                  name={isLive ? 'play' : 'clock-o'}
                  size={20}
                  color={COLORS.goldLight}
                />
              </View>

              {/* Bottom info */}
              <View style={styles.videoBottom}>
                <Text style={styles.videoIcon}>{cam.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.videoLocation}>{cam.location}</Text>
                  <Text style={styles.videoTemple} numberOfLines={1}>
                    {cam.temple}
                  </Text>
                </View>
              </View>
            </View>
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
                <FontAwesome name="music" size={8} color={COLORS.saffron} />
                <Text style={styles.eventPillText}>{cam.currentEvent}</Text>
              </View>
              <Text style={styles.cardTime}>{cam.time}</Text>
            </View>
            <View style={styles.tagsRow}>
              {cam.tags.map(tag => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function LiveDarshan() {
  const [activeId, setActiveId] = useState(1);
  const scrollRef = useRef(null);
  const activeCount = cameras.filter(c => c.status === 'live').length;

  return (
    <>
      <SectionHeader title="🔴 Live" accent="Darshan" />

      {/* ── Top summary banner ── */}
      <Card radius={radii.lg} style={styles.summaryBanner}>
        <View style={styles.summaryLeft}>
          <PulseDot />
          <Text style={styles.summaryLiveText}>{activeCount} Cameras Live</Text>
        </View>
        <View style={styles.summaryRight}>
          <FontAwesome name="users" size={10} color={COLORS.saffron} />
          <Text style={styles.summaryViewers}>16.2K watching</Text>
        </View>
      </Card>

      {/* ── Camera cards scroll ── */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 12}>
        {cameras.map(cam => (
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
        {cameras.map(cam => (
          <TouchableOpacity
            key={cam.id}
            onPress={() => {
              setActiveId(cam.id);
              scrollRef.current?.scrollTo({
                x: (cam.id - 1) * (CARD_WIDTH + 12),
                animated: true,
              });
            }}>
            <View
              style={[
                styles.pageDot,
                activeId === cam.id && styles.pageDotActive,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Quick location tabs ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}>
        {cameras.map(cam => (
          <TouchableOpacity
            key={cam.id}
            style={[
              styles.locationTab,
              activeId === cam.id && styles.locationTabActive,
            ]}
            activeOpacity={0.8}
            onPress={() => {
              setActiveId(cam.id);
              scrollRef.current?.scrollTo({
                x: (cam.id - 1) * (CARD_WIDTH + 12),
                animated: true,
              });
            }}>
            <Text style={styles.locationTabIcon}>{cam.icon}</Text>
            <Text
              style={[
                styles.locationTabText,
                activeId === cam.id && styles.locationTabTextActive,
              ]}>
              {cam.location}
            </Text>
            {cam.status === 'live' && <View style={styles.tabLiveDot} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Aarti Schedule ── */}
      <Card radius={radii.xl} style={styles.scheduleCard}>
        <View style={styles.scheduleHeader}>
          <Text style={styles.scheduleHeaderIcon}>🗓️</Text>
          <Text style={styles.scheduleHeaderTitle}>
            Today&apos;s Aarti Schedule
          </Text>
        </View>
        {schedule.map((s, i) => (
          <View
            key={s.event}
            style={[
              styles.scheduleRow,
              i === schedule.length - 1 && { borderBottomWidth: 0 },
            ]}>
            <View style={styles.scheduleTimePill}>
              <Text style={styles.scheduleTimePillText}>{s.time}</Text>
            </View>
            <View style={styles.scheduleDetails}>
              <Text style={styles.scheduleEvent}>{s.event}</Text>
              <Text style={styles.scheduleLocation}>{s.location}</Text>
            </View>
            <FontAwesome name="bell-o" size={11} color={COLORS.warmBrown} />
          </View>
        ))}
      </Card>

      {/* ── Watch CTA ── */}
      <TouchableOpacity style={styles.watchAllBtn} activeOpacity={0.85}>
        <FontAwesome name="video-camera" size={13} color={COLORS.white} />
        <Text style={styles.watchAllText}>Watch All Live Cameras</Text>
        <FontAwesome name="chevron-right" size={11} color={COLORS.white} />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  /* Summary banner */
  summaryBanner: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  summaryLiveText: {
    color: COLORS.deepBrown,
    fontSize: 12,
    fontWeight: '700',
  },
  summaryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  summaryViewers: {
    color: COLORS.saffron,
    fontSize: 12,
    fontWeight: '600',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  /* Scroll */
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 4,
  },
  /* Camera card */
  cameraCard: {},
  cameraCardActive: {},
  /* Video screen — a live camera feed placeholder, kept dark on purpose */
  videoScreen: {
    height: 180,
    backgroundColor: '#0D0A06',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    justifyContent: 'space-between',
  },
  videoTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(229,57,53,0.85)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  liveBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  upcomingBadge: {
    backgroundColor: `rgba(${RGB.gold},0.85)`,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  upcomingBadgeText: {
    color: COLORS.deepBrown,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  viewersBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  viewersText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '600',
  },
  playCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: `rgba(${RGB.gold},0.18)`,
    borderWidth: 1.5,
    borderColor: `rgba(${RGB.gold},0.55)`,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  videoBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 10,
    padding: 8,
  },
  videoIcon: {
    fontSize: 18,
  },
  videoLocation: {
    color: COLORS.goldLight,
    fontSize: 12,
    fontWeight: '600',
  },
  videoTemple: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 1,
  },
  /* Card body */
  cardBody: {
    padding: spacing.md,
  },
  cardBodyTop: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  cardLocation: {
    color: COLORS.saffron,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 1,
  },
  cardTemple: {
    color: COLORS.deepBrown,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3,
  },
  cardDesc: {
    color: COLORS.warmBrown,
    fontSize: 12,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  eventPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: `rgba(${RGB.saffron},0.1)`,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  eventPillText: {
    color: COLORS.saffron,
    fontSize: 10,
    fontWeight: '600',
  },
  cardTime: {
    color: COLORS.warmBrown,
    fontSize: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    backgroundColor: COLORS.creamDark,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    color: COLORS.warmBrown,
    fontSize: 10,
  },
  /* Dots */
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginVertical: spacing.sm,
  },
  pageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: hairline,
  },
  pageDotActive: {
    width: 18,
    borderRadius: 3,
    backgroundColor: COLORS.saffron,
  },
  /* Location tabs */
  tabsRow: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  locationTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.creamDark,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  locationTabActive: {
    backgroundColor: `rgba(${RGB.saffron},0.14)`,
  },
  locationTabIcon: {
    fontSize: 13,
  },
  locationTabText: {
    color: COLORS.warmBrown,
    fontSize: 12,
    fontWeight: '600',
  },
  locationTabTextActive: {
    color: COLORS.saffron,
  },
  tabLiveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.liveRed,
  },
  /* Schedule */
  scheduleCard: {
    marginHorizontal: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  scheduleHeaderIcon: {
    fontSize: 16,
  },
  scheduleHeaderTitle: {
    ...type.headline,
    fontSize: 14,
    color: COLORS.deepBrown,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: hairline,
  },
  scheduleTimePill: {
    backgroundColor: `rgba(${RGB.saffron},0.1)`,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    minWidth: 65,
    alignItems: 'center',
  },
  scheduleTimePillText: {
    color: COLORS.saffron,
    fontSize: 10,
    fontWeight: '700',
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleEvent: {
    color: COLORS.deepBrown,
    fontSize: 12,
    fontWeight: '700',
  },
  scheduleLocation: {
    color: COLORS.warmBrown,
    fontSize: 12,
    marginTop: 1,
  },
  /* Watch all CTA */
  watchAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: COLORS.richBrown,
    marginHorizontal: spacing.md,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  watchAllText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
});

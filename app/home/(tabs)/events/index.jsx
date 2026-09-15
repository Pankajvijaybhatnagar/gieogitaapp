// app/home/(tabs)/events/index.jsx
//
// "View all" destination for the home page's Events section — the
// section's "View all »" button already pointed at /home/events, but no
// page existed here (only the [slug] detail route did), so it 404'd.
// Shows the real events from the same API the home section already
// calls, not mock/sample data.

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Card from '@/components/ui/Card';
import Spacer from '@/components/ui/Spacer';
import { COLORS, RGB } from '@/constants/brandColors';
import { radii, shadow, spacing, type } from '@/constants/theme';
import eventServices from '@/lib/services/eventServices';

const PAGE_LIMIT = 10;

// Matches the `/v1/events` API's `upcoming`/`past` boolean filters — 'all'
// simply omits both so the endpoint returns everything.
const TABS = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
];

function formatEventTime(time) {
  if (!time) return '';

  const [hours, minutes] = time.split(':');

  const date = new Date();

  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatEvent(event) {
  const startDate = new Date(
    `${event.start_date}T${event.start_time || '00:00:00'}`,
  );

  const day = startDate.getDate().toString().padStart(2, '0');

  const month = startDate
    .toLocaleString('en-US', { month: 'short' })
    .toUpperCase();

  let eventTime = '';

  if (event.start_date === event.end_date) {
    eventTime = formatEventTime(event.start_time);

    if (event.end_time) {
      eventTime += ` – ${formatEventTime(event.end_time)}`;
    }
  } else {
    const startTime = formatEventTime(event.start_time);
    const endTime = formatEventTime(event.end_time);

    eventTime = [startTime, endTime].filter(Boolean).join(' – ');
  }

  const location = [event.location_name, event.location_address]
    .filter(Boolean)
    .join(', ');

  let tag = 'EVENT';

  if (event.event_type === 'other') {
    tag = 'DIVINE EVENT';
  } else if (event.event_type) {
    tag = event.event_type.toUpperCase();
  }

  return {
    ...event,
    id: String(event.id),
    day,
    month,
    location,
    time: eventTime,
    tag,
  };
}

function Hero() {
  return (
    <View style={styles.hero}>
      <View style={styles.heroBanner}>
        <View style={styles.heroPatternOne} />
        <View style={styles.heroPatternTwo} />
        <Text style={styles.heroOm}>GITA SATSANG</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.heroIconRing}>
        <View style={styles.heroIcon}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color={COLORS.richBrown}
          />
        </View>
      </View>

      <Text style={styles.heroTitle}>Events &amp; Satsangs</Text>
    </View>
  );
}

function TabBar({ active, onChange }) {
  return (
    <View style={styles.tabBar}>
      {TABS.map(tab => {
        const isActive = tab.key === active;

        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.85}
            onPress={() => onChange(tab.key)}
            style={[styles.tabPill, isActive && styles.tabPillActive]}>
            <Text
              style={[
                styles.tabPillText,
                isActive && styles.tabPillTextActive,
              ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function EventRow({ item }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push(`/home/events/${item.slug}`)}
      style={styles.rowWrap}>
      <Card radius={radii.xl} style={styles.card}>
        <View style={styles.cardTop}>
          {item.cover_image_full_url ? (
            <Image
              source={{ uri: item.cover_image_full_url }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.dateBox}>
              <Text style={styles.dateDay}>{item.day}</Text>
              <Text style={styles.dateMonth}>{item.month}</Text>
            </View>
          )}

          <View style={styles.cardInfo}>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>

            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>

            {!!item.location && (
              <Text style={styles.cardMeta} numberOfLines={1}>
                📍 {item.location}
              </Text>
            )}

            {!!item.time && (
              <Text style={styles.cardMeta} numberOfLines={1}>
                ⏰ {item.time}
              </Text>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export default function EventsListScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Guards against a slow earlier request (e.g. from a tab the user has
  // since left) overwriting the list once a newer one has already landed.
  const requestIdRef = useRef(0);

  const fetchPage = useCallback(async (tab, pageNum, append = false) => {
    const requestId = ++requestIdRef.current;

    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const filters = { page: pageNum, limit: PAGE_LIMIT };

      if (tab === 'upcoming') filters.upcoming = true;
      if (tab === 'past') filters.past = true;

      const response = await eventServices.getPublicEvents(filters);

      if (requestId !== requestIdRef.current) return;

      const body = response?.data;
      const raw = body?.data;

      if (response?.success && body?.status && Array.isArray(raw)) {
        const formatted = raw.map(formatEvent);

        setEvents(prev => (append ? [...prev, ...formatted] : formatted));
        setTotalPages(body.total_pages || 1);
        setPage(pageNum);
      } else if (!append) {
        setEvents([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching events list:', error);

      if (!append) setEvents([]);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchPage(activeTab, 1);
  }, [activeTab, fetchPage]);

  const handleTabChange = tab => {
    if (tab === activeTab || loading) return;

    setEvents([]);
    setPage(1);
    setTotalPages(1);
    setActiveTab(tab);
  };

  const handleEndReached = () => {
    if (loading || loadingMore) return;
    if (page >= totalPages) return;

    fetchPage(activeTab, page + 1, true);
  };

  return (
    <FlatList
      style={styles.root}
      data={events}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
          <Hero />
          <TabBar active={activeTab} onChange={handleTabChange} />
        </>
      }
      renderItem={({ item }) => <EventRow item={item} />}
      onEndReachedThreshold={0.4}
      onEndReached={handleEndReached}
      ListEmptyComponent={
        !loading && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconRing}>
              <Ionicons
                name="calendar-outline"
                size={30}
                color={COLORS.warmBrown}
              />
            </View>
            <Text style={styles.emptyTitle}>No Events Found</Text>
            <Text style={styles.emptyText}>
              {activeTab === 'past'
                ? 'There are no past events to show yet.'
                : 'There are no upcoming events right now. Please check back soon.'}
            </Text>
          </View>
        )
      }
      ListFooterComponent={
        <>
          {loading || loadingMore ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.richBrown} />
            </View>
          ) : events.length > 0 && page >= totalPages ? (
            <Text style={styles.endText}>No more events</Text>
          ) : null}
          <Spacer height={120} />
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },

  /* HERO */
  hero: {
    alignItems: 'center',
    paddingBottom: spacing.xs,
  },
  heroBanner: {
    width: '100%',
    height: 74,
    backgroundColor: COLORS.richBrown,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPatternOne: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    top: -50,
    left: -40,
  },
  heroPatternTwo: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    right: -60,
    top: -70,
  },
  heroOm: {
    color: 'rgba(255,255,255,0.14)',
    fontSize: 20,
    fontWeight: '700',
  },
  backButton: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.sm + 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    ...shadow.raised,
    shadowColor: COLORS.richBrown,
  },
  heroIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: `rgba(${RGB.maroon},0.1)`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.cream,
  },
  heroTitle: {
    marginTop: 6,
    ...type.title,
    fontSize: 17,
    color: COLORS.deepBrown,
    textAlign: 'center',
  },
  /* TABS */
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  tabPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: radii.pill,
    backgroundColor: COLORS.creamDark,
    borderWidth: 1,
    borderColor: `rgba(${RGB.gold},0.35)`,
  },
  tabPillActive: {
    backgroundColor: COLORS.richBrown,
    borderColor: COLORS.richBrown,
  },
  tabPillText: {
    ...type.caption,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.warmBrown,
  },
  tabPillTextActive: {
    color: COLORS.white,
  },

  /* EVENT CARDS */
  rowWrap: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm + 2,
  },
  card: {
    padding: spacing.sm + 2,
  },
  cardTop: {
    flexDirection: 'row',
    gap: spacing.sm + 4,
  },
  cardImage: {
    width: 76,
    height: 76,
    borderRadius: radii.md,
    backgroundColor: COLORS.creamDark,
  },
  dateBox: {
    width: 76,
    height: 76,
    borderRadius: radii.md,
    backgroundColor: `rgba(${RGB.maroon},0.08)`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: {
    ...type.title,
    fontSize: 24,
    color: COLORS.richBrown,
    lineHeight: 28,
  },
  dateMonth: {
    ...type.caption,
    color: COLORS.richBrown,
    fontSize: 11,
    letterSpacing: 1,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  tagBadge: {
    alignSelf: 'flex-start',
    backgroundColor: `rgba(${RGB.saffron},0.12)`,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 2,
  },
  tagText: {
    ...type.caption,
    fontSize: 9,
    color: COLORS.saffron,
  },
  cardTitle: {
    ...type.headline,
    fontSize: 15,
    color: COLORS.deepBrown,
    lineHeight: 20,
  },
  cardMeta: {
    ...type.footnote,
    color: COLORS.warmBrown,
  },

  /* LOADING / EMPTY */
  loadingContainer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  endText: {
    ...type.footnote,
    color: COLORS.warmBrown,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  emptyIconRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...type.headline,
    fontSize: 16,
    color: COLORS.deepBrown,
    marginBottom: spacing.xs,
  },
  emptyText: {
    ...type.body,
    color: COLORS.warmBrown,
    textAlign: 'center',
  },
});
